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
    date: "2026-10-29",
    title: "More ways to convert, share dates and manage holdings",
    tag: "Improvement",
    items: [
      "Press Enter to convert in CurrenSee, and choose a 7 day or 30 day rate chart.",
      "Chronos can copy a link to any selected date and explains invalid dates without losing the last valid readings.",
      "CurrenSee offers a home screen install hint on supported browsers.",
      "Finance Friend has Remove and confirmed Clear all controls for saved holdings.",
    ],
  },
  {
    date: "2026-10-28",
    title: "More NPR pairs and saved conversions",
    tag: "Improvement",
    items: [
      "Swiss franc and Chinese yuan to NPR, NPR to pound and NPR to euro now have converter pages.",
      "Saved conversions in CurrenSee stay after a reload and keep the values originally saved.",
      "Currency pickers now show flags, with symbols on pair shortcuts.",
    ],
  },
  {
    date: "2026-10-27",
    title: "Smaller home images and clearer NPR rates",
    tag: "Improvement",
    items: [
      "Pages load faster on phones because the home images now come in smaller sizes.",
      "Helper notes are larger and easier to read.",
      "The NPR rates page now links to every currency to NPR converter.",
    ],
  },
  {
    date: "2026-10-26",
    title: "Clearer reading and more date tools",
    tag: "Improvement",
    items: [
      "The footer has clear column headings and roomier links.",
      "Small labels are larger and easier to read, and in-page links no longer hide under the header.",
      "Currency pair pages now show popular amounts using the rate on the page.",
      "Chronos can share a date and work out an age on any selected date.",
    ],
  },
  {
    date: "2026-10-25",
    title: "Clearer product cards and easier pages to scan",
    tag: "Improvement",
    items: [
      "The home page now shows each product as a card with a real screenshot, a short description and a clear button.",
      "Sections on the home and product pages alternate between white and a light tint, so they are easier to scan.",
      "Product pages show the other SkyCo tools as cards, with a link back to the hub.",
      "Popular currency pairs are now pill links that are easy to tap.",
      "Questions and answers use one clearer layout across the site.",
      "The footer and headings are easier to read.",
    ],
  },
  {
    date: "2026-10-24",
    title: "November Tihar dates and clearer help on phones",
    tag: "Improvement",
    items: [
      "Chronos now shows Tihar 2026 on its November dates, from Kaag Tihar on 7 November to Bhai Tika on 11 November.",
      "The Australia to Nepal money guide now covers how money can arrive, how long it usually takes, a worked example and common questions.",
      "Buttons, menu links and form fields are easier to tap on phones.",
      "Pages now share one spacing scale, with the Back to top links removed.",
    ],
  },
  {
    date: "2026-10-23",
    title: "Nepali calendar readings and monthly observances in Chronos",
    tag: "Improvement",
    items: [
      "Chronos now shows the Nepali Bikram Sambat date alongside the other calendars, with native script readings under each system.",
      "Each calendar now lists the holidays and observances for the month, including Nepali, Chinese and Hebrew dates, with an option to add one to your own calendar.",
      "The Float card on the home page now shows a preview of the weekly spending view.",
    ],
  },
  {
    date: "2026-10-22",
    title: "Favourite currency pairs and rate alerts",
    tag: "Improvement",
    items: [
      "CurrenSee now lets you star favourite pairs and choose a default pair that opens first.",
      "You can set a rate alert to tell you while the page is open when a pair crosses your chosen level.",
      "The budgeting guide for new arrivals in Australia is now listed in the sitemap.",
    ],
  },
  {
    date: "2026-10-19",
    title: "A budgeting guide for new arrivals and better Float pages",
    tag: "Improvement",
    items: [
      "New guide: Budgeting in Australia when you are new here, written for students and workers on weekly or fortnightly pay.",
      "The eight Float planning pages now each have their own content and a place in the sitemap, with a Ways to use Float list on the Float page.",
      "The crypto pair FAQs now point to the latest CoinGecko price shown on the page.",
    ],
  },
  {
    date: "2026-10-18",
    title: "Bitcoin and Ethereum prices in Australian dollars",
    tag: "Improvement",
    items: [
      "BTC to AUD and ETH to AUD have their own price pages, with prices from CoinGecko.",
      "Float now has eight planning pages for pay cycles, bills and buy now pay later instalments.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Three new pair pages and clearer rate sources",
    tag: "Improvement",
    items: [
      "OMR to NPR now has its own pair page with the Nepal Rastra Bank reference rate, alongside new AUD to SGD and AUD to CAD pages.",
      "Every NPR pair page now shows the Nepal Rastra Bank buying and selling rates next to the midpoint.",
      "The sitemap now carries a last updated date for every page.",
    ],
  },
  {
    date: "2026-10-16",
    title: "Five more Nepal currency pairs and a security update",
    tag: "Improvement",
    items: [
      "CAD, SGD, KWD, BHD and HKD to NPR now have their own currency pair pages.",
      "Every NPR pair page shows the Nepal Rastra Bank reference rate and its date instead of an estimate from the Indian rupee peg.",
      "The framework was updated to address a security issue.",
    ],
  },
  {
    date: "2026-10-15",
    title: "Share pictures, calendar readings and the Float waitlist",
    tag: "Improvement",
    items: [
      "Every product page has a share picture, including Float.",
      "Currency pair pages and /currensee/rates use the same Nepal Rastra Bank reference rates, adjusted for each currency's unit.",
      "Chronos puts the six calendar readings directly below the date picker.",
      "The Float waitlist now saves your email when you join.",
    ],
  },
  { date: "2026-10-14", title: "Currency references and the Nepal transfer guide", tag: "Launch", items: ["CurrenSee now has 20 currency pair pages, including /currensee/aud-to-npr, with reference amounts and related conversions.", "The /currensee/rates page lists today's Nepal Rastra Bank buy, sell and midpoint reference rates, with the rate date shown.", "The guide at /guides/sending-money-to-nepal-from-australia explains how to compare a transfer quote with the AUD to NPR reference rate."] },
  { date: "2026-10-12", title: "Float and currency pair pages", tag: "Launch", items: ["Float now has its own page at /float for working out what is left to spend after bills and BNPL instalments.", "CurrenSee has its first pair pages, such as /currensee/aud-to-npr, with today's reference rate, quick reference tables and related pairs.", "Pair page breadcrumbs now read Home, CurrenSee and the pair, and a page no longer links to itself."] },
  { date: "2026-10-11", title: "Mobile layout updates", tag: "Improvement", items: ["Home no longer has a sticky product action. Product pages show only their own action after its opening button scrolls away, and hide it during typing, menus and printing.", "Home puts the products before How I work, removes repeated sections, and uses two opening actions.", "Product cards share one layout and current tool screenshots without extra captions.", "Footer links appear once, with legal links grouped at the bottom.", "Product pages put the real tool below one introduction, remove mockups and repeated actions, and share CurrenSee amounts without quotes.", "CurrenSee adds Nepal, Gulf, Malaysian and South Korean currencies with Nepal Rastra Bank reference data and a labelled INR-peg fallback for NPR."] },
  { date: "2026-10-10", title: "October navigation updates", tag: "Improvement", items: ["Desktop and mobile menus identify the current page for screen readers.", "The footer links to the latest release and shows its date.", "Finance Friend lists the trade sentence patterns it understands.", "Chronos explains each of its six calendar readings.", "Each live product card is one keyboard-accessible link.", "Information pages print without site menus and include full link addresses.", "Product names on About link directly to their tools.", "CurrenSee shows the inverse reference rate below the result."] },
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
