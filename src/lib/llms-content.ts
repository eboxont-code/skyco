import type { ResolvedProject } from "./projects";
import type { NavLink } from "./site-nav";

/** Build the public machine-readable hub description from the resolved directory. */
export function buildLlmsContent(
  directory: ResolvedProject[],
  companyLinks: NavLink[],
  legalLinks: NavLink[],
): string {
  const live = directory.filter((project) => project.live);
  const upcoming = directory.filter((project) => !project.live);

  return [
    "# SkyCo",
    "",
    `> SkyCo is a founder-led software studio building small web tools for everyday life. ${live.length} products are live today.`,
    "",
    "SkyCo is the single home for a family of focused, no-clutter web tools. Every live product runs at a path on skyco.online.",
    "",
    "## Pages",
    "",
    "- [Home](https://skyco.online/): Overview of SkyCo, its live products, how the company works, and how to get in touch.",
    "",
    ...[...companyLinks, ...legalLinks].map(
      (page) =>
        `- [${page.label}](https://skyco.online${page.to}): ${page.description ?? page.label + " information for SkyCo."}`,
    ),
    "",
    "## Projects",
    "",
    ...live.map(
      (project) =>
        `${project.name}: ${project.job ?? project.tagline} https://skyco.online${project.path ?? ""}`,
    ),
    ...(upcoming.length
      ? [
          "",
          "## Planned — not live yet",
          "",
          ...upcoming.map((project) => `- ${project.name}: ${project.description}`),
        ]
      : []),
    "",
  ].join("\n");
}

/** Use the last known static registry when project discovery cannot be loaded. */
export async function resolveLlmsDirectory(
  loadSnapshot: () => ResolvedProject[] | Promise<ResolvedProject[]>,
  fallback: ResolvedProject[],
): Promise<ResolvedProject[]> {
  try {
    return await loadSnapshot();
  } catch {
    return fallback;
  }
}
