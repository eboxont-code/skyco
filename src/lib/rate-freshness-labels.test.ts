import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");
const converter = read("../components/experiences/CurrenSeeConverter.tsx");
const pairPage = read("../routes/currensee_.$pair.tsx");
const nrbPage = read("../routes/currensee_.rates.tsx");

test("fresh and refreshing labels match the converter source", () => {
  assert.match(converter, /Reference rate for \$\{data\.asOf\}/);
  assert.match(converter, /"Refreshing rate"/);
  assert.match(converter, /`Checked \$\{timeAgo\(data\.fetchedAt\)\}`/);
  assert.match(converter, /return "less than a minute ago"/);
  assert.match(converter, /`\$\{m\} minute\$\{m === 1 \? "" : "s"\} ago`/);
  assert.match(converter, /`\$\{h\} hour\$\{h === 1 \? "" : "s"\} ago`/);
});

test("stale summary and detailed date labels match both converter and pair page", () => {
  assert.match(converter, /"Stale: last available rate"/);
  for (const source of [converter, pairPage]) {
    assert.match(
      source,
      /<strong>Stale rate\.<\/strong> Last updated: <time dateTime=\{(?:data|rate)\.asOf\}>\{(?:data|rate)\.asOf\}<\/time>\. I could not confirm a newer rate\./,
    );
  }
});

test("approximate crypto history has an explicit converted-through-USD label", () => {
  assert.match(converter, /\{data\.approximate \? "Converted through USD\. " : ""\}/);
});

test("NRB fallback uses the same exact label in converter, pair and rates views", () => {
  const label = "Latest available published NRB rates. These are not confirmed as today's rates.";
  assert.ok(converter.includes(label));
  assert.ok(pairPage.includes(label));
  assert.ok(nrbPage.includes(label));
});

test("provider-error and unavailable labels match the converter source", () => {
  assert.match(converter, /"Rate service unavailable"/);
  assert.match(converter, /\? "Unavailable"/);
  assert.ok(
    converter.includes(
      "I could not reach the rate service just now. No previously retrieved rate is available for this pair.",
    ),
  );
  assert.match(converter, />Try again<\/Button>/);
});

test("pair and NRB table outages have explicit unavailable labels", () => {
  assert.ok(
    pairPage.includes(
      "Today's reference rate is unavailable. For NPR pairs, I only show a currency when it appears in the Nepal Rastra Bank feed. Please try again later.",
    ),
  );
  assert.ok(
    nrbPage.includes(
      "Nepal Rastra Bank rates are unavailable right now. Please try again in a few minutes.",
    ),
  );
});

test("empty source-backed history has an explicit unavailable label", () => {
  assert.match(converter, /"No history available for this pair\."/);
});
