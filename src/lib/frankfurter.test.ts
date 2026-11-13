import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FRANKFURTER_API_BASE,
  FRANKFURTER_API_VERSION,
  frankfurterLatestUrl,
  frankfurterHistoryUrl,
  parseFrankfurterLatest,
  parseFrankfurterHistory,
} from "./frankfurter";

test("Frankfurter uses the explicit v1 API on api.frankfurter.dev", () => {
  assert.equal(FRANKFURTER_API_VERSION, "v1");
  assert.equal(FRANKFURTER_API_BASE, "https://api.frankfurter.dev/v1");
});

test("latest fiat request uses USD base and the requested currency symbols", () => {
  assert.equal(
    frankfurterLatestUrl("EUR,AUD,JPY"),
    "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,AUD,JPY",
  );
});

test("history request uses the v1 open-ended date range and selected pair", () => {
  assert.equal(
    frankfurterHistoryUrl("2026-10-08", "AUD", "CAD"),
    "https://api.frankfurter.dev/v1/2026-10-08..?base=AUD&symbols=CAD",
  );
});

test("history requests retain the direction of the currency pair", () => {
  const url = new URL(frankfurterHistoryUrl("2026-10-08", "EUR", "USD"));
  assert.equal(url.searchParams.get("base"), "EUR");
  assert.equal(url.searchParams.get("symbols"), "USD");
});

test("latest USD-base values support cross rates for common fiat pairs", () => {
  const latest = parseFrankfurterLatest({
    date: "2026-11-05",
    rates: { EUR: 0.8, GBP: 0.5, AUD: 1.6, CAD: 1.25, JPY: 150, CHF: 0.9 },
  });
  assert.equal(latest.date, "2026-11-05");
  assert.equal(latest.rates.USD, 1);
  assert.ok(Math.abs(latest.rates.AUD - 0.625) < 1e-12);
  assert.ok(Math.abs(latest.rates.CAD - 0.8) < 1e-12);
  assert.ok(Math.abs(latest.rates.AUD / latest.rates.CAD - 0.78125) < 1e-12);
});

test("latest payload omits missing, invalid and unsupported rate values", () => {
  const latest = parseFrankfurterLatest({
    date: "2026-11-05",
    rates: { AUD: 1.6, CAD: null, EUR: 0, GBP: -1, JPY: "not-a-rate", bad: 2 },
  });
  assert.deepEqual(latest.rates, { USD: 1, AUD: 0.625 });
});

test("malformed latest payloads fail closed", () => {
  assert.throws(
    () => parseFrankfurterLatest({ rates: { AUD: 1.6 } }),
    /rate source unavailable/,
  );
  assert.throws(
    () => parseFrankfurterLatest({ date: "not-a-date", rates: { AUD: 1.6 } }),
    /rate source unavailable/,
  );
});

test("empty Frankfurter history stays empty without filling missing days", () => {
  assert.deepEqual(parseFrankfurterHistory({ rates: {} }, "AUD"), []);
});

test("history keeps only positive requested-pair values in date order", () => {
  const history = parseFrankfurterHistory(
    {
      rates: {
        "2026-11-05": { CAD: 0.91 },
        "2026-11-03": { CAD: 0.9 },
        "2026-11-04": { AUD: 1.5 },
        "2026-11-06": { CAD: 0 },
        "2026-11-07": { CAD: -1 },
      },
    },
    "CAD",
  );
  assert.deepEqual(history, [
    { date: "2026-11-03", value: 0.9 },
    { date: "2026-11-05", value: 0.91 },
  ]);
});
