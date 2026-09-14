import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "CurrenSee | Live currency and crypto converter by SkyCo";
const DESCRIPTION =
  "Convert any currency or crypto with live rates, a 30 day chart and rate alerts. Free, no account, works on a phone browser.";
const URL = "https://skyco.online/currensee";

export const Route = createFileRoute("/currensee")({
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
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CurrenSee",
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
  component: CurrenSeePage,
});

function CurrenSeePage() {
  return (
    <ProductPage
      slug="currensee"
      directory={Route.useLoaderData()}
      headline="Open it and USD to EUR is already on screen with a live rate and a 30 day chart. Switch the pair, read the trend, set an alert, close the tab."
      points={[
        "Live fiat rates for the pairs people actually travel and shop with.",
        "Crypto alongside currencies, in the same view and the same units.",
        "A 30 day chart so you can see whether today is a good day to convert.",
        "Rate alerts when a pair reaches the number you care about.",
        "A last updated stamp on every rate, so you know how fresh it is.",
        "No account, no install, no ads competing with the number you came for.",
      ]}
    />
  );
}
