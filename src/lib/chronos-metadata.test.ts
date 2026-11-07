import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { projectRegistry } from "./projects.ts";

const CALENDAR_SYSTEMS = [
  "Gregorian",
  "Nepali (Bikram Sambat)",
  "Hijri",
  "Hebrew",
  "Chinese",
  "Persian",
  "Indian Saka",
];

const chronos = projectRegistry.find(({ slug }) => slug === "chronos");
const routeSource = readFileSync(new URL("../routes/chronos.tsx", import.meta.url), "utf8");
const componentSource = readFileSync(
  new URL("../components/experiences/ChronosCalendars.tsx", import.meta.url),
  "utf8",
);

test("Chronos registry copy names all seven calendar systems", () => {
  assert.ok(chronos, "Chronos must remain in the product registry");
  assert.equal(chronos.job, "Read one date in seven calendar systems.");
  assert.equal(chronos.tagline, "Seven calendars, one date");
  assert.equal(chronos.demo, "Pick one day and read it in seven calendars in about ten seconds.");

  for (const system of CALENDAR_SYSTEMS) {
    assert.ok(chronos.description.includes(system), "registry description omits " + system);
    assert.ok(chronos.example?.includes(system), "registry example omits " + system);
  }
});

test("Chronos page metadata consistently uses the seven-calendar title and description", () => {
  assert.match(routeSource, /const TITLE = "Chronos: one date in seven calendars \| SkyCo";/);
  assert.match(
    routeSource,
    /const DESCRIPTION =\s*"Date converter: Gregorian, Nepali \(Bikram Sambat\), Hijri, Hebrew, Chinese, Persian and Indian Saka\./,
  );
  assert.match(routeSource, /\{ title: TITLE \}/);
  assert.match(routeSource, /\{ property: "og:title", content: TITLE \}/);
  assert.match(routeSource, /\{ property: "og:description", content: DESCRIPTION \}/);
  assert.match(routeSource, /\{ name: "twitter:title", content: TITLE \}/);
  assert.match(routeSource, /\{ name: "twitter:description", content: DESCRIPTION \}/);
  assert.match(
    routeSource,
    /productAppScript\("Chronos", "\/chronos", DESCRIPTION, "UtilitiesApplication"\)/,
  );
  assert.doesNotMatch(routeSource, /six calendars?|six calendar systems?/i);
});

test("Chronos renderer declares exactly the seven expected calendar systems", () => {
  const systemsBlock = componentSource.match(/const SYSTEMS:[\s\S]*?\n\];/)?.[0];
  assert.ok(systemsBlock, "Chronos SYSTEMS declaration must exist");

  const labels = [...systemsBlock.matchAll(/\{ label: "([^"]+)"/g)].map(([, label]) => label);
  assert.deepEqual(labels, CALENDAR_SYSTEMS);
  assert.match(componentSource, /Pick one day and read it back in seven calendar systems at once/);
  assert.doesNotMatch(componentSource, /six calendars?|six calendar systems?/i);
});
