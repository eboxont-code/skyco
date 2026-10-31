import { test } from "node:test";
import assert from "node:assert/strict";
import { waitlistSchema, isWaitlistHoneypotEmpty } from "./waitlist-schema";

test("a filled waitlist honeypot blocks submission while an empty field allows it", () => {
  assert.equal(isWaitlistHoneypotEmpty("automated entry"), false);
  assert.equal(isWaitlistHoneypotEmpty(" "), false);
  assert.equal(isWaitlistHoneypotEmpty(""), true);
});

test("waitlist email validation rejects invalid email and accepts a complete address", () => {
  assert.equal(waitlistSchema.shape.email.safeParse("bad-address").success, false);
  assert.equal(waitlistSchema.shape.email.safeParse("").success, false);
  assert.equal(waitlistSchema.shape.email.safeParse("test@example.org").success, true);
});