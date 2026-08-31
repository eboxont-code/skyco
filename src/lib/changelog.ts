export type ChangeEntry = {
  date: string; // ISO date
  title: string;
  tag: "Launch" | "Improvement" | "Fix";
  items: string[];
};

/**
 * Only records changes to this site that actually shipped, with dates I can
 * stand behind. Add a new entry at the top when something real goes out; do
 * not pad it and do not backdate.
 */
export const changelog: ChangeEntry[] = [
  {
    date: "2026-08-31",
    title: "Trust pages, product screenshots and clean product URLs",
    tag: "Improvement",
    items: [
      "Added About, Privacy, Terms, Security, Support, FAQ and Status pages.",
      "Every product now has a short SkyCo entry URL: skyco.online/currensee, /chronos, /finance and /grocery.",
      "Homepage product sections show real screenshots captured from the live products.",
      "One shared header and footer across the whole site.",
      "Started this changelog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Faster pages and a live product directory",
    tag: "Improvement",
    items: [
      "Page loads no longer wait on outbound checks to the product sites.",
      "Product status is checked in the background, so a product appears here as soon as it is reachable.",
      "Brand images converted to WebP, cutting the largest asset from 851 KB to 63 KB.",
      "Added a machine-readable llms.txt describing the products for AI assistants.",
    ],
  },
];

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
