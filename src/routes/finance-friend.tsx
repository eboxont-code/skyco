import { breadcrumbScript, productAppScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { FinanceParser } from "@/components/experiences/FinanceParser";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "My Finance Friend | Turn a plain-English trade into checkable fields";
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
      { property: "og:image", content: "https://skyco.online/og/finance-friend.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://skyco.online/og/finance-friend.jpg" },
      { property: "og:image:alt", content: "My Finance Friend running on skyco.online" },
      { name: "twitter:image:alt", content: "My Finance Friend running on skyco.online" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      breadcrumbScript([{ name: "Products", path: "/#tools" }, { name: "My Finance Friend", path: "/finance-friend" }]),
      productAppScript("My Finance Friend", "/finance-friend", DESCRIPTION, "FinanceApplication"),
    ],
  }),
  component: FinanceFriendPage,
});

function FinanceFriendPage() {
  return (
    <ProductPage
      slug="my-finance-friend"
      directory={Route.useLoaderData()}
      experience={<><FinanceParser /><section className="mt-8" aria-labelledby="what-it-understands"><h2 id="what-it-understands" className="text-xl font-bold text-foreground">What it understands</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground"><li>Buy, bought, add or added: bought 50 shares of NVDA at $145.</li><li>Sell or sold: sold 5 TSLA at 240.</li><li>Shares, units or a quantity followed by an uppercase ticker: buy 3 VOO.</li><li>Prices after at, @ or for, with an optional dollar sign and commas.</li><li>Today or yesterday. If neither is given, the date is shown as today, assumed.</li></ul></section><section className="mt-8" aria-labelledby="how-it-works"><h2 id="how-it-works" className="text-xl font-bold text-foreground">How it works</h2><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground"><li>Type a trade in plain words, or tap an example.</li><li>Check the ticker, quantity and price it found.</li><li>Keep it for this session or copy it as CSV.</li></ol></section></>}
      experienceTitle="Type a holding and check the preview"
      intro="Turn a plain-English trade into fields you can check."
      headline='Type "bought 50 shares of NVDA today at $145" and inspect how the sentence is parsed. Nothing is saved or sent from this preview.'
      points={[
        "Plain English in, a structured holding out.",
        "A local preview of action, quantity, ticker, price and date.",
        "Examples for common stock and ETF trade wording.",
        "No account needed to use the parser preview.",
        "Nothing is stored or sent from this in-page demonstration.",
        "A quick way to turn one trade sentence into fields you can check.",
      ]}
    />
  );
}
