import assert from "node:assert/strict";
import { test } from "node:test";
import { fallbackDirectory } from "./projects.ts";
import { companyLinks, legalLinks } from "./site-nav.ts";
import { buildLlmsContent, resolveLlmsDirectory } from "./llms-content.ts";

test("the generated Projects section lists all five shipped products at first-party paths", () => {
  const body = buildLlmsContent(fallbackDirectory, companyLinks, legalLinks);
  const projects = body
    .split("## Projects\n\n")[1]
    ?.split("\n## Planned — not live yet")[0];

  assert.match(body, /5 products are live today\./);
  assert.ok(projects);
  for (const project of fallbackDirectory.filter((entry) => entry.live)) {
    assert.ok(project.path);
    assert.ok(
      projects.includes(
        `${project.name}: ${project.job ?? project.tagline} https://skyco.online${project.path}`,
      ),
    );
  }
  assert.equal(projects.trim().split("\n").length, 5);
});

test("planned products appear only in the planned section and never receive live URLs", () => {
  const body = buildLlmsContent(fallbackDirectory, companyLinks, legalLinks);
  const planned = body.split("## Planned — not live yet\n\n")[1];

  assert.ok(planned);
  for (const project of fallbackDirectory.filter((entry) => !entry.live)) {
    assert.ok(planned.includes(`- ${project.name}: ${project.description}`));
    assert.ok(
      !body.includes(
        `${project.name}: ${project.job ?? project.tagline} https://skyco.online`,
      ),
    );
  }
  assert.doesNotMatch(body, /https:\/\/skyco\.online\/(budget|notes)(?:\s|$)/);
});

test("the generated document retains every shared company and legal navigation link", () => {
  const body = buildLlmsContent(fallbackDirectory, companyLinks, legalLinks);

  for (const page of [...companyLinks, ...legalLinks]) {
    const description = page.description ?? `${page.label} information for SkyCo.`;
    assert.ok(
      body.includes(`- [${page.label}](https://skyco.online${page.to}): ${description}`),
    );
  }
});

test("the planned section is omitted when every supplied product is live", () => {
  const liveOnly = fallbackDirectory.filter((entry) => entry.live);
  const body = buildLlmsContent(liveOnly, [], []);

  assert.doesNotMatch(body, /Planned — not live yet/);
  assert.match(body, /5 products are live today\./);
});

test("the static registry is used when project discovery fails", async () => {
  const resolved = await resolveLlmsDirectory(
    () => {
      throw new Error("discovery unavailable");
    },
    fallbackDirectory,
  );

  assert.strictEqual(resolved, fallbackDirectory);
  assert.match(buildLlmsContent(resolved, [], []), /5 products are live today\./);
});

test("a successful discovery snapshot is preferred over the static fallback", async () => {
  const discovered = fallbackDirectory.map((entry) => ({ ...entry }));
  const resolved = await resolveLlmsDirectory(() => discovered, fallbackDirectory);

  assert.strictEqual(resolved, discovered);
});


test("the Status link describes published routes without promising uptime monitoring", () => {
  const status = companyLinks.find((page) => page.to === "/status");

  assert.equal(
    status?.description,
    "Published and planned product routes; not continuous uptime monitoring.",
  );
  const body = buildLlmsContent(fallbackDirectory, companyLinks, legalLinks);
  assert.ok(
    body.includes(
      "- [Status](https://skyco.online/status): Published and planned product routes; not continuous uptime monitoring.",
    ),
  );
});
