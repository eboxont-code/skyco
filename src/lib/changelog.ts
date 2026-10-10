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
  { date: "2026-10-10", title: "October navigation updates", tag: "Improvement", items: ["The release log records the October 10 updates."] },
  { date: "2026-10-09", title: "Saved progress and sharper tool output", tag: "Improvement", items: ["Finance Friend labels each trade as Buy or Sell and copies saved holdings as CSV.", "Grocery keeps ticked items for each pack after a refresh and shows how many are ticked.", "A grocery link can open a chosen pack directly.", "Product pages list the other SkyCo tools, and Status can check the USD to EUR rate on demand.", "Security explains how to report a problem, and the home page answers three common questions."] },
  { date: "2026-10-08", title: "October tool updates", tag: "Improvement", items: ["Grocery quantities scale for households of one, two, four or six, with the choice remembered in this browser.", "FAQ search filters questions and announces the match count.", "Status lists each live tool with its data sources and direct link.", "Releases are grouped by month, and upcoming tools have plain cards.", "The machine-readable product directory names each tool's single job.", "CurrenSee remembers the last conversion, shares the pair and amount in its link, offers popular pairs and announces unavailable rates with a retry button.", "The one-minute rate cache has an explicit size limit, and Chronos updates its date link without adding history entries."] },
  { date: "2026-10-07", title: "Clearer tool feedback", tag: "Improvement", items: ["CurrenSee shows how many minutes ago the rate was fetched and refreshes that line every minute.", "Chronos day buttons have clear labels and Today confirms the reset.", "Finance Friend announces when it cannot read a trade.", "Grocery lists can untick every item at once.", "Chronos, Finance Friend and Grocery explain how they work in three steps.", "The home page trust link opens the mission section, and Privacy and Terms date their last update.", "The support form checks message length, keeps your draft after a refresh, filters automated submissions and confirms when your email app opens.", "CurrenSee connects to its rate sources earlier, and the installed app lists its categories.", "About summarises how the tools handle access and data."] },
  { date: "2026-10-06", title: "Product metadata and page navigation", tag: "Improvement", items: ["All four tools share consistent free application metadata.", "Privacy, Terms and Security have section links.", "Page breadcrumbs have larger keyboard-accessible targets and name the current page.", "CurrenSee and Chronos expose supported browser tools for reference rates and calendar readings.", "Grocery printouts include the pack, household size and date.", "CurrenSee displays fiat amounts with currency codes and crypto amounts as digits.", "The home page has a four-tool directory and a labelled main heading.", "The mobile action bar stays out of the menu and footer.", "Product questions preselect the product on Support.", "Footer links are grouped into Products, Company and Help.", "Release links and app shortcuts open the relevant page directly.", "CurrenSee can copy results and rejects invalid amount text.", "Chronos compares two dates, Grocery can share a list, and Finance Friend keeps up to five holdings during a session.", "FAQ sections, support guidance and back-to-top links improve page navigation.", "About identifies SkyCo as its organization in structured data.", "Status dates its latest update from this release log, and CurrenSee explains its reference rate sources."] },
  { date: "2026-10-05", title: "Product help and clearer wayfinding", tag: "Improvement", items: ["Product help answers have visible keyboard focus rings.", "Product pages link directly to their support answers, and FAQ answers link to the relevant tools.", "About lists the tools on the way alongside the live products.", "Changelog entries have individual anchors and publication dates.", "Status and Security share the same product data source list.", "CurrenSee adds a one-minute rate cache, source names, quick amounts, recent pairs and retry controls.", "Chronos adds day and week numbers and shareable starting dates.", "Finance Friend reads comma-separated prices and explains assumed dates.", "Grocery lists show section counts and can hide checked items.", "Product introductions, quieter motion and clearer labels improve reading and navigation."] },
  {
    date: "2026-10-02",
    title: "Clearer wayfinding and share pictures",
    tag: "Improvement",
    items: [
      "skyco.online/currensee now opens directly on USD to EUR without a redirect.",
      "CurrenSee has a Copy link button for the pair you chose, and a spoken summary of the 30 day chart.",
      "Every page shows a breadcrumb so you can see where you are and get back home.",
      "The home page and each info page have their own share picture.",
      "The not-found page now has its own title and links to all four tools.",
    ],
  },
  {
    date: "2026-10-01",
    title: "Better help and sharing",
    tag: "Improvement",
    items: [
      "Support now has quick answers for each product and a form that opens a ready-made email.",
      "Each product page has its own share picture taken from the real tool.",
      "The Security page explains, tool by tool, where your input goes.",
      "Product pages link to related tools and back to the hub.",
    ],
  },
  {
    date: "2026-09-30",
    title: "Accessibility and contrast pass",
    tag: "Improvement",
    items: [
      "Added a skip link to jump straight to the main content on every page.",
      "Raised colour contrast on accent text and added visible keyboard focus rings.",
      "Tightened CurrenSee amount checks and Chronos date checks with clear help text.",
      "Stopped phone keyboards autocorrecting tickers in the Finance Friend preview.",
    ],
  },
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
