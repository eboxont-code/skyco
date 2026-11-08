import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const statusSource = await readFile(new URL("./status.tsx", import.meta.url), "utf8");

test("status page renders the resolved published products", () => {
  assert.match(statusSource, /const \{ live, upcoming \} = splitDirectory\(directory\)/);
  assert.match(statusSource, /\{live\.map\(\(project\) =>/);
  assert.doesNotMatch(statusSource, /liveProjects\.map/);
});

test("planned products have a separate labelled section without unavailable links", () => {
  const plannedSection = statusSource.match(/\{upcoming\.length > 0 && \(([\s\S]*?)\n      \)\}/)?.[1];
  assert.ok(plannedSection, "expected a conditional planned-products section");
  assert.match(plannedSection, /aria-labelledby="planned-products-heading"/);
  assert.match(plannedSection, /id="planned-products-heading"/);
  assert.match(plannedSection, /upcoming\.map\(\(project\) =>/);
  assert.match(plannedSection, /Planned — not live yet/);
  assert.doesNotMatch(plannedSection, /<Link\b|href=/);
});

test("page metadata distinguishes published routes from uptime monitoring", () => {
  assert.match(statusSource, /SkyCo product status: published and planned tools/);
  assert.match(statusSource, /Published status is not continuous uptime monitoring/);
  assert.match(statusSource, /It is not continuous uptime\s+monitoring/);
  assert.doesNotMatch(statusSource, /live checks for every tool/i);
  assert.match(statusSource, /https:\/\/skyco\.online\/status/);
});

test("the manual rate check remains separate and accessible", () => {
  assert.match(statusSource, /Check rates now/);
  assert.match(statusSource, /getRate\(\{ data: \{ from: "USD", to: "EUR" \} \}\)/);
  assert.match(statusSource, /<p role="status"/);
});