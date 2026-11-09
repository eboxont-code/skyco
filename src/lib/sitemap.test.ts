import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PAIRS } from "./currency-pairs";
import { FLOAT_PAGES } from "./float-pages";
import { projectRegistry } from "./projects";

const SITE = "https://skyco.online";
const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
  block,
  url: block.match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
const urls = entries.map((entry) => entry.url).filter((url): url is string => Boolean(url));

function isValidIsoDate(value: string | undefined): boolean {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

test("sitemap entries are unique canonical HTTPS URLs on the SkyCo domain", () => {
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.ok(urls.length > 0, "sitemap should contain at least one URL");
  assert.equal(entries.length, urls.length, "every url element must contain a location");
  assert.equal(new Set(urls).size, urls.length, "sitemap URLs must not be duplicated");
  assert.ok(urls.every((url) => url.startsWith(`${SITE}/`)), "every URL must use the canonical HTTPS host");
  assert.ok(urls.every((url) => !url.includes("?") && !url.includes("#")), "sitemap URLs must be clean canonical paths");
});

test("sitemap includes all shipped products and excludes planned products", () => {
  const shippedUrls = projectRegistry.flatMap((project) =>
    project.path ? [`${SITE}${project.path}`] : [],
  );
  const plannedUrls = projectRegistry
    .filter((project) => !project.path)
    .map((project) => `${SITE}/${project.slug}`);

  assert.deepEqual(shippedUrls.filter((url) => !urls.includes(url)), []);
  assert.deepEqual(plannedUrls.filter((url) => urls.includes(url)), []);
  assert.ok(!urls.includes(`${SITE}/finance`), "legacy redirect must not be indexed");
});

test("sitemap contains exactly the registered CurrenSee pair landing pages", () => {
  const expected = PAIRS.map((pair) => `${SITE}/currensee/${pair.slug}`).sort();
  const actual = urls
    .filter((url) => url.startsWith(`${SITE}/currensee/`) && url !== `${SITE}/currensee/rates`)
    .sort();

  assert.deepEqual(actual, expected);
});

test("sitemap contains exactly the registered Float landing pages", () => {
  const expected = FLOAT_PAGES.map((page) => `${SITE}/float/${page.slug}`).sort();
  const actual = urls.filter((url) => url.startsWith(`${SITE}/float/`)).sort();

  assert.deepEqual(actual, expected);
});

test("every sitemap URL has exactly one location and one valid ISO last-modified value", () => {
  for (const [index, entry] of entries.entries()) {
    const number = index + 1;
    assert.equal(
      (entry.block.match(/<loc>/g) ?? []).length,
      1,
      \`URL entry \${number} must have exactly one location\`,
    );
    assert.equal(
      (entry.block.match(/<\/loc>/g) ?? []).length,
      1,
      \`URL entry \${number} must have exactly one closing location tag\`,
    );
    assert.equal(
      (entry.block.match(/<lastmod>/g) ?? []).length,
      1,
      \`URL entry \${number} must have exactly one last-modified value\`,
    );
    assert.equal(
      (entry.block.match(/<\/lastmod>/g) ?? []).length,
      1,
      \`URL entry \${number} must have exactly one closing last-modified tag\`,
    );
    assert.ok(isValidIsoDate(entry.lastmod), \`URL entry \${number} must have a valid ISO last-modified date\`);
  }
});

test("robots.txt advertises the canonical sitemap", () => {
  assert.match(robots, /^Sitemap:\s+https:\/\/skyco\.online\/sitemap\.xml$/m);
});
