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
  path?: string;
  /** Why the product exists, in one plain sentence. */
  why?: string;
  /** A concrete, checkable example of the job it does. */
  example?: string;
  /** The one killer demo, phrased as the job rather than the software. */
  demo?: string;
  /** Whether opening the product requires an account. */
  account?: string;
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
    name: "CurrenSee",
    tagline: "Live currency and crypto converter",
    description:
      "Built for travel days and cross-border shopping. Current fiat and crypto reference rates with a clear 30 day chart.",
    icon: "converter",
    path: "/currensee",
    demo: "Open it and USD to EUR is already on screen with a live rate and a 30 day chart.",
    why: "Checking a rate usually means an ad-heavy page or a search result that is already out of date.",
    example: "Open it and USD to EUR is already on screen with a 30 day chart and a last updated stamp.",
    account: "No account needed.",
    candidates: [],
  },
  {
    slug: "chronos",
    name: "Chronos",
    tagline: "Every calendar in one place",
    description:
      "Gregorian, Hijri, Hebrew, Chinese, Persian and Indian Saka calendars side by side, so every date you track lines up in a single view.",
    icon: "calendar",
    path: "/chronos",
    demo: "Pick one day and read it in six calendars in about ten seconds.",
    why: "Families and teams that live across two or three calendar systems end up converting dates by hand.",
    example: "Pick one day and read it as Gregorian, Hijri, Hebrew, Chinese, Persian and Indian Saka at once.",
    account: "No account needed.",
    candidates: [],
  },
  {
    slug: "my-finance-friend",
    name: "My Finance Friend",
    tagline: "Portfolio tracking by chat",
    description:
      "Type a stock or ETF trade in plain English and check the structured preview. This in-page demonstration does not save anything.",
    icon: "wallet",
    path: "/finance-friend",
    demo: "Type what you bought in plain English and check the parsed entry without saving it.",
    why: "Portfolio trackers ask for a spreadsheet import before they show you anything useful.",
    example: 'Type "bought 50 shares of NVDA today at $145" and review the parsed entry. The preview is not saved.',
    account: "The in-page preview needs no account and stores nothing.",
    candidates: [],
  },
  {
    slug: "grocery-packs",
    name: "SkyCo Grocery Packs",
    tagline: "Ready-to-use grocery lists",
    description:
      "Printable grocery packs and light meal plans, sorted by store section, with quantities for two people or a family of four.",
    icon: "grocery",
    path: "/grocery",
    demo: "Open a pack and the week's shopping is already sorted by store section.",
    why: "Most weeks the hard part is not cooking, it is deciding what to buy before you get to the shop.",
    example: "Open the Easy Week starter pack and it is already sorted by store section with quantities filled in.",
    account: "No account needed.",
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
