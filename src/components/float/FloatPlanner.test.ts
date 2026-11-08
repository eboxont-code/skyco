import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as ts from "typescript";

const componentUrl = new URL("./FloatPlanner.tsx", import.meta.url);
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

function getStringAttribute(element: ts.JsxOpeningLikeElement, name: string): string {
  const initializer = getAttribute(element, name)?.initializer;
  return initializer && ts.isStringLiteral(initializer) ? initializer.text : "";
}

test("Float share URL creation is reachable only through the Continue action", () => {
  const trigger = findJsxElement("AlertDialogTrigger");
  assert.ok(trigger, "the share button must be registered as the Radix dialog trigger");
  assert.ok(getAttribute(trigger.openingElement, "asChild"));
  assert.match(trigger.getText(sourceFile), /aria-label="Share these numbers with a link"/);
  assert.match(trigger.getText(sourceFile), /Share these numbers/);

  const cancel = findJsxElement("AlertDialogCancel");
  assert.ok(cancel, "the confirmation dialog must offer Cancel");
  assert.equal(getAttribute(cancel.openingElement, "onClick"), undefined);

  const action = findJsxElement("AlertDialogAction");
  assert.ok(action, "the confirmation dialog must offer Continue");
  assert.equal(getAttributeExpression(action.openingElement, "onClick"), "share");

  const share = findFunction("share");
  assert.ok(share, "the share handler must exist");
  assert.match(share.getText(sourceFile), /encodeFloatShare\(strip\(store\)\)/);
  assert.match(share.getText(sourceFile), /navigator\.share/);
  assert.match(share.getText(sourceFile), /navigator\.clipboard\.writeText/);
  assert.equal((sourceText.match(/encodeFloatShare\s*\(/g) ?? []).length, 1);
});

test("Float share confirmation discloses every serialized field and link exposure", () => {
  const title = findJsxElement("AlertDialogTitle");
  const description = findJsxElement("AlertDialogDescription");
  assert.ok(title, "the dialog needs an accessible title");
  assert.ok(description, "the dialog needs an accessible description");
  assert.match(title.getText(sourceFile), /Share these figures\?/);

  const disclosure = description.getText(sourceFile).replace(/\\s+/g, " ");
  for (const phrase of [
    "selected income, bills and BNPL figures",
    "names",
    "amounts",
    "dates",
    "recurrence",
    "optional original amounts or deal-end dates",
    "Base64 URL-safe encoding, not encryption",
    "Anyone with the link can read those details",
    "browser history or server logs",
    "Continue to create the link",
  ]) {
    assert.ok(disclosure.includes(phrase), `missing share disclosure: ${phrase}`);
  }
});

test("Float share dialog keeps its actions and content usable on narrow screens", () => {
  const cancel = findJsxElement("AlertDialogCancel");
  const action = findJsxElement("AlertDialogAction");
  const content = findJsxElement("AlertDialogContent");
  assert.ok(cancel);
  assert.ok(action);
  assert.ok(content);

  assert.match(getStringAttribute(cancel.openingElement, "className"), /min-h-11/);
  assert.match(getStringAttribute(action.openingElement, "className"), /min-h-11/);

  const contentClasses = getStringAttribute(content.openingElement, "className");
  assert.match(contentClasses, /max-h-\[calc\(100dvh-2rem\)\]/);
  assert.match(contentClasses, /overflow-y-auto/);
});
