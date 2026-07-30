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
    tagline: "Live currency and crypto converter",
    description:
      "Built for travel days and cross-border shopping. Live fiat and crypto rates, clear charts, and alerts when a pair hits your number.",
    href: "https://currensee.skyco.online/",
  },
  {
    slug: "chronos",
    name: "Chronos",
    tagline: "Every calendar in one place",
    description:
      "Gregorian, Hijri, Hebrew, Chinese and Persian calendars side by side, so every date you track lines up in a single view.",
    href: "https://chronos.skyco.online/",
  },
  {
    slug: "my-finance-friend",
    name: "My Finance Friend",
    tagline: "Portfolio tracking by chat",
    description:
      "Type what you bought in plain English and it sorts your stocks and ETFs, with a preview before anything is saved.",
    href: "https://chat-folio-pilot.lovable.app/",
  },
];

export const upcomingProjects = [
  {
    name: "Grocery List",
    description: "A fast list you build on your phone and take straight to the shop. No account, no clutter.",
  },
  {
    name: "Budget & Expenses",
    description: "A straightforward money tracker. Enter what you spent, see where it goes, get on with your day.",
  },
  {
    name: "Daily Notes",
    description: "A place to drop a thought without it turning into another app to manage.",
  },
];
