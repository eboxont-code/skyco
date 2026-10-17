import { expect, test } from "bun:test";
import { converterCurrencies } from "./converter-currencies";

test("all five new NPR pair currencies remain selectable without duplicates", () => {
  const codes = converterCurrencies(["CAD", "SGD", "NPR", "HKD"]);
  for (const code of ["CAD", "SGD", "KWD", "BHD", "HKD"]) expect(codes.filter(value => value === code)).toHaveLength(1);
});