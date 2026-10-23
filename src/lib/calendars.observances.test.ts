import { describe, expect, it } from "vitest";
import { observancesForMonth } from "./calendars.observances";

describe("monthly observance sources", () => {
  const october = new Date(2026, 9, 23);
  it("includes Dashain in October 2026", () => {
    expect(observancesForMonth("nepali", october).some(event => event.label === "Vijaya Dashami")).toBe(true);
  });
  it("includes Chinese solar terms in October 2026", () => {
    expect(observancesForMonth("chinese", october).some(event => event.label === "Solar term: 霜降")).toBe(true);
  });
  it("includes Hebrew holidays in October 2026", () => {
    expect(observancesForMonth("hebrew", october).some(event => event.label === "Simchat Torah")).toBe(true);
  });
});
