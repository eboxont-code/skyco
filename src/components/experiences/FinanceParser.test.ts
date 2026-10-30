import { test } from "node:test";
import assert from "node:assert/strict";
import { holdingTotal } from "./FinanceParser";

test("saved total sums quantity times price without assigning a missing price", () => {
  assert.equal(holdingTotal([{ quantity: 50, price: 145 }, { quantity: 10, price: 212.4 }, { quantity: 3, price: null }]), 9374);
  assert.equal(holdingTotal([]), 0);
});