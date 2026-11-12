import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { breadcrumbScript, productAppScript } from "./seo";
import { projectRegistry } from "./projects";

const SITE = "https://skyco.online";

const productRoutes = [
  {
    slug: "currensee",
    name: "CurrenSee",
    path: "/currensee",
    routeFile: "../routes/currensee.tsx",
    imagePath: "/og/currensee.jpg",
    category: "FinanceApplication",
  },
  {
    slug: "chronos",
    name: "Chronos",
    path: "/chronos",
    routeFile: "../routes/chronos.tsx",
    imagePath: "/og/chronos.jpg",
    category: "UtilitiesApplication",
  },
  {
    slug: "my-finance-friend",
    name: "My Finance Friend",
    path: "/finance-friend",
    routeFile: "../routes/finance-friend.tsx",
    imagePath: "/og/finance-friend.jpg",
    category: "FinanceApplication",
  },
  {
    slug: "grocery-packs",
    name: "SkyCo Grocery Packs",
    path: "/grocery",
    routeFile: "../routes/grocery.tsx",
    imagePath: "/og/grocery.jpg",
    category: "LifestyleApplication",
  },
  {
    slug: "float",
    name: "Float",
    path: "/float",
    routeFile: "../routes/float.tsx",
    imagePath: "/og/float.jpg",
    category: "FinanceApplication",
  },
] as const;

function readRoute(routeFile: string): string {
  return readFileSync(new URL(routeFile, import.meta.url), "utf8");
}

test("SEO coverage maps every shipped registry route exactly once", () => {
  const registryRoutes = projectRegistry
    .filter((project) => project.path !== undefined)
    .map(({ slug, path }) => ({ slug, path }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  const metadataRoutes = productRoutes
    .map(({ slug, path }) => ({ slug, path }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  assert.equal(metadataRoutes.length, 5);
  assert.deepEqual(metadataRoutes, registryRoutes);
});

for (const route of productRoutes) {
  test(`${route.name} exposes matching canonical, Open Graph and Twitter URLs`, () => {
    const source = readRoute(route.routeFile);
    const canonicalUrl = `${SITE}${route.path}`;
    const imageUrl = `${SITE}${route.imagePath}`;
    const imageConstant = source.match(/const IMAGE = "([^"]+)";/)?.[1];

    assert.ok(source.includes(`const URL = "${canonicalUrl}";`));
    assert.ok(source.includes('{ property: "og:url", content: URL }'));
    assert.ok(source.includes('{ rel: "canonical", href: URL }'));
    assert.ok(source.includes('{ property: "og:title", content: TITLE }'));
    assert.ok(source.includes('{ property: "og:description", content: DESCRIPTION }'));
    assert.ok(source.includes('{ property: "og:type", content: "website" }'));
    assert.ok(source.includes('{ name: "twitter:card", content: "summary_large_image" }'));
    assert.ok(source.includes('{ name: "twitter:title", content: TITLE }'));
    assert.ok(source.includes('{ name: "twitter:description", content: DESCRIPTION }'));
    assert.ok(source.includes('{ property: "og:image:alt", content: '));
    assert.ok(source.includes('{ name: "twitter:image:alt", content: '));

    if (imageConstant) assert.equal(imageConstant, imageUrl);

    const imageValue = imageConstant ? "IMAGE" : `"${imageUrl}"`;
    assert.ok(source.includes(`{ property: "og:image", content: ${imageValue} }`));
    assert.ok(source.includes(`{ name: "twitter:image", content: ${imageValue} }`));
    assert.ok(
      source.includes(
        `productAppScript("${route.name}", "${route.path}", DESCRIPTION, "${route.category}")`,
      ),
    );
    assert.ok(
      source.includes(`{ name: "${route.name}", path: "${route.path}" }`),
      "breadcrumb must point to the same first-party product path",
    );
  });
}

test("SoftwareApplication structured data emits canonical first-party product URLs", () => {
  for (const route of productRoutes) {
    const schema = JSON.parse(
      productAppScript(route.name, route.path, "Description", route.category).children,
    );

    assert.equal(schema["@type"], "SoftwareApplication");
    assert.equal(schema.url, `${SITE}${route.path}`);
    assert.equal(schema.publisher.url, SITE);
  }
});

test("breadcrumb structured data emits canonical first-party product URLs", () => {
  for (const route of productRoutes) {
    const schema = JSON.parse(
      breadcrumbScript([
        { name: "Products", path: "/#tools" },
        { name: route.name, path: route.path },
      ]).children,
    );
    const productCrumb = schema.itemListElement.at(-1);

    assert.equal(productCrumb.name, route.name);
    assert.equal(productCrumb.item, `${SITE}${route.path}`);
  }
});
