import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createRateProvider } from "./rate-provider.server";
import type { RateResult } from "./rates.shared";

type Schema = {
  $ref?: string;
  oneOf?: Schema[];
  type?: string;
  enum?: unknown[];
  const?: unknown;
  pattern?: string;
  format?: string;
  minLength?: number;
  exclusiveMinimum?: number;
  minimum?: number;
  required?: string[];
  properties?: Record<string, Schema>;
  additionalProperties?: boolean;
  items?: Schema;
  definitions?: Record<string, Schema>;
  examples?: unknown[];
};

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const schema = JSON.parse(read("../../docs/rates/rate-api-contract-v1.schema.json")) as Schema;

function resolveRef(ref: string, root: Schema): Schema {
  assert.ok(ref.startsWith("#/definitions/"), `Only local definitions are supported: ${ref}`);
  const name = ref.slice("#/definitions/".length);
  const resolved = root.definitions?.[name];
  assert.ok(resolved, `Missing schema definition: ${name}`);
  return resolved;
}

/** Validate the draft-07 features used by this contract without adding a package. */
function validationErrors(value: unknown, current: Schema, root: Schema, path = "$"): string[] {
  if (current.$ref) {
    return validationErrors(value, resolveRef(current.$ref, root), root, path);
  }
  if (current.oneOf) {
    const matches = current.oneOf.filter(
      (candidate) => validationErrors(value, candidate, root, path).length === 0,
    );
    return matches.length === 1 ? [] : [`${path} must match exactly one response variant`];
  }
  if (current.const !== undefined && value !== current.const) {
    return [`${path} must equal the schema constant`];
  }
  if (current.enum && !current.enum.includes(value)) {
    return [`${path} is outside the allowed enum`];
  }
  if (current.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return [`${path} must be an object`];
    }
    const record = value as Record<string, unknown>;
    const errors = (current.required ?? []).flatMap((key) =>
      Object.hasOwn(record, key) ? [] : [`${path}.${key} is required`],
    );
    for (const [key, child] of Object.entries(current.properties ?? {})) {
      if (Object.hasOwn(record, key)) {
        errors.push(...validationErrors(record[key], child, root, `${path}.${key}`));
      }
    }
    if (current.additionalProperties === false) {
      for (const key of Object.keys(record)) {
        if (!Object.hasOwn(current.properties ?? {}, key)) {
          errors.push(`${path}.${key} is not allowed`);
        }
      }
    }
    return errors;
  }
  if (current.type === "array") {
    if (!Array.isArray(value)) return [`${path} must be an array`];
    return value.flatMap((entry, index) =>
      current.items ? validationErrors(entry, current.items, root, `${path}[${index}]`) : [],
    );
  }
  if (current.type === "string") {
    if (typeof value !== "string") return [`${path} must be a string`];
    const errors: string[] = [];
    if (current.pattern && !new RegExp(current.pattern).test(value)) {
      errors.push(`${path} does not match ${current.pattern}`);
    }
    if (current.minLength !== undefined && value.length < current.minLength) {
      errors.push(`${path} is too short`);
    }
    if (current.format === "date-time" && !Number.isFinite(Date.parse(value))) {
      errors.push(`${path} must be a valid date-time`);
    }
    return errors;
  }
  if (current.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return [`${path} must be a finite number`];
    }
    if (current.exclusiveMinimum !== undefined && value <= current.exclusiveMinimum) {
      return [`${path} must be greater than ${current.exclusiveMinimum}`];
    }
    if (current.minimum !== undefined && value < current.minimum) {
      return [`${path} must be at least ${current.minimum}`];
    }
    return [];
  }
  if (current.type === "boolean" && typeof value !== "boolean") {
    return [`${path} must be a boolean`];
  }
  return [];
}

function assertValid(value: unknown) {
  assert.deepEqual(validationErrors(value, schema, schema), []);
}

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

function toContract(result: RateResult, amount = 100) {
  const history = result.series.map((point) => ({ date: point.date, rate: point.value }));
  return {
    data: {
      from: result.from,
      to: result.to,
      amount,
      rate: result.rate,
      convertedAmount: amount * result.rate,
      source: result.source,
      referenceDate: result.asOf,
      fetchedAt: result.fetchedAt,
      stale: result.stale === true,
      approximate: result.approximate,
      fallback:
        result.nrbFallback === true || result.source === "Derived from INR at the official 1.6 peg",
      attribution: result.source,
      historyStatus: history.length > 0 ? "available" : "unavailable",
      history,
      ...(history.length === 0
        ? {
            warnings: [
              {
                code: "HISTORY_UNAVAILABLE",
                message: "The current rate is available, but source-backed history is unavailable.",
                retryable: true,
              },
            ],
          }
        : {}),
    },
  };
}

test("schema examples are valid success and error responses", () => {
  assert.ok(schema.examples && schema.examples.length >= 2);
  for (const example of schema.examples ?? []) assertValid(example);
});

test("Frankfurter provider fixture maps to the schema with exact attribution and history", async () => {
  const request: typeof fetch = async (input) => {
    const url = String(input);
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
      throw new Error("NRB must not be requested");
    },
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });
  const result = await load("AUD", "EUR");
  const contract = toContract(result);
  assertValid(contract);
  assert.equal(contract.data.rate, 0.5);
  assert.equal(contract.data.convertedAmount, 50);
  assert.equal(contract.data.attribution, "Frankfurter");
  assert.equal(contract.data.referenceDate, "2026-11-12");
  assert.deepEqual(contract.data.history, [
    { date: "2026-11-10", rate: 0.5 },
    { date: "2026-11-11", rate: 0.55 },
  ]);
});

test("CoinGecko provider fixture preserves approximate cross-currency history", async () => {
  const request: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes("/latest?")) return jsonResponse(latestFiat());
    if (url.includes("/simple/price")) return jsonResponse({ bitcoin: { usd: 60000 } });
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
  const contract = toContract(await load("BTC", "AUD"), 0.25);
  assertValid(contract);
  assert.equal(contract.data.rate, 96000);
  assert.equal(contract.data.convertedAmount, 24000);
  assert.equal(contract.data.approximate, true);
  assert.equal(contract.data.attribution, "CoinGecko");
});

test("NRB fallback fixture preserves published units, midpoint, date and fallback state", async () => {
  const load = createRateProvider({
    request: async () => {
      throw new Error("No external HTTP request is needed");
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
  });
  const contract = toContract(await load("AUD", "NPR"), 1);
  assertValid(contract);
  assert.equal(contract.data.rate, 86);
  assert.equal(contract.data.referenceDate, "2026-11-12");
  assert.equal(contract.data.stale, true);
  assert.equal(contract.data.fallback, true);
  assert.equal(contract.data.attribution, "Nepal Rastra Bank");
});

test("official INR peg fallback is labelled and never presented as an NRB rate", async () => {
  const load = createRateProvider({
    request: async () => jsonResponse(latestFiat()),
    loadNrbDays: async () => {
      throw new Error("NRB unavailable");
    },
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });
  const contract = toContract(await load("AUD", "NPR"), 1);
  assertValid(contract);
  assert.equal(contract.data.rate, 80);
  assert.equal(contract.data.fallback, true);
  assert.equal(contract.data.attribution, "Derived from INR at the official 1.6 peg");
  assert.equal(contract.data.historyStatus, "unavailable");
  assert.equal(contract.data.warnings?.[0]?.code, "HISTORY_UNAVAILABLE");
});

test("failed history keeps a valid current rate and emits the partial-success warning", async () => {
  const request: typeof fetch = async (input) =>
    String(input).includes("/latest?") ? jsonResponse(latestFiat()) : jsonResponse({}, 503);
  const load = createRateProvider({
    request,
    loadNrbDays: async () => ({ days: [], fallback: false }),
    now: () => fixedNow,
    nowIso: () => fixedIso,
  });
  const contract = toContract(await load("AUD", "EUR"));
  assertValid(contract);
  assert.equal(contract.data.rate, 0.5);
  assert.deepEqual(contract.data.history, []);
  assert.equal(contract.data.warnings?.[0]?.code, "HISTORY_UNAVAILABLE");
});

test("stale-cache fixture retains the exact rate, reference date and original fetch time", async () => {
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
  const fresh = await load("AUD", "EUR");
  time += 60_001;
  fail = true;
  const contract = toContract(await load("AUD", "EUR"), 1);
  assertValid(contract);
  assert.equal(contract.data.rate, fresh.rate);
  assert.equal(contract.data.referenceDate, fresh.asOf);
  assert.equal(contract.data.fetchedAt, fresh.fetchedAt);
  assert.equal(contract.data.stale, true);
});

test("every documented error code validates in the common error envelope", () => {
  const cases = [
    ["UNSUPPORTED_PAIR", "Choose two supported currency codes.", false],
    ["PROVIDER_TIMEOUT", "The rate provider timed out. Try again shortly.", true],
    ["RATE_LIMITED", "Rate requests are temporarily limited. Try again later.", true],
    [
      "MALFORMED_UPSTREAM_PAYLOAD",
      "The rate provider returned data that could not be validated.",
      true,
    ],
    ["NRB_UNAVAILABLE", "Nepal Rastra Bank reference rates are unavailable for this pair.", true],
    [
      "PROVIDER_UNAVAILABLE",
      "The rate provider is unavailable and no cached rate is available.",
      true,
    ],
    [
      "HISTORY_UNAVAILABLE",
      "The current rate is available, but source-backed history is unavailable.",
      true,
    ],
  ] as const;
  for (const [code, message, retryable] of cases) {
    assertValid({ error: { code, message, retryable } });
  }
});

test("schema rejects invented rates, missing attribution and unknown response fields", () => {
  const valid = schema.examples?.[0] as { data: Record<string, unknown> };
  assert.ok(validationErrors({ data: { ...valid.data, rate: 0 } }, schema, schema).length > 0);
  const missingAttribution = { ...valid.data };
  delete missingAttribution.attribution;
  assert.ok(validationErrors({ data: missingAttribution }, schema, schema).length > 0);
  assert.ok(
    validationErrors({ data: { ...valid.data, inventedRate: 123 } }, schema, schema).length > 0,
  );
});

test("standing constraints keep provider hosts server-side and preserve cache TTL constants", () => {
  const provider = read("./rate-provider.server.ts");
  const converter = read("../components/experiences/CurrenSeeConverter.tsx");
  const functions = read("./rates.functions.ts");
  const pairCache = read("./rate-cache.ts");
  const nrb = read("./nrb-rates.server.ts");
  assert.match(provider, /api\.coingecko\.com/);
  assert.match(provider, /Derived from INR at the official 1\.6 peg/);
  assert.doesNotMatch(converter, /api\.coingecko\.com|api\.frankfurter\.dev|nrb\.org\.np/);
  assert.doesNotMatch(converter, /process\.env|SERVICE_ROLE|SECRET/);
  assert.match(functions, /await import\("\.\/rate-provider\.server"\)/);
  assert.match(pairCache, /now\(\) \+ 60_000/);
  assert.match(nrb, /fallback \? 60_000 : 3_600_000/);
});
