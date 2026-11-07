import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeFloatShare, encodeFloatShare, type SharePayload } from "./float-share";

test("share links preserve every disclosed Float entry field", () => {
  const payload: SharePayload = {
    income: [
      {
        name: "Wages",
        amount: 1420,
        date: "2026-11-09",
        frequency: "fortnightly",
        originalAmount: null,
        dealEndsOn: null,
      },
    ],
    bills: [
      {
        name: "Mobile plan",
        amount: 39,
        date: "2026-11-11",
        frequency: "monthly",
        originalAmount: 55,
        dealEndsOn: "2026-11-10",
      },
    ],
    bnpl: [
      {
        name: "Afterpay",
        amount: 62,
        date: "2026-11-12",
        frequency: "fortnightly",
        originalAmount: null,
        dealEndsOn: null,
      },
    ],
  };

  assert.deepEqual(decodeFloatShare(encodeFloatShare(payload)), payload);
});

test("share decoder safely rejects malformed links", () => {
  assert.equal(decodeFloatShare("not-a-valid-share"), null);
  assert.equal(decodeFloatShare(""), null);
});
