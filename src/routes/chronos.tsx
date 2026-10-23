import { breadcrumbScript, productAppScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/ProductPage";
import { ChronosCalendars } from "@/components/experiences/ChronosCalendars";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "Chronos date converter: Gregorian, Nepali, Hijri and more | SkyCo";
const DESCRIPTION =
  "Date converter: Gregorian, Nepali (Bikram Sambat), Hijri, Hebrew, Chinese, Persian and Indian Saka. Read one date in seven calendars, free with no account.";

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
      experience={<><ChronosCalendars initialDate={Route.useSearch().date} /><section className="mt-8" aria-labelledby="about-calendars"><h2 id="about-calendars" className="text-xl font-bold text-foreground">About the seven calendars</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground"><li>Gregorian: the solar calendar used for most civil dates worldwide.</li><li>Nepali (Bikram Sambat): Nepal's calendar, with a native-script reading where conversion data is available.</li><li>Hijri: the lunar Islamic calendar, using your browser's Umm al-Qura calculation.</li><li>Hebrew: a calendar of lunar months with leap months to stay aligned with the solar year.</li><li>Chinese: a lunisolar calendar with lunar months and occasional leap months.</li><li>Persian: a solar calendar whose year begins around the March equinox.</li><li>Indian Saka: India's national civil calendar, not a general Hindu religious calendar.</li></ul><p className="mt-2 text-xs text-muted-foreground">Readings use browser calendar data and the Nepali date converter. Monthly observances are reference dates; local moon sightings and panchang readings can differ by a day.</p></section><section className="mt-8" aria-labelledby="how-it-works"><h2 id="how-it-works" className="text-xl font-bold text-foreground">How it works</h2><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground"><li>Pick a date, or use Previous day, Next day or Today.</li><li>Read the same day in seven calendar systems.</li><li>Copy the readings or compare two dates.</li></ol></section></>}
      experienceTitle="Read one date in seven calendars"
      intro="Read one date in seven calendar systems."
      headline="Read the same day as Gregorian, Nepali (Bikram Sambat), Hijri, Hebrew, Chinese, Persian and Indian Saka."
      points={[
        "Seven calendar systems lined up against the same date.",
        "Pick any date, or jump back to today with one tap.",
        "Each system named clearly, so you know which reading is which.",

        "Useful when one date needs to be understood across different calendar systems.",
        "Works the same on a phone browser as it does on a laptop.",
        "No account, no install, nothing to configure first.",
      ]}
    />
  );
}
