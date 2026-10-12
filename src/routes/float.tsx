import { createFileRoute } from "@tanstack/react-router";
import { breadcrumbScript, productAppScript } from "@/lib/seo";
import { ProductPage } from "@/components/ProductPage";
import { FloatPlanner } from "@/components/float/FloatPlanner";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "Float | What you can spend this week after bills and BNPL";
const DESCRIPTION =
  "Add your pay, bills and Afterpay or BNPL instalments and Float shows what is left to spend this week, fortnight or month in AUD. Free, no account.";
const URL = "https://skyco.online/float";
const IMAGE = "https://skyco.online/og/home.jpg";

export const Route = createFileRoute("/float")({
  validateSearch: (search: Record<string, unknown>): { d?: string } => (typeof search.d === "string" && search.d ? { d: search.d } : {}),
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
      { property: "og:image", content: IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Float on skyco.online" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: IMAGE },
      { name: "twitter:image:alt", content: "Float on skyco.online" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      breadcrumbScript([{ name: "Products", path: "/#tools" }, { name: "Float", path: "/float" }]),
      productAppScript("Float", "/float", DESCRIPTION, "FinanceApplication"),
    ],
  }),
  component: FloatPage,
});

function FloatPage() {
  return (
    <ProductPage
      slug="float"
      directory={Route.useLoaderData()}
      experience={<FloatPlanner shared={Route.useSearch().d} />}
      experienceTitle="Work out what you can spend this week"
      intro="Add your pay, bills and BNPL instalments and see what is left."
      headline="Pay in, bills and Afterpay or BNPL instalments out, and one clear number for what is left to spend."
      points={[
        "One number in Australian dollars: pay in, minus bills and BNPL due.",
        "Switch between this week, the fortnight and the month.",
        "Weekly, fortnightly and monthly repeats land on the right dates.",
        "Deal end dates flag a bill or plan whose price may change within 7 days.",
        "Share your numbers as a link, with no account.",
        "Guest mode keeps your numbers in this browser only.",
      ]}
    />
  );
}
