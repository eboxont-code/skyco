import assert from "node:assert/strict";
import { test } from "node:test";
import { fallbackDirectory, liveProjects, splitDirectory } from "./projects";

test("the five shipped products resolve to first-party hub routes", () => {
  const paths = ["/currensee", "/chronos", "/finance-friend", "/grocery", "/float"];
  assert.deepEqual(liveProjects.map((project) => project.path), paths);
  assert.deepEqual(liveProjects.map((project) => project.href), paths.map((path) => `https://skyco.online${path}`));
});

test("Budget & Expenses and Daily Notes remain planned without shipped paths", () => {
  const { upcoming } = splitDirectory(fallbackDirectory);
  assert.deepEqual(upcoming.map((project) => project.name), ["Budget & Expenses", "Daily Notes"]);
  for (const project of upcoming) {
    assert.equal(project.live, false);
    assert.equal(project.path, undefined);
    assert.deepEqual(project.candidates, []);
  }
});