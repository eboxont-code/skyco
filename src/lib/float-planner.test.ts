import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as ts from "typescript";

const componentUrl = new URL("../components/float/FloatPlanner.tsx", import.meta.url);
const sourceText = readFileSync(componentUrl, "utf8");
const sourceFile = ts.createSourceFile(
  componentUrl.pathname,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);

function findJsxElement(name: string): ts.JsxElement | undefined {
  let found: ts.JsxElement | undefined;
  const visit = (node: ts.Node) => {
    if (
      ts.isJsxElement(node) &&
      ts.isIdentifier(node.openingElement.tagName) &&
      node.openingElement.tagName.text === name
    ) {
      found = node;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

function getAttributeExpression(element: ts.JsxOpeningLikeElement, name: string): string {
  const attribute = element.attributes.properties.find(
    (property): property is ts.JsxAttribute =>
      ts.isJsxAttribute(property) &&
      ts.isIdentifier(property.name) &&
      property.name.text === name,
  );
  const initializer = attribute?.initializer;
  return initializer && ts.isJsxExpression(initializer)
    ? (initializer.expression?.getText(sourceFile) ?? "")
    : "";
}

test("reopening the Float share confirmation clears stale feedback", () => {
  const dialog = findJsxElement("AlertDialog");
  assert.ok(dialog, "the Float share confirmation must use an AlertDialog root");

  const onOpenChange = getAttributeExpression(dialog.openingElement, "onOpenChange");
  assert.match(onOpenChange, /if\s*\(open\)\s*setShareState\("idle"\)/);
});
