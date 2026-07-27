import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { ToolsGrid } from "@/components/ToolsGrid";
import { MotivationBand } from "@/components/MotivationBand";
import { HelpSection } from "@/components/HelpSection";
import { Footer } from "@/components/Footer";
import { liveProjects } from "@/lib/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkyCo | Small, honest tools for everyday life" },
      {
        name: "description",
        content:
          "SkyCo is home to three live tools: CurrenSee for currency and crypto rates, Chronos for multi-calendar planning, and My Finance Friend for portfolio tracking.",
      },
      { property: "og:title", content: "SkyCo | Small, honest tools for everyday life" },
      {
        property: "og:description",
        content:
          "Three live tools from SkyCo: CurrenSee for rates, Chronos for calendars, and My Finance Friend for your portfolio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/" },
      { name: "twitter:card", content: "summary_large_image" },
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
            url: p.href,
          })),
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <ToolsGrid />
        <MotivationBand />
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
}
