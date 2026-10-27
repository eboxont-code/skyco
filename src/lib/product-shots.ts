import currensee from "@/assets/shots/currensee.webp";
import chronos from "@/assets/shots/chronos.webp";
import finance from "@/assets/shots/finance.webp";
import grocery from "@/assets/shots/grocery.webp";
import currensee480 from "@/assets/shots/currensee-480.webp";
import currensee800 from "@/assets/shots/currensee-800.webp";
import chronos480 from "@/assets/shots/chronos-480.webp";
import chronos800 from "@/assets/shots/chronos-800.webp";
import finance480 from "@/assets/shots/finance-480.webp";
import finance800 from "@/assets/shots/finance-800.webp";
import grocery480 from "@/assets/shots/grocery-480.webp";
import grocery800 from "@/assets/shots/grocery-800.webp";

type ProductShot = {
  src: string;
  srcSet?: string;
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
  float: {
    src: "/screens/float-card.webp",
    alt: "Float weekly spending preview",
    captured: "2026-10-23",
    result: "The weekly spending view, with bills and BNPL deducted.",
  },
  currensee: {
    src: currensee,
    srcSet: `${currensee480} 480w, ${currensee800} 800w, ${currensee} 1280w`,
    alt: "CurrenSee showing the USD to EUR rate with a 30 day chart and a last updated stamp",
    captured: "2026-10-11",
    result: "The rate and the chart are on screen before you touch anything.",
  },
  chronos: {
    src: chronos,
    srcSet: `${chronos480} 480w, ${chronos800} 800w, ${chronos} 1280w`,
    alt: "Chronos showing the chosen date in six calendar systems",
    captured: "2026-10-11",
    result: "One tapped day, read back in six calendar systems.",
  },
  "my-finance-friend": {
    src: finance,
    srcSet: `${finance480} 480w, ${finance800} 800w, ${finance} 1280w`,
    alt: "My Finance Friend trade input and structured preview",
    captured: "2026-10-11",
    result: "A plain English holding, parsed into a preview before it saves.",
  },

  "grocery-packs": {
    src: grocery,
    srcSet: `${grocery480} 480w, ${grocery800} 800w, ${grocery} 1280w`,
    alt: "SkyCo Grocery Packs selected shopping list sorted by store section",
    captured: "2026-10-11",
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
