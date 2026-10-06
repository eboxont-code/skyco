const SITE = "https://skyco.online";

/** Share image tags for a route. Image lives at /og/<slug>.jpg (1200x630). */
export function shareMeta(slug: string, alt: string) {
  const url = `${SITE}/og/${slug}.jpg`;
  return [
    { property: "og:image", content: url },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: url },
    { name: "twitter:image:alt", content: alt },
  ];
}

type Crumb = { name: string; path: string };

export function productAppScript(name: string, path: string, description: string, category: string) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      url: `${SITE}${path}`,
      description,
      applicationCategory: category,
      operatingSystem: "Web browser",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: "SkyCo", url: SITE },
    }),
  };
}

export function breadcrumbScript(crumbs: Crumb[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: `${SITE}${c.path}`,
      })),
    }),
  };
}

export function pageScript(type: string, name: string, path: string, description: string) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      name,
      url: `${SITE}${path}`,
      description,
      isPartOf: { "@type": "WebSite", name: "SkyCo", url: SITE },
    }),
  };
}

export function aboutScript() { return { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "AboutPage", name: "About SkyCo", url: `${SITE}/about`, mainEntity: { "@type": "Organization", name: "SkyCo", url: SITE, logo: `${SITE}/icons/icon-512.png` } }) }; }
