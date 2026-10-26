import { breadcrumbScript, productAppScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { GroceryPackPreview, GROCERY_PACK_IDS } from "@/components/experiences/GroceryPackPreview";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "Grocery Packs: ready shopping lists | SkyCo";
const DESCRIPTION =
  "Open a pack and the week's shopping is already sorted by store section, with quantities for two people or a family of four. Free to browse, no account.";
const URL = "https://skyco.online/grocery";

export const Route = createFileRoute("/grocery")({
  validateSearch: (search: Record<string, unknown>): { pack?: string } => (typeof search.pack === "string" && GROCERY_PACK_IDS.includes(search.pack) ? { pack: search.pack } : {}),
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
      { property: "og:image", content: "https://skyco.online/og/grocery.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://skyco.online/og/grocery.jpg" },
      { property: "og:image:alt", content: "SkyCo Grocery Packs running on skyco.online" },
      { name: "twitter:image:alt", content: "SkyCo Grocery Packs running on skyco.online" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      breadcrumbScript([{ name: "Products", path: "/#tools" }, { name: "SkyCo Grocery Packs", path: "/grocery" }]),
      productAppScript("SkyCo Grocery Packs", "/grocery", DESCRIPTION, "LifestyleApplication"),
    ],
  }),
  component: GroceryPage,
});

function GroceryPage() {
  return (
    <ProductPage
      slug="grocery-packs"
      directory={Route.useLoaderData()}
      experience={<><GroceryPackPreview initialPack={Route.useSearch().pack} /><section className="mt-8" aria-labelledby="how-it-works"><h2 id="how-it-works" className="text-xl font-bold text-foreground">How it works</h2><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground"><li>Choose a sample pack and household size.</li><li>Tick items off as you shop.</li><li>Print or share the list when you need it.</li></ol></section></>}
      experienceTitle="Choose a sample pack and read the sorted list"
      intro="Choose and print a sample shopping list for two or four people."
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
