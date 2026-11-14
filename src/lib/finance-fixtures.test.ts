import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseHolding } from "../components/experiences/FinanceParser";

const fixtures = JSON.parse(readFileSync(new URL("./__fixtures__/finance/parser.json", import.meta.url), "utf8")) as {
  category: string; input: string; expected: ReturnType<typeof parseHolding>;
}[];
test("Finance parser covers all five categories with at least two cases each", () => {
  for (const category of ["valid", "ambiguous", "malformed", "missing-price", "missing-date"]) {
    assert.ok(fixtures.filter(row => row.category === category).length >= 2, category);
  }
});
for (const [index, fixture] of fixtures.entries()) {
  test(`Finance ${fixture.category} ${index + 1}: ${fixture.input || "empty input"}`, () => {
    assert.deepEqual(parseHolding(fixture.input), fixture.expected);
  });
}