import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeFloatShare, encodeFloatShare, type SharePayload } from "./float-share";

test("Float share preserves the disclosed fields across all three buckets", () => {
  const entry = {
    name: "Synthetic test entry",
    amount: 12.34,
    date: "2026-11-08",
    frequency: "fortnightly" as const,
    originalAmount: 20,
    dealEndsOn: "2026-12-01",
  };
  const payload: SharePayload = { income: [entry], bills: [entry], bnpl: [entry] };
  const encoded = encodeFloatShare(payload);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeFloatShare(encoded), payload);
});

test("Float share is readable Base64 data, not encryption", () => {
  const payload: SharePayload = {
    income: [{ name: "Synthetic", amount: 1, date: "2026-11-08", frequency: "weekly" }],
    bills: [],
    bnpl: [],
  };
  const encoded = encodeFloatShare(payload);
  const readable = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  assert.deepEqual(readable.i, [["Synthetic", 1, "2026-11-08", 0, null, null]]);
});

test("Float share decoder rejects malformed and unusable links", () => {
  const malformedJson = btoa("{");
  const emptyPayload = btoa(JSON.stringify({ i: [], b: [], p: [] }));
  const invalidEntries = btoa(
    JSON.stringify({ i: [["", 12, "2026-11-10", 0, null, null]], b: [], p: [] }),
  );

  for (const value of ["not-a-valid-share", "%%%", malformedJson, emptyPayload, invalidEntries]) {
    assert.equal(decodeFloatShare(value), null);
  }
});
