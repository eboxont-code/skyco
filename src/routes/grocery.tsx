import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { GroceryPackPreview } from "@/components/experiences/GroceryPackPreview";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "SkyCo Grocery Packs | Ready-made shopping lists sorted by store section";
const DESCRIPTION =
  "Open a pack and the week's shopping is already sorted by store section, with quantities for two people or a family of four. Free to browse, no account.";
const URL = "https://skyco.online/grocery";

export const Route = createFileRoute("/grocery")({
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
          name: "SkyCo Grocery Packs",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web browser",
          url: URL,
          description: DESCRIPTION,
          publisher: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online" },
        }),
      },
    ],
  }),
  component: GroceryPage,
});

function GroceryPage() {
  return (
    <ProductPage
      slug="grocery-packs"
      directory={Route.useLoaderData()}
      experience={<GroceryPackPreview />}
      experienceTitle="Choose a sample pack and read the sorted list"
      headline="Choose one of my sample packs and the shopping is grouped by store section, with quantities for two or four. Print it or read it at the shelf."
      points={[
        "Lists grouped the way a shop is laid out, so you walk it once.",
        "Quantities sized for two people or a family of four.",
        "Light meal plans attached to the packs, not a separate app.",
        "Printable, or readable from a phone while you shop.",
        "Two clearly labelled sample packs, with no shop or supplier involved.",
        "No account needed to open a pack.",
      ]}
    />
  );
}
