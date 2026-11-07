import assert from "node:assert/strict";
import { test } from "node:test";
import {
  entryHref,
  fallbackDirectory,
  hrefForSlug,
  liveProjects,
  projectRegistry,
  splitDirectory,
} from "./projects.ts";

test("the registry exposes the five shipped first-party product routes", () => {
  const shipped = projectRegistry.filter((project) => project.path);

  assert.deepEqual(
    shipped.map(({ slug, path }) => [slug, path]),
    [
      ["currensee", "/currensee"],
      ["chronos", "/chronos"],
      ["my-finance-friend", "/finance-friend"],
      ["grocery-packs", "/grocery"],
      ["float", "/float"],
    ],
  );
  assert.equal(new Set(shipped.map((project) => project.path)).size, 5);
});

test("planned products remain route-less and outside the live directory", () => {
  const planned = projectRegistry.filter((project) => !project.path);

  assert.deepEqual(
    planned.map(({ slug, name }) => ({ slug, name })),
    [
      { slug: "budget", name: "Budget & Expenses" },
      { slug: "notes", name: "Daily Notes" },
    ],
  );
  assert.equal(liveProjects.length, 5);
  assert.ok(
    planned.every(
      (project) =>
        fallbackDirectory.find((entry) => entry.slug === project.slug)?.live ===
        false,
    ),
  );
});

test("live fallback URLs use the canonical SkyCo host and product paths", () => {
  for (const project of liveProjects) {
    assert.ok(project.path);
    assert.equal(project.href, `https://skyco.online${project.path}`);
    assert.equal(entryHref(project), project.path);
    assert.equal(hrefForSlug(project.slug), project.href);
  }
});

test("splitting the directory preserves every registry entry exactly once", () => {
  const { live, upcoming } = splitDirectory(fallbackDirectory);
  const combined = [...live, ...upcoming];

  assert.equal(combined.length, projectRegistry.length);
  assert.deepEqual(
    combined.map((project) => project.slug).sort(),
    projectRegistry.map((project) => project.slug).sort(),
  );
  assert.ok(live.every((project) => project.live && Boolean(project.path)));
  assert.ok(upcoming.every((project) => !project.live && !project.path));
});

test("unknown slugs fall back to the canonical SkyCo hub", () => {
  assert.equal(hrefForSlug("not-a-real-product"), "https://skyco.online/");
});
