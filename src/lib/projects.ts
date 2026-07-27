export type SkyCoProject = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
};

// SkyCo is the parent brand; these are its live projects.
export const liveProjects: SkyCoProject[] = [
  {
    slug: "currensee",
    name: "CurrenSee",
    tagline: "Live currency & crypto converter",
    description:
      "My converter for travel days and cross-border shopping. Live fiat and crypto rates, simple charts, and alerts when a pair hits your number.",
    href: "https://currensee.skyco.online/",
  },
  {
    slug: "chronos",
    name: "Chronos",
    tagline: "Every calendar, one place",
    description:
      "Gregorian, Hijri, Hebrew, Chinese, and Persian calendars side by side, so the dates I care about all line up in one view.",
    href: "https://chronos.skyco.online/",
  },
  {
    slug: "my-finance-friend",
    name: "My Finance Friend",
    tagline: "Portfolio tracking by chat",
    description:
      "I type what I bought in plain English and it sorts out my stocks and ETFs, showing me a preview before anything gets saved.",
    href: "https://chat-folio-pilot.lovable.app/",
  },
];

export const upcomingProjects = [
  {
    name: "Grocery List",
    description: "A quick list I build on my phone and actually take to the shop. No accounts, no clutter.",
  },
  {
    name: "Budget & Expenses",
    description: "The simple money tracker I still want. Type it in, see where it's going, move on.",
  },
  {
    name: "Daily Notes",
    description: "Somewhere to drop a thought without it turning into another app to manage.",
  },
];
