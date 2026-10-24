import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { observancesForMonth } from "./calendars.observances";

describe("monthly observance sources", () => {
  const october = new Date(2026, 9, 23);
  it("includes Dashain in October 2026", () => {
    assert.equal(observancesForMonth("nepali", october).some(event => event.label === "Vijaya Dashami"), true);
  });
  it("places Tihar in November 2026, not October", () => {
    const november = new Date(2026, 10, 15);
    const oct = observancesForMonth("nepali", october);
    const nov = observancesForMonth("nepali", november);
    assert.equal(oct.some(event => event.label.includes("Tihar")), false);
    assert.equal(nov.some(event => event.label === "Kaag Tihar, Tihar begins" && event.date.getDate() === 7), true);
    assert.equal(nov.some(event => event.label === "Kukur Tihar and Laxmi Puja" && event.date.getDate() === 8), true);
    assert.equal(nov.some(event => event.label === "Bhai Tika" && event.date.getDate() === 11), true);
    assert.equal(nov.some(event => event.label === "Chhath Parva" && event.date.getDate() === 15), true);
  });
  it("includes Chinese solar terms in October 2026", () => {
    assert.equal(observancesForMonth("chinese", october).some(event => event.label === "Solar term: 霜降"), true);
  });
  it("includes Hebrew holidays in October 2026", () => {
    assert.equal(observancesForMonth("hebrew", october).some(event => event.label === "Simchat Torah"), true);
  });
});
