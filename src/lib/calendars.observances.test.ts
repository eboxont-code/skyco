import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { observancesForMonth } from "./calendars.observances";

describe("monthly observance sources", () => {
  const october = new Date(2026, 9, 23);
  it("includes Dashain in October 2026", () => {
    assert.equal(observancesForMonth("nepali", october).some(event => event.label === "Vijaya Dashami"), true);
  });
  it("includes Chinese solar terms in October 2026", () => {
    assert.equal(observancesForMonth("chinese", october).some(event => event.label === "Solar term: 霜降"), true);
  });
  it("includes Hebrew holidays in October 2026", () => {
    assert.equal(observancesForMonth("hebrew", october).some(event => event.label === "Simchat Torah"), true);
  });
});
