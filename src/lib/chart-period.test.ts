import { test } from "node:test";
import { strict as assert } from "node:assert";
import { chartPeriod, DEFAULT_CHART_DAYS } from "./chart-period";

const points = Array.from({ length: 30 }, (_, index) => ({ date: `2026-10-${String(index + 1).padStart(2, "0")}`, value: index }));
test("the default history period is 30 days", () => {
  assert.equal(DEFAULT_CHART_DAYS, 30);
  assert.equal(chartPeriod(points, 30).length, 30);
});
test("seven days shows only the latest seven calendar dates without changing values", () => {
  assert.deepEqual(chartPeriod(points, 7), points.slice(23));
});