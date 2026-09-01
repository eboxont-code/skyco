import currensee from "@/assets/shots/currensee.webp";
import chronos from "@/assets/shots/chronos.webp";
import finance from "@/assets/shots/finance.webp";
import grocery from "@/assets/shots/grocery.webp";

type ProductShot = {
  src: string;
  alt: string;
  /** ISO date the screenshot was captured from the live product. */
  captured: string;
  /** What the screen proves, in one short line under the image. */
  result: string;
};

/**
 * Real screenshots captured from the live products. Replace the file and bump
 * `captured` whenever a product's interface changes, so the homepage keeps
 * showing evidence rather than decoration.
 */
export const productShots: Record<string, ProductShot> = {
  currensee: {
    src: currensee,
    alt: "CurrenSee showing the USD to EUR rate with a 30 day chart and a last updated stamp",
    captured: "2026-09-01",
    result: "The rate and the chart are on screen before you touch anything.",
  },
  chronos: {
    src: chronos,
    alt: "Chronos showing one date read as Gregorian and Hijri side by side with a month calendar",
    captured: "2026-09-01",
    result: "One tapped day, read back in six calendar systems.",
  },
  "my-finance-friend": {
    src: finance,
    alt: "My Finance Friend chat screen with example commands such as buying NVDA, next to an empty holdings panel on a fresh guest session",
    captured: "2026-09-01",
    result: "A plain English holding, parsed into a preview before it saves.",
  },

  "grocery-packs": {
    src: grocery,
    alt: "SkyCo Grocery Packs home screen with the Easy Week starter pack",
    captured: "2026-09-01",
    result: "A week of shopping, already grouped by store section.",
  },
};

/** Human wording for how fresh a screenshot is. */
export function shotFreshness(captured: string, now = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(captured).getTime()) / 86_400_000);
  if (days <= 1) return "Updated today";
  if (days < 14) return `Updated ${days} days ago`;
  if (days < 60) return "Updated this month";
  return `Captured ${new Date(captured).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })}`;
}
