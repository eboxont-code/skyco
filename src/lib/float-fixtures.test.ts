import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as ts from "typescript";
import { occurrencesInRange, periodRange, parseIso, formatDayShort, dealDaysLeft, toIsoDate, type Frequency, type Period } from "./float";
import { componentSource, declaration, evaluate } from "./fixture-source";

const file = componentSource("../components/float/FloatPlanner.tsx");
type Entry = { name: string; amount: number; date: string; frequency: Frequency };
type Store = { income: Entry[]; bills: Entry[]; bnpl: Entry[] };
export function localDate(iso: string) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d, 12); }
export function floatOutput(from: string, period: Period, store: Store) {
  const { start, end } = periodRange(period, localDate(from));
  return evaluate(`${declaration(file, "expand")} ${declaration(file, "sum")}
    ${["income", "bills", "bnpl", "incomeTotal", "billsTotal", "bnplTotal", "spendable"].map(name => declaration(file, name)).join("\n")}
    return {start: toIsoDate(start), end: toIsoDate(end), income, bills, bnpl, incomeTotal, billsTotal, bnplTotal, spendable};`, { start, end, store, occurrencesInRange, toIsoDate });
}
const fixtures = JSON.parse(readFileSync(new URL("./__fixtures__/float/planning.json", import.meta.url), "utf8")) as {
  recurrence: { name: string; anchor: string; frequency: Frequency; start: string; end: string; expected: string[] }[];
  planning: { name: string; from: string; period: Period; store: Store; expected: unknown }[];
  form: { name: string; input: { name: string; amount: string; date: string; originalAmount?: string; dealEndsOn?: string }; expected: unknown; errors?: Record<string, string> }[];
};
for (const row of fixtures.recurrence) {
  test(`Float recurrence: ${row.name}`, () => {
    assert.deepEqual(occurrencesInRange(row.anchor, row.frequency, localDate(row.start), localDate(row.end)), row.expected);
  });
}
for (const row of fixtures.planning) {
  test(`Float planning: ${row.name}`, () => {
    assert.deepEqual(floatOutput(row.from, row.period, row.store), row.expected);
  });
}

const formFile = componentSource("../components/float/EntrySection.tsx");
let submitCallback = "";
const visit = (node: ts.Node) => {
  if (ts.isJsxAttribute(node) && node.name.getText(formFile) === "onSubmit" && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && !submitCallback) {
    submitCallback = node.initializer.expression.getText(formFile);
  }
  ts.forEachChild(node, visit);
};
visit(formFile);
if (!submitCallback) throw new Error("Float entry submit callback missing");
for (const row of fixtures.form) {
  test(`Float form handler (before browser validity checks): ${row.name}`, () => {
    let result: unknown = null;
    let errors: Record<string, string> = {};
    evaluate(`return (${submitCallback})({preventDefault(){}});`, {
      frequency: "monthly", originalAmount: "", dealEndsOn: "", ...row.input, parseIso,
      setErrors: (value: typeof errors) => { errors = value; },
      onSubmit: (value: unknown) => { result = value; },
    });
    assert.deepEqual(result, row.expected);
    if (row.errors) assert.deepEqual(errors, row.errors);
  });
}
for (const date of ["2026-02-30", "2026-13-01", "2024-02-31", "", "not-a-date"]) {
  test(`Float date helpers reject ${date || "empty date"}`, () => {
    assert.equal(Number.isNaN(parseIso(date).getTime()), true);
    assert.equal(formatDayShort(date), "Invalid date");
    assert.equal(dealDaysLeft(date), null);
  });
}