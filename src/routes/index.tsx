import { shareMeta } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { ToolsGrid } from "@/components/ToolsGrid";
import { HelpSection } from "@/components/HelpSection";
import { Footer } from "@/components/Footer";

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
    <div className="min-h-screen bg-background">
      <Navbar directory={directory} />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Hero directory={directory} />
        <ToolsGrid directory={directory} />
        <Mission directory={directory} />
        <section aria-labelledby="common-questions-heading" className="px-6 py-12"><div className="mx-auto max-w-3xl"><h2 id="common-questions-heading" className="text-2xl font-bold text-foreground">Common questions</h2><dl className="mt-5 space-y-4">{[["What is SkyCo?", "SkyCo is a small software studio building focused browser tools for converting money, lining up calendars, tracking a portfolio and planning a shop."], ["Do the products cost anything?", "No. Everything currently listed on SkyCo is free to open and use, with no trial and no card details."], ["Do I need an account?", "No. The four tools currently running on SkyCo can be used without an account."]].map(([q, a]) => <div key={q}><dt className="font-semibold text-foreground">{q}</dt><dd className="mt-1 text-sm text-muted-foreground">{a}</dd></div>)}</dl><Link to="/faq" className="mt-5 inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">Read all questions</Link></div></section>
        <HelpSection />
      </main>
      <Footer directory={directory} />
    </div>

  );
}
