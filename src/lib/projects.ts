/**
 * SkyCo project registry.
 *
 * This is the single source of truth for the whole site: navbar, footer, tools
 * grid, structured data, llms.txt and the sitemap all read from here.
 *
 * To add a new SkyCo project, append one entry below. List every URL it might
 * answer on in `candidates`, best first (custom subdomain, then the fallback
 * URL). At runtime the site probes those URLs, picks the first one that
 * responds, and flips the project between "Live" and "On the way" on its own.
 * That means when a subdomain is connected later, the site switches to it
 * without another code change.
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
  /** Candidate URLs, best first. The first one that responds becomes `href`. */
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
      "Built for travel days and cross-border shopping. Live fiat and crypto rates, clear charts, and alerts when a pair hits your number.",
    icon: "converter",
    candidates: ["https://currensee.skyco.online/", "https://skycocurrensee.lovable.app/"],
  },
  {
    slug: "chronos",
    name: "Chronos",
    tagline: "Every calendar in one place",
    description:
      "Gregorian, Hijri, Hebrew, Chinese and Persian calendars side by side, so every date you track lines up in a single view.",
    icon: "calendar",
    candidates: ["https://chronos.skyco.online/", "https://stellar-chronos-spark.lovable.app/"],
  },
  {
    slug: "my-finance-friend",
    name: "My Finance Friend",
    tagline: "Portfolio tracking by chat",
    description:
      "Type what you bought in plain English and it sorts your stocks and ETFs, with a preview before anything is saved.",
    icon: "wallet",
    candidates: ["https://finance.skyco.online/", "https://chat-folio-pilot.lovable.app/"],
  },
  {
    slug: "grocery-packs",
    name: "SkyCo Grocery Packs",
    tagline: "Ready-to-use grocery lists",
    description:
      "Printable grocery packs and light meal plans, sorted by store section, with quantities for two people or a family of four.",
    icon: "grocery",
    candidates: [
      "https://grocery.skyco.online/",
      "https://groceries.skyco.online/",
      "https://skyco-easy-list-hub.lovable.app/",
    ],
  },
  {
    slug: "budget",
    name: "Budget & Expenses",
    tagline: "A straightforward money tracker",
    description:
      "Enter what you spent, see where it goes, and get on with your day. No spreadsheets to maintain.",
    icon: "wallet",
    candidates: ["https://budget.skyco.online/"],
  },
  {
    slug: "notes",
    name: "Daily Notes",
    tagline: "One quiet place for a thought",
    description:
      "Somewhere to drop a note without it turning into another app to manage.",
    icon: "notes",
    candidates: ["https://notes.skyco.online/"],
  },
];

/**
 * Status used before (or instead of) a live probe. Keep this in sync with what
 * is genuinely reachable today; the runtime probe corrects it either way.
 */
const knownHrefs: Record<string, string> = {
  currensee: "https://currensee.skyco.online/",
  chronos: "https://chronos.skyco.online/",
  "my-finance-friend": "https://chat-folio-pilot.lovable.app/",
  "grocery-packs": "https://skyco-easy-list-hub.lovable.app/",
};

export const fallbackDirectory: ResolvedProject[] = projectRegistry.map((project) => {
  const known = knownHrefs[project.slug];
  return {
    ...project,
    href: known ?? project.candidates[0] ?? "https://skyco.online/",
    live: Boolean(known),
  };
});

export function splitDirectory(directory: ResolvedProject[]) {
  return {
    live: directory.filter((p) => p.live),
    upcoming: directory.filter((p) => !p.live),
  };
}

/** Kept for callers that only need the currently live set. */
export const liveProjects: ResolvedProject[] = splitDirectory(fallbackDirectory).live;
