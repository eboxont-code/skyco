import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as ts from "typescript";

const sourceFile = ts.createSourceFile(
  "FloatPlanner.tsx",
  readFileSync(new URL("./FloatPlanner.tsx", import.meta.url), "utf8"),
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

function findFunction(name: string): ts.FunctionDeclaration | undefined {
  let found: ts.FunctionDeclaration | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === name) found = node;
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

function getAttribute(
  element: ts.JsxOpeningLikeElement,
  name: string,
): ts.JsxAttribute | undefined {
  return element.attributes.properties.find(
    (property): property is ts.JsxAttribute =>
      ts.isJsxAttribute(property) && ts.isIdentifier(property.name) && property.name.text === name,
  );
}

function getAttributeExpression(element: ts.JsxOpeningLikeElement, name: string): string {
  const initializer = getAttribute(element, name)?.initializer;
  return initializer && ts.isJsxExpression(initializer)
    ? (initializer.expression?.getText(sourceFile) ?? "")
    : "";
}

test("Float share URL creation is reachable only through explicit confirmation", () => {
  const trigger = findJsxElement("AlertDialogTrigger");
  assert.ok(trigger, "share button must use Radix AlertDialogTrigger");

  const triggerButton = trigger.children.find(
    (child): child is ts.JsxElement =>
      ts.isJsxElement(child) &&
      ts.isIdentifier(child.openingElement.tagName) &&
      child.openingElement.tagName.text === "Button",
  );
  assert.ok(triggerButton, "the existing share button must be the dialog trigger");
  assert.equal(getAttribute(triggerButton.openingElement, "onClick"), undefined);

  const cancel = findJsxElement("AlertDialogCancel");
  assert.ok(cancel, "the dialog must provide an explicit Cancel action");
  assert.equal(getAttribute(cancel.openingElement, "onClick"), undefined);

  const action = findJsxElement("AlertDialogAction");
  assert.ok(action, "the dialog must provide an explicit Continue action");
  assert.match(getAttributeExpression(action.openingElement, "onClick"), /\bconfirmShare\b/);

  const confirmShare = findFunction("confirmShare");
  assert.ok(confirmShare, "the confirmation handler must exist");
  assert.match(confirmShare.getText(sourceFile), /encodeFloatShare/);
  assert.match(confirmShare.getText(sourceFile), /navigator\.share/);
  assert.match(confirmShare.getText(sourceFile), /navigator\.clipboard\.writeText/);
  assert.equal((sourceFile.text.match(/encodeFloatShare\(/g) ?? []).length, 1);
});

test("Float confirmation is a controlled, labelled Radix alert dialog", () => {
  const root = findJsxElement("AlertDialog");
  assert.ok(root, "the confirmation root must exist");
  assert.match(getAttributeExpression(root.openingElement, "open"), /shareConfirmOpen/);

  const onOpenChange = getAttributeExpression(root.openingElement, "onOpenChange");
  assert.match(onOpenChange, /setShareConfirmOpen\(open\)/);
  assert.match(onOpenChange, /setShareState\("idle"\)/);

  const trigger = findJsxElement("AlertDialogTrigger");
  assert.ok(trigger);
  assert.ok(getAttribute(trigger.openingElement, "asChild"));

  assert.ok(findJsxElement("AlertDialogTitle"), "screen readers need an accessible dialog title");
  assert.ok(findJsxElement("AlertDialogDescription"), "screen readers need an accessible dialog description");
});
