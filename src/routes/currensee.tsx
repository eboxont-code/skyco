import { breadcrumbScript, productAppScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { CurrenSeeConverter } from "@/components/experiences/CurrenSeeConverter";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";
import { CURRENCIES } from "@/lib/rates.functions";

const TITLE = "CurrenSee | Live currency and crypto converter by SkyCo";
const DESCRIPTION =
  "Convert currencies and crypto with current reference rates and a 30 day chart. Free, no account, and usable directly on SkyCo.";
const URL = "https://skyco.online/currensee";

export const Route = createFileRoute("/currensee")({
  validateSearch: (search: Record<string, unknown>): { from?: string; to?: string; amount?: string } => ({
    from: typeof search.from === "string" && CURRENCIES.includes(search.from.toUpperCase()) ? search.from.toUpperCase() : undefined,
    to: typeof search.to === "string" && CURRENCIES.includes(search.to.toUpperCase()) ? search.to.toUpperCase() : undefined,
    amount: (typeof search.amount === "string" || typeof search.amount === "number") && String(search.amount).length <= 30 && /^\d+(?:\.\d+)?$/.test(String(search.amount)) && Number.isFinite(Number(search.amount)) && Number(search.amount) > 0 ? String(search.amount) : undefined,
  }),
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
      { property: "og:image", content: "https://skyco.online/og/currensee.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://skyco.online/og/currensee.jpg" },
      { property: "og:image:alt", content: "CurrenSee running on skyco.online" },
      { name: "twitter:image:alt", content: "CurrenSee running on skyco.online" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }, { rel: "preconnect", href: "https://api.frankfurter.dev" }, { rel: "preconnect", href: "https://api.coingecko.com" }],
    scripts: [
      breadcrumbScript([{ name: "Products", path: "/#tools" }, { name: "CurrenSee", path: "/currensee" }]),
      productAppScript("CurrenSee", "/currensee", DESCRIPTION, "FinanceApplication"),
    ],
  }),
  component: CurrenSeePage,
});

function CurrenSeePage() {
  const { from, to, amount } = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <ProductPage
      slug="currensee"
      directory={Route.useLoaderData()}
      experience={<><CurrenSeeConverter initialFrom={from} initialTo={to} initialAmount={amount} onConversionChange={values => { void navigate({ search: values, replace: true, resetScroll: false }); }} /><section className="mt-8" aria-labelledby="rate-method"><h2 id="rate-method" className="text-xl font-bold text-foreground">How the rate is worked out</h2><p className="mt-2 text-sm text-muted-foreground">Fiat rates come from Frankfurter. Crypto rates come from CoinGecko. Both are reference rates, not trading prices.</p></section></>}
      experienceTitle="Convert a pair right here"
      intro="Convert a currency or crypto amount using current reference rates."
      headline="Convert a currency or crypto pair here, check the current reference rate, and read its 30 day direction."
      points={[
        "Live fiat rates for the pairs people actually travel and shop with.",
        "Crypto alongside currencies, in the same view and the same units.",
        "A 30 day chart so you can see whether today is a good day to convert.",
        "A clear unavailable state instead of an old rate presented as current.",
        "A last updated stamp on every rate, so you know how fresh it is.",
        "No account, no install, no ads competing with the number you came for.",
      ]}
    />
  );
}
