import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const component = readFileSync(
  new URL("../components/float/FloatPlanner.tsx", import.meta.url),
  "utf8",
);

test("reopening the Float share confirmation clears stale feedback", () => {
  const callback = component.match(/onOpenChange=\{\(open\)\s*=>\s*\{([\s\S]*?)\}\}/)?.[1];

  assert.ok(callback, "the AlertDialog root must observe open-state changes");
  assert.match(callback, /if\s*\(open\)\s*setShareState\("idle"\)/);
});
