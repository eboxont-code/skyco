/** One navigation source of truth for the whole SkyCo site. */
export type NavLink = { label: string; to: string; description?: string };

export const companyLinks: NavLink[] = [
  { label: "About", to: "/about", description: "Who runs SkyCo and how it is built" },
  { label: "What's new", to: "/changelog", description: "Recent releases and fixes" },
  { label: "Support", to: "/support", description: "Get help or report a problem" },
  { label: "Status", to: "/status", description: "Published and planned product routes; not continuous uptime monitoring." },
  { label: "FAQ", to: "/faq", description: "Common questions answered" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  { label: "Security", to: "/security" },
];

/** The compact strip repeated at the bottom of every page. */
export const trustStrip: NavLink[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  { label: "Security", to: "/security" },
  { label: "Support", to: "/support" },
  { label: "Status", to: "/status" },
];

export const SUPPORT_EMAIL = "support@skyco.online";
export const SITE_URL = "https://skyco.online";

export const footerCompanyLinks = companyLinks.filter(link => ["/about", "/changelog"].includes(link.to));
export const footerHelpLinks = [...companyLinks.filter(link => !["/about", "/changelog"].includes(link.to)), ...legalLinks];
