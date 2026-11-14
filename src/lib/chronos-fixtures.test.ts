import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { formatCalendar, nativeCalendarLabel } from "./calendars";
import { componentSource, declaration, evaluate, hookCallbacks } from "./fixture-source";

const file = componentSource("../components/experiences/ChronosCalendars.tsx");
const rows = hookCallbacks(file, "useMemo")[0];
if (!rows) throw new Error("Chronos reading callback missing");
export function chronosReading(date: string) {
  return evaluate<unknown[]>(`${declaration(file, "SYSTEMS")} return (${rows})();`, { readingDate: date, formatCalendar, nativeCalendarLabel });
}
const fixtures = JSON.parse(readFileSync(new URL("./__fixtures__/chronos/readings.json", import.meta.url), "utf8")) as {
  cases: { date: string; reason: string; readings: unknown[] }[];
  boundaries: { instant: string; selectedDate: string; zone: string; localDay: string }[];
};

test("Chronos golden records contain at least twelve dates and all seven readings", () => {
  assert.ok(fixtures.cases.length >= 12);
  for (const fixture of fixtures.cases) {
    const labels = (fixture.readings as { label: string }[]).map(row => row.label);
    assert.deepEqual(labels, ["Gregorian", "Nepali (Bikram Sambat)", "Hijri", "Hebrew", "Chinese", "Persian", "Indian Saka"]);
  }
});
for (const fixture of fixtures.cases) {
  test(`Chronos ${fixture.date}: ${fixture.reason}`, () => {
    assert.deepEqual(JSON.parse(JSON.stringify(chronosReading(fixture.date))), fixture.readings);
  });
}
for (const boundary of fixtures.boundaries) {
  test(`Chronos UTC noon at ${boundary.instant} in ${boundary.zone}`, () => {
    const previous = process.env.TZ;
    try {
      process.env.TZ = boundary.zone;
      const instant = new Date(boundary.instant);
      const localDay = new Intl.DateTimeFormat("en-CA", { timeZone: boundary.zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
      assert.equal(localDay, boundary.localDay);
      const golden = fixtures.cases.find(row => row.date === boundary.selectedDate);
      assert.ok(golden);
      assert.deepEqual(JSON.parse(JSON.stringify(chronosReading(boundary.selectedDate))), golden.readings);
    } finally {
      if (previous === undefined) delete process.env.TZ;
      else process.env.TZ = previous;
    }
  });
}