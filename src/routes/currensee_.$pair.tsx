import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { CurrenSeeConverter } from "@/components/experiences/CurrenSeeConverter";
import { breadcrumbScript, shareMeta } from "@/lib/seo";
import { pairBySlug, relatedPairs, type CurrencyPair } from "@/lib/currency-pairs";
import { CURRENCY_NAMES, getRate, type RateResult } from "@/lib/rates.functions";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const AMOUNTS = [1, 5, 10, 50, 100, 500, 1000];

export const RATE_NOTE =
  "Rates on this page are mid-market reference rates and may lag the live market by a day or more. They are not a quote from a bank or remittance provider, and the amount you receive will usually be lower once fees and the provider's own rate are applied.";

function fmt(n: number) {
  const digits = n !== 0 && Math.abs(n) < 0.01 ? 6 : n !== 0 && Math.abs(n) < 1 ? 4 : 2;
  return new Intl.NumberFormat("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: digits }).format(n);
}

function faqs(pair: CurrencyPair, rate: RateResult | null): { id: string; q: string; a: string }[] {
  const { from, to } = pair;
  const list: { id: string; q: string; a: string }[] = [];
  if (rate) {
    list.push({
      id: "rate-today",
      q: `How much is 1 ${from} in ${to} today?`,
      a: `1 ${from} is about ${fmt(rate.rate)} ${to} based on the ${rate.source} reference rate for ${rate.asOf}. Banks and transfer services usually give you less than this.`,
    });
  }
  list.push(
    { id: "rate-different", q: "Why is the rate I am offered different?", a: "Banks and transfer services start from the mid-market rate, then add their own margin and fees, so the rate they offer is usually lower." },
    { id: "rate-updates", q: "How often does this rate update?", a: "Frankfurter publishes reference rates on working days, Nepal Rastra Bank publishes once a day and CoinGecko is near live. This page checks again within a few minutes." },
  );
  if (from === "NPR" || to === "NPR") {
    list.push({ id: "npr-peg", q: "Is the Nepalese rupee pegged?", a: "Yes. The Nepalese rupee is pegged to the Indian rupee at 1 INR = 1.6 NPR." });
  }
  return list;
}

export const Route = createFileRoute("/currensee_/$pair")({
  loader: async ({ params }) => {
    const pair = pairBySlug(params.pair);
    if (!pair) throw notFound();
    const [rate, directory] = await Promise.all([
      getRate({ data: { from: pair.from, to: pair.to } }).catch(() => null),
      getProjectDirectory().catch(() => fallbackDirectory as ResolvedProject[]),
    ]);
    return { pair, rate, directory };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Unavailable | CurrenSee" }, { name: "robots", content: "noindex" }] };
    const { pair, rate } = loaderData;
    const { from, to, slug } = pair;
    const title = `${from} to ${to} today: live rate and converter | CurrenSee`;
    const description = `Convert ${from} (${CURRENCY_NAMES[from]}) to ${to} (${CURRENCY_NAMES[to]}) with today's reference rate, a quick reference table both ways and a 30 day chart. Free, no account.`.slice(0, 159);
    const url = `https://skyco.online/currensee/${slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...shareMeta("currensee", `CurrenSee ${from} to ${to} converter`),
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbScript([
          { name: "Products", path: "/#tools" },
          { name: "CurrenSee", path: "/currensee" },
          { name: `${from} to ${to}`, path: `/currensee/${slug}` },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs(pair, rate).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        },
      ],
    };
  },
  component: PairPage,
});

function RefTable({ from, to, rate }: { from: string; to: string; rate: number }) {
  return (
    <table className="w-full min-w-0 text-sm">
      <caption className="mb-2 text-left font-semibold text-foreground">{from} to {to}</caption>
      <thead>
        <tr className="border-b border-sky-bright/20 text-left text-muted-foreground">
          <th scope="col" className="py-2 font-medium">{from}</th>
          <th scope="col" className="py-2 text-right font-medium">{to}</th>
        </tr>
      </thead>
      <tbody>
        {AMOUNTS.map((a) => (
          <tr key={a} className="border-b border-sky-bright/10">
            <td className="py-2 tabular-nums">{fmt(a)}</td>
            <td className="py-2 text-right tabular-nums">{fmt(a * rate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PairPage() {
  const { pair, rate, directory } = Route.useLoaderData();
  const { from, to } = pair;
  const list = faqs(pair, rate);
  const card = "rounded-2xl border border-sky-bright/20 bg-card p-4 sm:p-5";
  return (
    <PageShell eyebrow="CurrenSee" title={`${from} to ${to} today`} directory={directory}>
      <div className="space-y-8">
        <section aria-label="Today's rate" className={card}>
          {rate ? (
            <>
              <p className="break-words text-2xl font-extrabold tabular-nums text-foreground">1 {from} = {fmt(rate.rate)} {to}</p>
              <p className="mt-1 text-sm text-muted-foreground">Reference rate for {rate.asOf}. Source: {rate.source}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Today's rate is unavailable right now. Please try again in a few minutes.</p>
          )}
        </section>

        <CurrenSeeConverter initialFrom={from} initialTo={to} />

        {rate && (
          <section aria-labelledby="ref-heading">
            <h2 id="ref-heading" className="text-2xl font-extrabold tracking-tight text-foreground">Quick reference</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className={card}><RefTable from={from} to={to} rate={rate.rate} /></div>
              <div className={card}><RefTable from={to} to={from} rate={1 / rate.rate} /></div>
            </div>
          </section>
        )}

        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="text-2xl font-extrabold tracking-tight text-foreground">About this rate</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pair.explanation}</p>
        </section>

        <section aria-labelledby="pair-faq-heading">
          <h2 id="pair-faq-heading" className="text-2xl font-extrabold tracking-tight text-foreground">Questions about {from} to {to}</h2>
          <div className="mt-4 space-y-2">
            {list.map((f) => (
              <details key={f.id} id={`faq-${f.id}`} className="rounded-lg border border-sky-bright/15 px-4 py-3">
                <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-foreground">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <nav aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-extrabold tracking-tight text-foreground">Related conversions</h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {relatedPairs(pair).map((p) => (
              <li key={p.slug}>
                <Link to="/currensee/$pair" params={{ pair: p.slug }} className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">
                  {p.from} to {p.to}
                </Link>
              </li>
            ))}
            <li><Link to="/currensee" className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">All currencies in CurrenSee</Link></li>
          </ul>
        </nav>

        <p className="rounded-xl border border-sky-bright/25 p-4 text-xs leading-relaxed text-muted-foreground">{RATE_NOTE}</p>
      </div>
    </PageShell>
  );
}

