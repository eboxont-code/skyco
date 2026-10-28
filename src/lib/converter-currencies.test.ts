import { test } from "node:test";
import { strict as assert } from "node:assert";
import { converterCurrencies } from "./converter-currencies";
import { pairBySlug } from "./currency-pairs";
for (const slug of ["chf-to-npr", "cny-to-npr", "npr-to-gbp", "npr-to-eur"]) {
  test(`${slug} uses the existing NRB pair template`, () => {
    assert.equal(pairBySlug(slug)?.source, "nrb");
    assert.equal(pairBySlug(slug)?.slug, slug);
  });
}

test("all five new NPR pair currencies remain selectable without duplicates", () => {
  const codes = converterCurrencies(["CAD", "SGD", "NPR", "HKD"]);
  for (const code of ["CAD", "SGD", "KWD", "BHD", "HKD"]) assert.equal(codes.filter(value => value === code).length, 1);
});

test("OMR uses NRB and the requested five salary amounts", () => {
  const pair = pairBySlug("omr-to-npr");
  assert.equal(pair?.source, "nrb");
  assert.deepEqual(pair?.amounts, [50, 100, 250, 500, 1000]);
  assert.ok(converterCurrencies([]).includes("OMR"));
});

test("AUD to SGD uses Frankfurter and requested amounts", () => {
  const pair = pairBySlug("aud-to-sgd");
  assert.equal(pair?.source, "frankfurter");
  assert.deepEqual(pair?.amounts, [50, 100, 500, 1000, 5000]);
});

test("AUD to CAD uses Frankfurter and requested amounts", () => {
  const pair = pairBySlug("aud-to-cad");
  assert.equal(pair?.source, "frankfurter");
  assert.deepEqual(pair?.amounts, [50, 100, 500, 1000, 5000]);
});