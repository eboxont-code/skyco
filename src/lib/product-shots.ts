import currensee from "@/assets/shots/currensee.webp";
import chronos from "@/assets/shots/chronos.webp";
import finance from "@/assets/shots/finance.webp";
import grocery from "@/assets/shots/grocery.webp";

/**
 * Real screenshots captured from the live products. Replace the file, not the
 * key, when a product's interface changes.
 */
export const productShots: Record<string, { src: string; alt: string }> = {
  currensee: {
    src: currensee,
    alt: "CurrenSee showing the USD to EUR rate with a 30 day chart and a last updated stamp",
  },
  chronos: {
    src: chronos,
    alt: "Chronos showing one date read as Gregorian and Hijri side by side with a month calendar",
  },
  "my-finance-friend": {
    src: finance,
    alt: "My Finance Friend chat screen with example commands such as buying NVDA, next to an empty holdings panel on a fresh guest session",
  },

  "grocery-packs": {
    src: grocery,
    alt: "SkyCo Grocery Packs home screen with the Easy Week starter pack",
  },
};
