export type ChangeEntry = {
  date: string; // ISO date
  title: string;
  tag: "Launch" | "Improvement" | "Fix";
  items: string[];
};

/**
 * Only records changes that actually shipped. Add a new entry at the top when
 * something real goes out; do not pad it.
 */
export const changelog: ChangeEntry[] = [
  {
    date: "2026-08-29",
    title: "Trust pages, product screenshots and clean product URLs",
    tag: "Improvement",
    items: [
      "Added Privacy, Terms, Security, Support, FAQ and Status pages.",
      "Every product now has a short SkyCo entry URL: skyco.online/currensee, /chronos, /finance and /grocery.",
      "Homepage product cards now show real screenshots captured from the live products.",
      "One shared header and footer across the whole site.",
      "Started this changelog.",
    ],
  },
  {
    date: "2026-08-20",
    title: "Faster pages and a live product directory",
    tag: "Improvement",
    items: [
      "Page loads no longer wait on outbound checks to the product sites.",
      "Product status is checked in the background, so a product appears here as soon as it is reachable.",
      "Brand images converted to WebP, cutting the largest asset from 851 KB to 63 KB.",
    ],
  },
  {
    date: "2026-08-12",
    title: "SkyCo Grocery Packs",
    tag: "Launch",
    items: ["Printable grocery packs and light meal plans, sorted by store section."],
  },
  {
    date: "2026-08-05",
    title: "My Finance Friend",
    tag: "Launch",
    items: [
      "Describe a trade in plain English and review the parsed entry before it saves.",
      "Guest mode so you can try it without an account.",
    ],
  },
  {
    date: "2026-07-24",
    title: "Chronos",
    tag: "Launch",
    items: ["One date read across six calendar systems, with each month's holidays."],
  },
  {
    date: "2026-07-10",
    title: "CurrenSee",
    tag: "Launch",
    items: ["Live fiat and crypto rates with charts and rate alerts."],
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
