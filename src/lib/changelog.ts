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
    date: "2026-09-28",
    title: "More dependable product controls",
    tag: "Improvement",
    items: [
      "Added clearer amount validation and rate context to CurrenSee.",
      "Made Finance Friend explicit when a trade price was not provided.",
      "Added check-all and reset controls to the printable Grocery sample lists.",
      "Improved screen-reader context across the product tools.",
    ],
  },
  {
    date: "2026-09-26",
    title: "Clearer product actions and more honest data notes",
    tag: "Improvement",
    items: [
      "Standardised product actions around using each tool directly on SkyCo.",
      "Added a direct Bitcoin starting point for CurrenSee.",
      "Updated privacy, security and status wording to match what the in-page tools do today.",
      "Clarified that Grocery Packs are sample lists written by SkyCo.",
    ],
  },
  {
    date: "2026-08-31",
    title: "Trust pages, product screenshots and clean product URLs",
    tag: "Improvement",
    items: [
      "Added About, Privacy, Terms, Security, Support, FAQ and Status pages.",
      "Every product now has a short SkyCo entry URL: skyco.online/currensee, /chronos, /finance-friend and /grocery.",
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
