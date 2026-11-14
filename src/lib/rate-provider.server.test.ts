import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateProvider } from "./rate-provider.server";

const fixedNow = Date.parse("2026-11-13T12:00:00.000Z");
const fixedIso = "2026-11-13T12:00:00.000Z";
const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const latestFiat = () => ({
  date: "2026-11-12",
  rates: { AUD: 1.6, EUR: 0.8, INR: 80 },
});

test("Frankfurter provider path returns a dated fiat cross-rate and only published history points", async () => {
  const urls: string[] = [];
  const request: typeof fetch = async (input) => {
    const url = String(input);
    urls.push(url);
    if (url.includes("/latest?")) return jsonResponse(latestFiat());
    if (url.includes("..?base=AUD&symbols=EUR")) {
      return jsonResponse({
        rates: {
          "2026-11-10": { EUR: 0.5 },
          "2026-11-11": { EUR: 0.55 },
        },
      });
    }
    return jsonResponse({}, 404);
  };
  const load = createRateProvider({
    request,
    loadNrbDays: async () => {
      throw new Error("NRB should not be requested for a fiat pair");
    },
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });

  const result = await load("AUD", "EUR");
  assert.equal(result.rate, 0.5);
  assert.equal(result.source, "Frankfurter");
  assert.equal(result.asOf, "2026-11-12");
  assert.equal(result.fetchedAt, fixedIso);
  assert.deepEqual(result.series, [
    { date: "2026-11-10", value: 0.5 },
    { date: "2026-11-11", value: 0.55 },
  ]);
  assert.equal(result.approximate, false);
  assert.equal(urls.length, 2);
  assert.equal(urls.some((url) => url.includes("coingecko")), false);
});

test("CoinGecko provider path converts crypto to fiat and marks cross-currency history approximate", async () => {
  const request: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("/latest?")) return jsonResponse(latestFiat());
    if (url.includes("/simple/price")) {
      return jsonResponse({ bitcoin: { usd: 60000 } });
    }
    if (url.includes("/market_chart")) {
      return jsonResponse({
        prices: [
          [Date.parse("2026-11-10T00:00:00.000Z"), 50000],
          [Date.parse("2026-11-11T00:00:00.000Z"), 55000],
        ],
      });
    }
    return jsonResponse({}, 404);
  };
  const load = createRateProvider({
    request,
    loadNrbDays: async () => ({ days: [], fallback: false }),
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });

  const result = await load("BTC", "AUD");
  assert.equal(result.rate, 96000);
  assert.equal(result.source, "CoinGecko");
  assert.equal(result.approximate, true);
  assert.deepEqual(result.series, [
    { date: "2026-11-10", value: 80000 },
    { date: "2026-11-11", value: 88000 },
  ]);
});

test("NRB provider path applies published units and buy/sell midpoint to the pair and history", async () => {
  const load = createRateProvider({
    request: async () => {
      throw new Error("No external HTTP request should be needed for an NRB pair");
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
      fallback: false,
    }),
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });

  const result = await load("AUD", "NPR");
  assert.equal(result.rate, 86);
  assert.equal(result.source, "Nepal Rastra Bank");
  assert.equal(result.asOf, "2026-11-12");
  assert.equal(result.nrbFallback, false);
  assert.equal(result.stale, false);
  assert.deepEqual(result.series, [{ date: "2026-11-12", value: 86 }]);
});

test("NPR falls back to the official INR 1.6 peg only when NRB is unavailable", async () => {
  const urls: string[] = [];
  const request: typeof fetch = async (input) => {
    const url = String(input);
    urls.push(url);
    return url.includes("/latest?") ? jsonResponse(latestFiat()) : jsonResponse({}, 404);
  };
  const load = createRateProvider({
    request,
    loadNrbDays: async () => {
      throw new Error("NRB unavailable");
    },
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });

  const result = await load("AUD", "NPR");
  assert.equal(result.rate, 80);
  assert.equal(result.source, "Derived from INR at the official 1.6 peg");
  assert.equal(result.stale, false);
  assert.equal("nrbFallback" in result, false);
  assert.deepEqual(result.series, []);
  assert.equal(urls.length, 1);
});

test("QAR fails closed when the required NRB source is unavailable", async () => {
  let requests = 0;
  const load = createRateProvider({
    request: async () => {
      requests++;
      return jsonResponse({}, 404);
    },
    loadNrbDays: async () => {
      throw new Error("NRB unavailable");
    },
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });

  await assert.rejects(load("QAR", "AUD"), /Reference rates unavailable/);
  assert.equal(requests, 0);
});

test("a failed history request leaves a valid current fiat rate and an empty series", async () => {
  const request: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("/latest?")) return jsonResponse(latestFiat());
    return jsonResponse({}, 503);
  };
  const load = createRateProvider({
    request,
    loadNrbDays: async () => ({ days: [], fallback: false }),
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });

  const result = await load("AUD", "EUR");
  assert.equal(result.rate, 0.5);
  assert.deepEqual(result.series, []);
});

test("an expired pair cache returns the exact last good result with a stale flag during an outage", async () => {
  let time = fixedNow;
  let fail = false;
  const request: typeof fetch = async (input) => {
    if (fail) return jsonResponse({}, 503);
    const url = String(input);
    if (url.includes("/latest?")) return jsonResponse(latestFiat());
    if (url.includes("..?base=AUD&symbols=EUR")) {
      return jsonResponse({ rates: { "2026-11-11": { EUR: 0.5 } } });
    }
    return jsonResponse({}, 404);
  };
  const load = createRateProvider({
    request,
    loadNrbDays: async () => ({ days: [], fallback: false }),
    now: () => time,
    nowIso: () => new Date(time).toISOString(),
  });

  const first = await load("AUD", "EUR");
  time += 60001;
  fail = true;
  const stale = await load("AUD", "EUR");
  assert.equal(stale.rate, first.rate);
  assert.equal(stale.source, first.source);
  assert.equal(stale.asOf, first.asOf);
  assert.equal(stale.fetchedAt, first.fetchedAt);
  assert.equal(stale.stale, true);
});
