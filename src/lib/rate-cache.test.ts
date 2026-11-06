import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateCache } from "./rate-cache";

// Synthetic fixtures only; these values are never served as provider rates.
const fixture = (from = "USD", to = "EUR") => ({ from, to, rate: 2, asOf: "2026-11-05", fetchedAt: "2026-11-06T01:00:00Z", source: "fixture" });
const outage = async (): Promise<ReturnType<typeof fixture>> => { throw new Error("outage"); };

test("60-second cache expiry retains the exact last good pair rate, date and source with a stale flag", async () => {
  let time = 0;
  const load = createRateCache<ReturnType<typeof fixture>>(3, () => time);
  const good = await load("USD", "EUR", async () => fixture());
  time = 59_999;
  assert.deepEqual(await load("USD", "EUR", outage), good);
  time = 60_000;
  assert.deepEqual(await load("USD", "EUR", outage), { ...good, stale: true });
  time = 120_000;
  assert.deepEqual(await load("USD", "EUR", outage), { ...good, stale: true });
});

test("a cold outage never invents a rate or borrows a different pair", async () => {
  const load = createRateCache(3);
  await load("USD", "EUR", async () => fixture());
  await assert.rejects(load("EUR", "USD", outage), /outage/);
});

test("invalid provider rates and dates cannot replace the last good result", async () => {
  let time = 0;
  const load = createRateCache(3, () => time);
  await load("USD", "EUR", async () => fixture());
  time = 60_000;
  for (const invalid of [{ rate: NaN }, { rate: 0 }, { rate: Infinity }, { asOf: "invalid" }, { to: "GBP" }]) {
    const result = await load("USD", "EUR", async () => ({ ...fixture(), ...invalid }));
    assert.equal(result.rate, 2);
    assert.equal(result.asOf, "2026-11-05");
    assert.equal(result.stale, true);
  }
});

test("successful recovery replaces the stale rate and clears the stale flag", async () => {
  let time = 0;
  const load = createRateCache(3, () => time);
  await load("USD", "EUR", async () => fixture());
  time = 60_000;
  await load("USD", "EUR", outage);
  const recovered = await load("USD", "EUR", async () => ({ ...fixture(), rate: 3, asOf: "2026-11-06" }));
  assert.equal(recovered.rate, 3);
  assert.equal(recovered.asOf, "2026-11-06");
  assert.equal(recovered.stale, false);
});

test("bounded cache evicts oldest pair instead of growing without limit", async () => {
  let time = 0;
  const load = createRateCache(1, () => time);
  await load("USD", "EUR", async () => fixture());
  await load("USD", "GBP", async () => fixture("USD", "GBP"));
  time = 60_000;
  await assert.rejects(load("USD", "EUR", outage), /outage/);
  assert.equal((await load("USD", "GBP", outage)).stale, true);
});