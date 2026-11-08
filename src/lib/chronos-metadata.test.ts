import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const projectsSource = readFileSync(new URL("./projects.ts", import.meta.url), "utf8");
const routeSource = readFileSync(new URL("../routes/chronos.tsx", import.meta.url), "utf8");
const componentSource = readFileSync(
  new URL("../components/experiences/ChronosCalendars.tsx", import.meta.url),
  "utf8",
);

const CALENDAR_SYSTEMS = [
  "Gregorian",
  "Nepali (Bikram Sambat)",
  "Hijri",
  "Hebrew",
  "Chinese",
  "Persian",
  "Indian Saka",
];

const chronosBlock = projectsSource.match(/slug: "chronos",[\s\S]*?\n  },/)?.[0];

test("Chronos registry describes all seven supported calendar systems", () => {
  assert.ok(chronosBlock, "Chronos must remain in the product registry");
  assert.match(chronosBlock, /job: "Read one date in seven calendar systems\."/);
  assert.match(chronosBlock, /tagline: "[^"]*seven[^"]*calendar/i);
  assert.match(chronosBlock, /demo: "[^"]*seven calendars/i);

  for (const system of [
    "Gregorian",
    "Nepali Bikram Sambat",
    "Hijri",
    "Hebrew",
    "Chinese",
    "Persian",
    "Indian Saka",
  ]) {
    assert.ok(chronosBlock.includes(system), `registry copy omits ${system}`);
  }

  assert.doesNotMatch(chronosBlock, /six calendars?|six calendar systems?/i);
});

test("Chronos page metadata consistently advertises seven calendars", () => {
  assert.match(routeSource, /const TITLE = "Chronos: one date in seven calendars \\| SkyCo";/);

  for (const system of CALENDAR_SYSTEMS) {
    assert.ok(routeSource.includes(system), `page description omits ${system}`);
  }

  assert.match(routeSource, /\{ title: TITLE \}/);
  assert.match(routeSource, /\{ property: "og:title", content: TITLE \}/);
  assert.match(routeSource, /\{ name: "twitter:title", content: TITLE \}/);
  assert.match(routeSource, /\{ property: "og:description", content: DESCRIPTION \}/);
  assert.match(routeSource, /\{ name: "twitter:description", content: DESCRIPTION \}/);
  assert.match(routeSource, /links: \[\{ rel: "canonical", href: URL \}\]/);
  assert.match(
    routeSource,
    /productAppScript\("Chronos", "\/chronos", DESCRIPTION, "UtilitiesApplication"\)/,
  );
  assert.doesNotMatch(routeSource, /six calendars?|six calendar systems?/i);
});

test("Chronos renderer lists exactly the seven expected systems", () => {
  const systemsBlock = componentSource.match(/const SYSTEMS:[\s\S]*?\n\];/)?.[0];
  assert.ok(systemsBlock, "Chronos SYSTEMS declaration must exist");

  const labels = [...systemsBlock.matchAll(/\{ label: "([^"]+)"/g)].map(([, label]) => label);
  assert.deepEqual(labels, CALENDAR_SYSTEMS);
  assert.match(componentSource, /Pick one day and read it back in seven calendar systems at once/);
  assert.doesNotMatch(componentSource, /six calendars?|six calendar systems?/i);
});
