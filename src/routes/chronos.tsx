import { breadcrumbScript, productAppScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { ChronosCalendars } from "@/components/experiences/ChronosCalendars";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "Chronos | Gregorian, Hijri, Hebrew, Chinese, Persian and Indian Saka calendars";
const DESCRIPTION =
  "Pick one date and read it in six calendar systems at once. Free, no account, built for families and teams living across calendars.";

const URL = "https://skyco.online/chronos";

export const Route = createFileRoute("/chronos")({
  validateSearch: (search: Record<string, unknown>): { date?: string } => {
    const date = typeof search.date === "string" ? search.date : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(new Date(`${date}T12:00:00Z`).getTime()) && new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date ? { date } : {};
  },
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
      { property: "og:image", content: "https://skyco.online/og/chronos.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://skyco.online/og/chronos.jpg" },
      { property: "og:image:alt", content: "Chronos running on skyco.online" },
      { name: "twitter:image:alt", content: "Chronos running on skyco.online" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      breadcrumbScript([{ name: "Products", path: "/#tools" }, { name: "Chronos", path: "/chronos" }]),
      productAppScript("Chronos", "/chronos", DESCRIPTION, "UtilitiesApplication"),
    ],
  }),
  component: ChronosPage,
});

function ChronosPage() {
  return (
    <ProductPage
      slug="chronos"
      directory={Route.useLoaderData()}
      experience={<><ChronosCalendars initialDate={Route.useSearch().date} /><section className="mt-8" aria-labelledby="how-it-works"><h2 id="how-it-works" className="text-xl font-bold text-foreground">How it works</h2><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground"><li>Pick a date, or use Previous day, Next day or Today.</li><li>Read the same day in six calendar systems.</li><li>Copy the readings or compare two dates.</li></ol></section></>}
      experienceTitle="Read one date in six calendars"
      intro="Read one date in six calendar systems."
      headline="Tap one day and read it back as Gregorian, Hijri, Hebrew, Chinese, Persian and Indian Saka. About ten seconds, no conversion tables."
      points={[
        "Six calendar systems lined up against the same date.",
        "Pick any date, or jump back to today with one tap.",
        "Each system named clearly, so you know which reading is which.",

        "Useful when one date needs to be understood across different calendar systems.",
        "Works the same on a phone browser as it does on a laptop.",
        "No account, no install, nothing to configure first.",
      ]}
    />
  );
}
