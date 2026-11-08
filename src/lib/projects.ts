/**
 * SkyCo project registry.
 *
 * This is the single source of truth for the whole site: navbar, footer, tools
 * grid, structured data, llms.txt and the sitemap all read from here.
 *
 * Shipped products live at paths on skyco.online. The optional candidates list
 * remains only for checking a future project before its hub route ships.
 */
export type ProjectIcon =
  | "converter"
  | "calendar"
  | "wallet"
  | "grocery"
  | "notes"
  | "default";

export type SkyCoProject = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: ProjectIcon;
  /** Clean SkyCo product path, for example /currensee. */
  path?: "/currensee" | "/chronos" | "/finance-friend" | "/grocery" | "/float";
  /** Why the product exists, in one plain sentence. */
  why?: string;
  /** A concrete, checkable example of the job it does. */
  example?: string;
  /** The one killer demo, phrased as the job rather than the software. */
  demo?: string;
  /** Whether opening the product requires an account. */
  account?: string;
  dataSources?: string[];
  job?: string;
  candidates: string[];
};

/** A project after its live status has been resolved at runtime. */
export type ResolvedProject = SkyCoProject & {
  href: string;
  live: boolean;
};


export const projectRegistry: SkyCoProject[] = [
  {
    slug: "currensee",
    job: "Convert a currency or crypto amount using current reference rates.",
    name: "CurrenSee",
    tagline: "Live currency and crypto converter",
    description:
      "Built for travel days and cross-border shopping. Current fiat and crypto reference rates with a clear 30 day chart.",
    icon: "converter",
    path: "/currensee",
    dataSources: ["Frankfurter", "CoinGecko", "Nepal Rastra Bank"],
    demo: "Open it and USD to EUR is already on screen with a live rate and a 30 day chart.",
    why: "Checking a rate usually means an ad-heavy page or a search result that is already out of date.",
    example: "Open it and USD to EUR is already on screen with a 30 day chart and a last updated stamp.",
    account: "No account needed.",
    candidates: [],
  },
  {
    slug: "chronos",
    job: "Read one date in seven calendar systems.",
    name: "Chronos",
    tagline: "Seven calendar systems in one place",
    description:
      "Gregorian, Nepali Bikram Sambat, Hijri, Hebrew, Chinese, Persian and Indian Saka calendars side by side, so every date you track lines up in a single view.",
    icon: "calendar",
    path: "/chronos",
    dataSources: [],
    demo: "Pick one day and read it in seven calendars in about ten seconds.",
    why: "Families and teams that live across two or three calendar systems end up converting dates by hand.",
    example: "Pick one day and read it as Gregorian, Nepali Bikram Sambat, Hijri, Hebrew, Chinese, Persian and Indian Saka at once.",
    account: "No account needed.",
    candidates: [],
  },
  {
    slug: "my-finance-friend",
    job: "Parse a plain-English trade into a structured preview.",
    name: "My Finance Friend",
    tagline: "Plain-English trade parser",
    description:
      "Type a stock or ETF trade in plain English and check the structured preview. This in-page demonstration does not save anything.",
    icon: "wallet",
    path: "/finance-friend",
    dataSources: [],
    demo: "Type what you bought in plain English and check the parsed entry without saving it.",
    why: "Portfolio trackers ask for a spreadsheet import before they show you anything useful.",
    example: 'Type "bought 50 shares of NVDA today at $145" and review the parsed entry. The preview is not saved.',
    account: "The in-page preview needs no account and stores nothing.",
    candidates: [],
  },
  {
    slug: "grocery-packs",
    job: "Choose a sample shopping list sorted by store section.",
    name: "SkyCo Grocery Packs",
    tagline: "Ready-to-use grocery lists",
    description:
      "Printable grocery packs and light meal plans, sorted by store section, with quantities for two people or a family of four.",
    icon: "grocery",
    path: "/grocery",
    dataSources: [],
    demo: "Open a pack and the week's shopping is already sorted by store section.",
    why: "Most weeks the hard part is not cooking, it is deciding what to buy before you get to the shop.",
    example: "Open the Easy Week starter pack and it is already sorted by store section with quantities filled in.",
    account: "No account needed.",
    candidates: [],
  },
  {
    slug: "float",
    job: "Work out what is left to spend after pay, bills and BNPL instalments.",
    name: "Float",
    tagline: "Know what you can spend this week",
    description:
      "Add your pay, bills and Afterpay or BNPL instalments and see what is left to spend this week, fortnight or month, in Australian dollars.",
    icon: "wallet",
    path: "/float",
    dataSources: [],
    demo: "Open it and a sample week is already worked out: pay in, bills and BNPL out, and what is left.",
    why: "Pay, bills and Afterpay instalments land on different days, so the bank balance rarely tells you what is safe to spend this week.",
    example: "Add a fortnightly pay, weekly rent and an Afterpay instalment, and Float shows what is left for this week in Australian dollars.",
    account: "No account needed. Guest mode keeps your numbers in this browser only.",
    candidates: [],
  },

  {
    slug: "budget",
    name: "Budget & Expenses",
    tagline: "A straightforward money tracker",
    description:
      "Enter what you spent, see where it goes, and get on with your day. No spreadsheets to maintain.",
    icon: "wallet",
    candidates: [],
  },
  {
    slug: "notes",
    name: "Daily Notes",
    tagline: "One quiet place for a thought",
    description:
      "Somewhere to drop a note without it turning into another app to manage.",
    icon: "notes",
    candidates: [],
  },
];

/**
 * Status used before (or instead of) a live probe. Keep this in sync with what
 * is genuinely reachable today; the runtime probe corrects it either way.
 */
const SITE = "https://skyco.online";

export const fallbackDirectory: ResolvedProject[] = projectRegistry.map((project) => ({
  ...project,
  // Every shipped product is hosted on the hub itself, so its URL is a path.
  href: project.path ? `${SITE}${project.path}` : (project.candidates[0] ?? `${SITE}/`),
  live: Boolean(project.path),
}));

export function splitDirectory(directory: ResolvedProject[]) {
  return {
    live: directory.filter((p) => p.live),
    upcoming: directory.filter((p) => !p.live),
  };
}

/** Kept for callers that only need the currently live set. */
export const liveProjects: ResolvedProject[] = splitDirectory(fallbackDirectory).live;

/** Resolve the outbound URL for a clean SkyCo entry path such as /currensee. */
export function hrefForSlug(slug: string): string {
  return fallbackDirectory.find((p) => p.slug === slug)?.href ?? "https://skyco.online/";
}

/**
 * The URL to send a visitor to. Prefer the clean SkyCo entry path so every
 * product is shareable under one domain; fall back to the product URL.
 */
export function entryHref(project: ResolvedProject): string {
  return project.path ?? project.href;
}
