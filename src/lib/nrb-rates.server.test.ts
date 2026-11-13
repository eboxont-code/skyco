import { test } from "node:test";
import assert from "node:assert/strict";
import { createNrbLoader } from "./nrb-rates.server";

// Synthetic transport fixtures, never shipped as exchange rates.
const day = (date: string) => ({ date, rates: [{ currency: { iso3: "USD", unit: 1 }, buy: "2", sell: "4" }] });
const response = (days: unknown[]) => Response.json({ data: { payload: days } });
const today = Date.parse("2026-11-05T12:00:00Z");

test("failed range fetch falls back to the latest published dated feed", async () => {
  const urls: string[] = [];
  const load = createNrbLoader(async input => {
    urls.push(String(input));
    return urls.length === 1 ? new Response(null, { status: 503 }) : response([day("2026-11-04")]);
  }, () => today);
  const result = await load();
  assert.equal(urls[1], "https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=1");
  assert.equal(result.days.at(-1)?.date, "2026-11-04");
  assert.equal(result.days[0]?.rates[0]?.buy, "2");
  assert.equal(result.fallback, true);
});

test("expired cache survives a complete provider outage without changing its date or values", async () => {
  let time = today;
  let fail = false;
  const load = createNrbLoader(async () => {
    if (fail) throw new Error("network unavailable");
    return response([day("2026-11-05")]);
  }, () => time);
  const initial = await load();
  time += 3_600_001;
  fail = true;
  const fallback = await load();
  assert.deepEqual(fallback.days, initial.days);
  assert.equal(fallback.fallback, true);
});

test("unordered published days select the latest valid date and reject unusable rates", async () => {
  const load = createNrbLoader(async () => response([
    day("2026-11-04"), day("2026-11-03"),
    { ...day("2026-11-05"), rates: [{ currency: { iso3: "USD", unit: 0 }, buy: "2", sell: "4" }] },
    day("2026-11-06"),
  ]), () => today);
  assert.equal((await load()).days.at(-1)?.date, "2026-11-04");
});

test("with no published data or last good payload an outage never invents a rate", async () => {
  const load = createNrbLoader(async () => response([]), () => today);
  await assert.rejects(load(), /Reference rates unavailable/);
});

test("an older latest-feed response cannot replace a newer cached NRB day", async () => {
  let time = today;
  let calls = 0;
  const load = createNrbLoader(async () => {
    calls++;
    if (calls === 1) return response([day("2026-11-05")]);
    if (calls === 2) throw new Error("range unavailable");
    return response([day("2026-11-04")]);
  }, () => time);
  await load();
  time += 3_600_001;
  const result = await load();
  assert.equal(result.days.at(-1)?.date, "2026-11-05");
  assert.equal(result.fallback, true);
});

test("a 429 from the dated feed falls back to the latest published feed", async () => {
  const urls: string[] = [];
  const load = createNrbLoader(async input => {
    urls.push(String(input));
    return urls.length === 1 ? new Response(null, { status: 429 }) : response([day("2026-11-04")]);
  }, () => today);
  const result = await load();
  assert.equal(urls.length, 2);
  assert.equal(urls[1], "https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=1");
  assert.equal(result.days.at(-1)?.date, "2026-11-04");
  assert.equal(result.fallback, true);
});

test("provider timeouts on both feeds fail closed without a cached rate", async () => {
  let calls = 0;
  const load = createNrbLoader(async () => {
    calls++;
    throw new DOMException("The request timed out", "TimeoutError");
  }, () => today);
  await assert.rejects(load(), /Reference rates unavailable/);
  assert.equal(calls, 2);
});

test("malformed JSON from both feeds fails closed without inventing published data", async () => {
  let calls = 0;
  const load = createNrbLoader(async () => {
    calls++;
    return new Response("{not-json", { headers: { "Content-Type": "application/json" } });
  }, () => today);
  await assert.rejects(load(), /Reference rates unavailable/);
  assert.equal(calls, 2);
});