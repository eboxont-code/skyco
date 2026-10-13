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
const FAQS: [string, string][] = [
  ["Do I need an account to use Float?", "No. Float works without an account. Guest mode keeps your numbers in this browser only."],
  ["Does Float connect to my bank or Afterpay?", "No. Float never asks for bank or BNPL logins. You type in your pay, bills and instalments yourself."],
  ["How is the spend number worked out?", "Float adds the pay landing in the chosen week, fortnight or month, then takes away the bills and BNPL instalments due in that same window."],
];
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
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }),
      },
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
      after={
        <section aria-labelledby="float-faq-heading" className="mx-auto max-w-4xl px-6 pb-12">
          <h2 id="float-faq-heading" className="text-2xl font-extrabold tracking-tight text-foreground">Questions about Float</h2>
          <div className="mt-4 space-y-2">
            {FAQS.map(([q, a], i) => (
              <details key={q} id={`float-faq-${i + 1}`} className="rounded-lg border border-sky-bright/15 px-4 py-3">
                <summary className="min-h-11 cursor-pointer break-words py-2 text-sm font-semibold text-foreground">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>
      }
    />
  );
}
