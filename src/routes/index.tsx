import { QuestionAnswers } from "@/components/QuestionAnswers";
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
      ...shareMeta("home", "SkyCo share card listing CurrenSee, Chronos, My Finance Friend, SkyCo Grocery Packs and Float"),
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
      <main id="main-content" tabIndex={-1} className="home-sections focus:outline-none">
        <Hero directory={directory} />
        <ToolsGrid directory={directory} />
        <section aria-labelledby="popular-conversions-heading" className="px-6 py-12 md:py-16"><div className="mx-auto max-w-3xl"><h2 id="popular-conversions-heading" className="text-2xl font-bold text-foreground">Popular currency pairs</h2><ul className="mt-4 flex flex-wrap gap-3">{([["aud-to-npr","AUD to NPR"],["usd-to-npr","USD to NPR"],["npr-to-inr","NPR to INR"],["aud-to-inr","AUD to INR"],["usd-to-aud","USD to AUD"]] as const).map(([slug, label]) => <li key={slug}><Link to="/currensee/$pair" params={{ pair: slug }} className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-sky-deep hover:bg-section-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</Link></li>)}<li><Link to="/currensee/rates" className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-sky-deep hover:bg-section-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">All NPR rates today</Link></li></ul></div></section>
        <Mission directory={directory} />
        <section aria-labelledby="common-questions-heading" className="px-6 py-12 md:py-16"><div className="mx-auto max-w-3xl"><h2 id="common-questions-heading" className="text-2xl font-bold text-foreground">Common questions</h2><QuestionAnswers items={[["What is SkyCo?", "SkyCo is a small software studio building focused browser tools for converting money, lining up calendars, tracking a portfolio, planning a shop and working out what is left to spend."], ["Do the products cost anything?", "No. Everything currently listed on SkyCo is free to open and use, with no trial and no card details."], ["Do I need an account?", "No. Every tool currently running on SkyCo can be used without an account."]].map(([q, a], index) => ({ id: `home-question-${index}`, question: q, answer: a }))} /><Link to="/faq" className="mt-5 inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">Read all questions</Link></div></section>
        <HelpSection />
      </main>
      <Footer directory={directory} />
    </div>

  );
}
