import { test } from "node:test";
import assert from "node:assert/strict";
import { waitlistSchema } from "./waitlist-schema";

test("waitlist email validation rejects invalid email and accepts a complete address", () => {
  assert.equal(waitlistSchema.shape.email.safeParse("bad-address").success, false);
  assert.equal(waitlistSchema.shape.email.safeParse("").success, false);
  assert.equal(waitlistSchema.shape.email.safeParse("test@example.org").success, true);
});