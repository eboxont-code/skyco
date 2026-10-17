import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { breadcrumbScript, shareMeta } from "@/lib/seo";
import { PAIRS } from "@/lib/currency-pairs";
import { getNprRates, type NprRatesDay } from "@/lib/rates.functions";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const TITLE = "NPR exchange rates today: all currencies | CurrenSee";
const DESCRIPTION =
  "Today's Nepalese rupee reference rates from Nepal Rastra Bank for the US dollar, Australian dollar, Indian rupee, Gulf currencies and more, with links to each converter.";
const URL = "https://skyco.online/currensee/rates";
const NOTE =
  "Rates on this page are mid-market reference rates and may lag the live market by a day or more. They are not a quote from a bank or remittance provider, and the amount you receive will usually be lower once fees and the provider's own rate are applied.";

const fmt = (n: number) => new Intl.NumberFormat("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(n);

export const Route = createFileRoute("/currensee_/rates")({
  loader: async (): Promise<{ day: NprRatesDay; directory: ResolvedProject[] }> => {
    const [day, directory] = await Promise.all([
      getNprRates().catch(() => null),
      getProjectDirectory().catch(() => fallbackDirectory),
    ]);
    return { day, directory };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      ...shareMeta("currensee", "Nepalese rupee rates on CurrenSee"),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [breadcrumbScript([{ name: "CurrenSee", path: "/currensee" }, { name: "NPR rates today", path: "/currensee/rates" }])],
  }),
  component: RatesPage,
});

function RatesPage() {
  const { day, directory } = Route.useLoaderData();
  return (
    <PageShell eyebrow="CurrenSee" title="Nepalese rupee rates today" parent={{ label: "CurrenSee", to: "/currensee" }} crumb="NPR rates today" directory={directory}>
      <div className="space-y-6">
        {day ? (
          <>
            <div className="overflow-x-auto rounded-2xl border border-sky-bright/20 bg-card">
              <table className="w-full min-w-[560px] text-sm">
                <caption className="sr-only">Nepal Rastra Bank reference rates for {day.date}</caption>
                <thead>
                  <tr className="border-b border-sky-bright/20 text-left text-muted-foreground">
                    <th scope="col" className="p-3 font-medium">Currency</th>
                    <th scope="col" className="p-3 text-right font-medium">Unit</th>
                    <th scope="col" className="p-3 text-right font-medium">Buy</th>
                    <th scope="col" className="p-3 text-right font-medium">Sell</th>
                    <th scope="col" className="p-3 text-right font-medium">Midpoint</th>
                    <th scope="col" className="p-3 text-right font-medium">NPR per 1</th>
                  </tr>
                </thead>
                <tbody>
                  {day.rows.map((r) => {
                    const pair = PAIRS.find((p) => p.from === r.iso3 && p.to === "NPR");
                    return (
                      <tr key={r.iso3} className="border-b border-sky-bright/10">
                        <th scope="row" className="p-3 text-left font-semibold text-foreground">
                          {pair ? (
                            <Link to="/currensee/$pair" params={{ pair: pair.slug }} className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{r.iso3} {r.name}</Link>
                          ) : (
                            <span>{r.iso3} {r.name}</span>
                          )}
                        </th>
                        <td className="p-3 text-right tabular-nums">{r.unit}</td>
                        <td className="p-3 text-right tabular-nums">{fmt(r.buy)}</td>
                        <td className="p-3 text-right tabular-nums">{fmt(r.sell)}</td>
                        <td className="p-3 text-right tabular-nums">{fmt(r.midpoint)}</td>
                        <td className="p-3 text-right tabular-nums">{fmt(r.perOne)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground">Source: Nepal Rastra Bank, rates for {day.date}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Nepal Rastra Bank rates are unavailable right now. Please try again in a few minutes.</p>
        )}
        <p className="rounded-xl border border-sky-bright/25 p-4 text-xs leading-relaxed text-muted-foreground">{NOTE}</p>
        <section aria-labelledby="npr-conversions-heading">
          <h2 id="npr-conversions-heading" className="text-2xl font-bold text-foreground">Convert a currency to NPR</h2>
          <ul className="mt-3 grid grid-cols-1 gap-x-5 sm:grid-cols-2">{PAIRS.filter(pair => pair.to === "NPR").map(pair => <li key={pair.slug}><Link to="/currensee/$pair" params={{ pair: pair.slug }} className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">{pair.from} to NPR</Link></li>)}</ul>
        </section>
        <Link to="/currensee" className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Convert any amount in CurrenSee</Link>
      </div>
    </PageShell>
  );
}
