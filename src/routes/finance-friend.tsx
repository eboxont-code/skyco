import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { FinanceParser } from "@/components/experiences/FinanceParser";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "My Finance Friend | Track stocks and ETFs by typing plain English";
const DESCRIPTION =
  "Type a stock or ETF trade in ordinary words and preview the structured entry directly on SkyCo. Nothing is stored by this demo.";
const URL = "https://skyco.online/finance-friend";

export const Route = createFileRoute("/finance-friend")({
  loader: async (): Promise<ResolvedProject[]> => {
    try {
      return await getProjectDirectory();
    } catch {
      return fallbackDirectory;
    }
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "My Finance Friend",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web browser",
          url: URL,
          description: DESCRIPTION,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online" },
        }),
      },
    ],
  }),
  component: FinanceFriendPage,
});

function FinanceFriendPage() {
  return (
    <ProductPage
      slug="my-finance-friend"
      directory={Route.useLoaderData()}
      experience={<FinanceParser />}
      experienceTitle="Type a holding and check the preview"
      headline='Type "bought 50 shares of NVDA today at $145" and check the parsed entry before it saves. No spreadsheet import to get started.'
      points={[
        "Plain English in, a structured holding out.",
        "A preview of every entry before it is written to your portfolio.",
        "Stocks and ETFs tracked together in one list.",
        "No account needed to use the parser preview.",
        "Nothing is stored or sent from this in-page demonstration.",
        "Built for people who gave up on portfolio spreadsheets.",
      ]}
    />
  );
}
