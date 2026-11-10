import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const rootSource = readFileSync(new URL("./__root.tsx", import.meta.url), "utf8");
const projectsSource = readFileSync(new URL("../lib/projects.ts", import.meta.url), "utf8");
const notFoundSource = rootSource.match(
  /function NotFoundComponent\(\) \{([\s\S]*?)\n\}\n\nfunction ErrorComponent/,
)?.[1];

function getRegistryEntry(registry: string, slug: string): string {
  const start = registry.indexOf(\`slug: "\${slug}",\`);
  assert.notEqual(start, -1, \`expected \${slug} in the product registry\`);
  const end = registry.indexOf("\n  },", start);
  assert.notEqual(end, -1, \`expected \${slug} registry entry to close\`);
  return registry.slice(start, end);
}

test("404 recovery links are generated from the live product registry", () => {
  assert.ok(notFoundSource, "expected the root 404 component");
  assert.match(rootSource, /import \{ liveProjects \} from "\.\.\/lib\/projects";/);
  assert.match(notFoundSource, /\{liveProjects\.map\(\(project\) => \(/);
  assert.match(notFoundSource, /key=\{project\.slug\}/);
  assert.match(notFoundSource, /to=\{project\.path \?\? "\/"\}/);
  assert.doesNotMatch(
    notFoundSource,
    /<Link\s+to="\/(?:currensee|chronos|finance-friend|grocery|float)"/,
  );
});

test("the registry contains five shipped routes and keeps planned products route-less", () => {
  const registry = projectsSource.match(
    /export const projectRegistry: SkyCoProject\[\] = \[([\s\S]*?)\n\];/,
  )?.[1];
  assert.ok(registry, "expected the shared project registry");

  const shippedPaths = [...registry.matchAll(/^\s+path: "(\/[^"]+)",$/gm)].map(([, path]) => path);
  assert.deepEqual(shippedPaths, ["/currensee", "/chronos", "/finance-friend", "/grocery", "/float"]);
  assert.match(projectsSource, /export const liveProjects: ResolvedProject\[\] = splitDirectory\(fallbackDirectory\)\.live;/);

  for (const slug of ["budget", "notes"]) {
    assert.doesNotMatch(getRegistryEntry(registry, slug), /^\s+path:/m, \`\${slug} must remain route-less\`);
  }
});

test("404 recovery retains hub/help navigation and accessible touch/focus affordances", () => {
  assert.ok(notFoundSource, "expected the root 404 component");
  assert.match(notFoundSource, /<nav aria-label="Helpful links"/);
  assert.match(notFoundSource, /Back to the SkyCo hub/);
  assert.match(notFoundSource, /<nav aria-label="More SkyCo pages"/);
  assert.match(notFoundSource, /\["\/about", "\/faq", "\/support"\]/);
  assert.match(notFoundSource, /min-h-11/);
  assert.match(notFoundSource, /focus-visible:ring-2/);
  assert.match(notFoundSource, /focus-visible:outline-none/);
});
