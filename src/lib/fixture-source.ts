// Test-only access to calculations currently embedded in components.
// Extract syntax nodes rather than maintaining a second implementation.
import { readFileSync } from "node:fs";
import * as ts from "typescript";

export function componentSource(path: string) {
  const url = new URL(path, import.meta.url);
  const source = readFileSync(url, "utf8");
  return ts.createSourceFile(url.pathname, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

export function declaration(file: ts.SourceFile, name: string): string {
  let found: ts.Node | undefined;
  const visit = (node: ts.Node) => {
    if ((ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) && node.name?.getText(file) === name) found = node;
    ts.forEachChild(node, visit);
  };
  visit(file);
  if (!found) throw new Error(`Missing production declaration: ${name}`);
  return ts.isVariableDeclaration(found) ? `const ${found.getText(file)};` : found.getText(file).replace(/^export\s+/, "");
}

export function evaluate<T>(code: string, bindings: Record<string, unknown> = {}): T {
  const output = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
  return new Function(...Object.keys(bindings), output)(...Object.values(bindings)) as T;
}

export function hookCallbacks(file: ts.SourceFile, hook: string): string[] {
  const callbacks: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node) && node.expression.getText(file) === hook && node.arguments[0]) callbacks.push(node.arguments[0].getText(file));
    ts.forEachChild(node, visit);
  };
  visit(file);
  return callbacks;
}