import { test } from "node:test";
import { strict as assert } from "node:assert";
import { getSavedConversions, saveConversion, clearSavedConversions } from "./currensee-store";

test("saved conversions keep the newest 20 snapshots unchanged", () => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } });
  clearSavedConversions();
  for (let index = 1; index <= 21; index++) saveConversion({ from: "USD", to: "EUR", amount: index, result: index * 2, rate: 2, asOf: "2026-10-27", source: "test input", at: String(index) });
  const saved = getSavedConversions();
  assert.equal(saved.length, 20);
  assert.equal(saved[0]?.amount, 21);
  assert.equal(saved[19]?.amount, 2);
  assert.equal(saved[0]?.result, 42);
  assert.deepEqual(getSavedConversions(), saved);
});

test("unavailable browser storage never blocks saving", () => {
  Object.defineProperty(globalThis, "localStorage", { configurable: true, get: () => { throw new Error("blocked"); } });
  assert.deepEqual(getSavedConversions(), []);
  assert.equal(saveConversion({ from: "USD", to: "EUR", amount: 1, result: 2, rate: 2, asOf: "2026-10-27", source: "test input", at: "1" }).length, 1);
});