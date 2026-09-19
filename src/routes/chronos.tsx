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
          name: "Chronos",
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web browser",
          url: URL,
          description: DESCRIPTION,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online" },
        }),
      },
    ],
  }),
  component: ChronosPage,
});

function ChronosPage() {
  return (
    <ProductPage
      slug="chronos"
      directory={Route.useLoaderData()}
      experience={<ChronosCalendars />}
      experienceTitle="Read one date in six calendars"
      headline="Tap one day and read it back as Gregorian, Hijri, Hebrew, Chinese, Persian and Indian Saka. About ten seconds, no conversion tables."
      points={[
        "Six calendar systems lined up against the same date.",
        "Pick any date, or jump back to today with one tap.",
        "Each system named clearly, so you know which reading is which.",

        "Useful for family events, religious dates and cross-border scheduling.",
        "Works the same on a phone browser as it does on a laptop.",
        "No account, no install, nothing to configure first.",
      ]}
    />
  );
}
