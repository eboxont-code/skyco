import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createRateApiHandler } from "./rate-api.server";
import { assertValidRateApiResponse } from "./test-utils/rate-api-schema";

const fixedNow = Date.parse("2026-11-13T12:00:00.000Z");
const fixedIso = "2026-11-13T12:00:00.000Z";
const jsonResponse = (body: unknown, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
const latestFiat = () => ({
  date: "2026-11-12",
  rates: { AUD: 1.6, EUR: 0.8, INR: 80 },
});
const noNrb = async () => {
  throw new Error("NRB unavailable");
};
const request = (query: string) =>
  new Request(`https://skyco.online/api/v1/rates${query}`);

async function responseBody(response: Response) {
  const body: unknown = await response.json();
  assertValidRateApiResponse(body);
  return body as {
    data?: Record<string, unknown>;
    error?: { code: string; message: string; retryable: boolean };
  };
}

function fiatProvider(requestImpl: typeof fetch) {
  return {
    request: requestImpl,
    loadNrbDays: noNrb,
    now: () => fixedNow,
    nowIso: () => fixedIso,
  };
}

test("GET success normalizes currencies, calculates the amount and filters source-backed history", async () => {
  const handler = createRateApiHandler({
    provider: fiatProvider(async (input) => {
      const url = String(input);
      if (url.includes("/latest?")) return jsonResponse(latestFiat());
      return jsonResponse({
        rates: {
          "2026-11-01": { EUR: 0.4 },
          "2026-11-10": { EUR: 0.5 },
          "2026-11-11": { EUR: 0.55 },
        },
      });
    }),
  });
  const response = await handler(
    request("?from=aud&to=eur&amount=100&history=7d"),
  );
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(body.data?.from, "AUD");
  assert.equal(body.data?.to, "EUR");
  assert.equal(body.data?.rate, 0.5);
  assert.equal(body.data?.convertedAmount, 50);
  assert.equal(body.data?.attribution, "Frankfurter");
  assert.deepEqual(body.data?.history, [
    { date: "2026-11-10", rate: 0.5 },
    { date: "2026-11-11", rate: 0.55 },
  ]);
});

test("NRB fallback keeps the published date, source, stale and fallback flags", async () => {
  const handler = createRateApiHandler({
    provider: {
      request: async () => {
        throw new Error("No fiat fallback request expected");
      },
      loadNrbDays: async () => ({
        days: [
          {
            date: "2026-11-12",
            rates: [
              { currency: { iso3: "USD", unit: 1 }, buy: "130", sell: "132" },
              { currency: { iso3: "AUD", unit: 1 }, buy: "85", sell: "87" },
            ],
          },
        ],
        fallback: true,
      }),
      now: () => fixedNow,
      nowIso: () => fixedIso,
    },
  });
  const response = await handler(request("?from=AUD&to=NPR"));
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(body.data?.rate, 86);
  assert.equal(body.data?.referenceDate, "2026-11-12");
  assert.equal(body.data?.stale, true);
  assert.equal(body.data?.fallback, true);
  assert.equal(body.data?.attribution, "Nepal Rastra Bank");
});

test("missing, unsupported and malformed inputs return UNSUPPORTED_PAIR", async () => {
  const handler = createRateApiHandler({
    loadRate: async () => {
      throw new Error("Invalid input must not reach the provider");
    },
  });
  for (const query of [
    "",
    "?from=XXX&to=EUR",
    "?from=AUD&to=EUR&amount=0",
    "?from=AUD&to=EUR&amount=Infinity",
    "?from=AUD&to=EUR&history=90d",
  ]) {
    const response = await handler(request(query));
    const body = await responseBody(response);
    assert.equal(response.status, 400);
    assert.equal(body.error?.code, "UNSUPPORTED_PAIR");
    assert.equal(body.error?.retryable, false);
  }
});

test("provider timeout returns the documented 504 error without a rate", async () => {
  const handler = createRateApiHandler({
    provider: fiatProvider(async () => {
      throw new DOMException("Timed out", "TimeoutError");
    }),
  });
  const response = await handler(request("?from=AUD&to=EUR"));
  const body = await responseBody(response);
  assert.equal(response.status, 504);
  assert.equal(body.error?.code, "PROVIDER_TIMEOUT");
  assert.equal(body.data, undefined);
});

test("provider 429 returns RATE_LIMITED and preserves a real Retry-After value", async () => {
  const handler = createRateApiHandler({
    provider: fiatProvider(async () => jsonResponse({}, 429, { "Retry-After": "30" })),
  });
  const response = await handler(request("?from=AUD&to=EUR"));
  const body = await responseBody(response);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "30");
  assert.equal(body.error?.code, "RATE_LIMITED");
});

test("malformed JSON returns MALFORMED_UPSTREAM_PAYLOAD without exposing upstream content", async () => {
  const handler = createRateApiHandler({
    provider: fiatProvider(async () => new Response("not-json", { status: 200 })),
  });
  const response = await handler(request("?from=AUD&to=EUR"));
  const body = await responseBody(response);
  assert.equal(response.status, 502);
  assert.equal(body.error?.code, "MALFORMED_UPSTREAM_PAYLOAD");
  assert.equal(JSON.stringify(body).includes("not-json"), false);
});

test("required NRB outage returns NRB_UNAVAILABLE and never substitutes a rate", async () => {
  const handler = createRateApiHandler({
    provider: {
      request: async () => jsonResponse(latestFiat()),
      loadNrbDays: noNrb,
      now: () => fixedNow,
      nowIso: () => fixedIso,
    },
  });
  const response = await handler(request("?from=QAR&to=AUD"));
  const body = await responseBody(response);
  assert.equal(response.status, 503);
  assert.equal(body.error?.code, "NRB_UNAVAILABLE");
  assert.equal(body.data, undefined);
});

test("other provider outages return PROVIDER_UNAVAILABLE when the cache is cold", async () => {
  const handler = createRateApiHandler({
    provider: fiatProvider(async () => jsonResponse({}, 503)),
  });
  const response = await handler(request("?from=AUD&to=EUR"));
  const body = await responseBody(response);
  assert.equal(response.status, 503);
  assert.equal(body.error?.code, "PROVIDER_UNAVAILABLE");
});

test("empty history is a schema-valid partial success with HISTORY_UNAVAILABLE", async () => {
  const handler = createRateApiHandler({
    provider: fiatProvider(async (input) =>
      String(input).includes("/latest?")
        ? jsonResponse(latestFiat())
        : jsonResponse({}, 503),
    ),
  });
  const response = await handler(request("?from=AUD&to=EUR"));
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(body.data?.rate, 0.5);
  assert.equal(body.data?.historyStatus, "unavailable");
  assert.deepEqual(body.data?.history, []);
  const warnings = body.data?.warnings as { code: string }[];
  assert.equal(warnings[0]?.code, "HISTORY_UNAVAILABLE");
});

test("the existing CurrenSee page still uses its server function, not the new HTTP adapter", () => {
  const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  const converter = read("../components/experiences/CurrenSeeConverter.tsx");
  const functions = read("./rates.functions.ts");
  const route = read("../routes/currensee.tsx");
  assert.match(converter, /useServerFn\(getRate\)/);
  assert.match(functions, /await import\("\.\/rate-provider\.server"\)/);
  assert.match(route, /CurrenSeeConverter/);
  assert.doesNotMatch(converter + functions + route, /\/api\/v1\/rates/);
});
