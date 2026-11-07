import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FRANKFURTER_API_BASE,
  FRANKFURTER_API_VERSION,
  frankfurterLatestUrl,
  frankfurterHistoryUrl,
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
