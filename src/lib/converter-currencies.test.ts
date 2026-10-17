import { test } from "node:test";
import { strict as assert } from "node:assert";
import { converterCurrencies } from "./converter-currencies";

test("all five new NPR pair currencies remain selectable without duplicates", () => {
  const codes = converterCurrencies(["CAD", "SGD", "NPR", "HKD"]);
  for (const code of ["CAD", "SGD", "KWD", "BHD", "HKD"]) assert.equal(codes.filter(value => value === code).length, 1);
});