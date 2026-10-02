import { shareMeta } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { ToolsGrid } from "@/components/ToolsGrid";
import { MotivationBand } from "@/components/MotivationBand";
import { HelpSection } from "@/components/HelpSection";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";

import { fallbackDirectory, splitDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";
import { listNames } from "@/lib/project-copy";

export const Route = createFileRoute("/")({
  loader: async (): Promise<ResolvedProject[]> => {
    try {
      return await getProjectDirectory();
    } catch {
      return fallbackDirectory;
    }
  },
  head: ({ loaderData }) => {
    const directory = loaderData ?? fallbackDirectory;
    const liveProjects = splitDirectory(directory).live;
    const names = listNames(liveProjects.map((p) => p.name));
    const detailed = listNames(liveProjects.map((p) => `${p.name} (${p.tagline.toLowerCase()})`));

    return {
    meta: [
      { title: "SkyCo | Small web tools for everyday life" },
      {
        name: "description",
        content: `SkyCo is a founder-led studio building focused web tools: ${detailed}.`.slice(
          0,
          158,
        ),
      },
      { property: "og:title", content: "SkyCo | Small web tools for everyday life" },
      {
        property: "og:description",
        content: `Live products from SkyCo: ${names}.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/" },
      ...shareMeta("home", "SkyCo share card listing CurrenSee, Chronos, My Finance Friend and SkyCo Grocery Packs"),
      { name: "twitter:title", content: "SkyCo | Small web tools for everyday life" },
      { name: "twitter:description", content: `Live products from SkyCo: ${names}.` },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "SkyCo projects",
          itemListElement: liveProjects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            description: p.tagline,
            url: `https://skyco.online${p.path ?? ""}`,
          })),
        }),
      },
    ],
    };
  },
  component: Index,
});

function Index() {
  const directory = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar directory={directory} />
      <main id="main-content">
        <Hero directory={directory} />
        <Mission directory={directory} />
        <ToolsGrid directory={directory} />
        <MotivationBand />
        <HelpSection />
      </main>
      <Footer directory={directory} />
      <MobileActionBar directory={directory} />
    </div>

  );
}
