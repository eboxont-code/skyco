import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/PageShell";
import { breadcrumbScript, shareMeta } from "@/lib/seo";
import { fallbackDirectory } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";
import { getNprRates } from "@/lib/rates.functions";

const PATH = "/guides/sending-money-to-nepal-from-australia";
const TITLE = "Sending money to Nepal from Australia: a plain guide | SkyCo";
const DESCRIPTION =
  "What to check before you send Australian dollars to Nepal: the real rate, fees on both ends, how the money arrives and the details you need.";
const URL = `https://skyco.online${PATH}`;
const DATE_PUBLISHED = "2026-10-15";
const DATE_MODIFIED = "2026-10-24";
const LOGO = "https://skyco.online/icons/icon-192.png";

const FAQS: { id: string; q: string; a: string }[] = [
  {
    id: "how-long",
    q: "How long does a transfer to Nepal take?",
    a: "It depends on the service, the delivery method and the identity checks involved. Some transfers arrive the same day and others take several working days. Ask the service for its estimate before you pay, and keep the reference number until the money arrives.",
  },
  {
    id: "recipient-details",
    q: "What details does the recipient need?",
    a: "For a bank deposit, the account name, account number and bank branch exactly as the bank holds them. For cash pickup, a valid ID and the transfer reference number. For a mobile wallet, the mobile number registered with the wallet.",
  },
  {
    id: "reference-rate",
    q: "Is the reference rate the rate I will get?",
    a: "No. The reference rate is a midpoint published for information. Each service starts from a market rate, then adds its own margin and any fee, so the rate you are offered is usually lower.",
  },
  {
    id: "compare-services",
    q: "How do I compare two services fairly?",
    a: "Ask each service how many Nepalese rupees will arrive for the same total Australian dollar payment, with the same delivery method, quoted at the same time. The service that delivers more rupees is the cheaper one for that transfer, whatever the headline fee says.",
  },
];

export const Route = createFileRoute("/guides/sending-money-to-nepal-from-australia")({
  loader: async () => {
    const [directory, npr] = await Promise.all([
      getProjectDirectory().catch(() => fallbackDirectory),
      getNprRates().catch(() => null),
    ]);
    const aud = npr?.rows.find((r) => r.iso3 === "AUD") ?? null;
    return { directory, audRate: aud && npr ? { rate: aud.perOne, asOf: npr.date } : null };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      ...shareMeta("guide-nepal", "Sending money to Nepal from Australia"),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Sending money to Nepal from Australia",
          description: DESCRIPTION,
          mainEntityOfPage: URL,
          datePublished: DATE_PUBLISHED,
          dateModified: DATE_MODIFIED,
          author: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online", logo: LOGO },
          publisher: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online", logo: LOGO },
          image: "https://skyco.online/og/guide-nepal.jpg",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      breadcrumbScript([{ name: "Sending money to Nepal from Australia", path: PATH }]),
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { directory, audRate } = Route.useLoaderData();
  const worked = audRate ? audRate.rate * 500 : null;
  const fmtNpr = (n: number) =>
    new Intl.NumberFormat("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <PageShell eyebrow="Guide" title="Sending money to Nepal from Australia" directory={directory}>
      <Prose>
        <p>Last updated <time dateTime={DATE_MODIFIED}>24 October 2026</time>.</p>
        <section>
          <h2>Compare the rupees received, not the fee alone</h2>
          <p>A low or zero fee can hide a weaker exchange rate. Ask each service how many Nepalese rupees will arrive for the same amount of Australian dollars, and compare that final number.</p>
        </section>
        <section>
          <h2>Check the offered rate against today's reference rate</h2>
          <p>Look up today's reference rate on <Link to="/currensee/$pair" params={{ pair: "aud-to-npr" }}>AUD to NPR</Link> before you send. This is the midpoint of Nepal Rastra Bank's published buy and sell rates, adjusted for the currency unit, not a transfer quote. The difference from a provider's quote does not show its profit or the full cost by itself. The <Link to="/currensee/rates">full list of NPR rates today</Link> shows the published buy, sell and midpoint values.</p>
        </section>
        <section>
          <h2>Ways the money can arrive</h2>
          <ul>
            <li><strong>Bank deposit.</strong> The money lands in the recipient's Nepali bank account. The recipient needs an account and you need the account name, number and branch exactly as the bank holds them.</li>
            <li><strong>Cash pickup.</strong> The recipient collects cash from an agent location. They need a valid ID and the transfer reference number, and pickup points keep their own hours.</li>
            <li><strong>Mobile wallet.</strong> The money arrives in a wallet on the recipient's phone. The recipient needs a wallet registered to their mobile number.</li>
          </ul>
        </section>
        <section>
          <h2>How long it usually takes</h2>
          <p>It depends on the service, the delivery method and the checks involved. Identity verification, weekends and bank holidays in either country can all add time. Ask the service for its estimate before you pay rather than relying on a general promise, and keep the reference number until the money has arrived.</p>
        </section>
        <section>
          <h2>A worked example</h2>
          {audRate && worked !== null ? (
            <p>
              At the Nepal Rastra Bank reference rate for <time dateTime={audRate.asOf}>{audRate.asOf}</time>,
              1 AUD is about {fmtNpr(audRate.rate)} NPR, so 500 AUD works out to about {fmtNpr(worked)} NPR
              before any fees or margins. The amount that actually arrives will usually be lower once the
              service applies its own rate and charges.
            </p>
          ) : (
            <p>
              Today's reference rate is not available here right now. Check the current figure on the{" "}
              <Link to="/currensee/$pair" params={{ pair: "aud-to-npr" }}>AUD to NPR page</Link> and multiply
              it by the amount you plan to send to see the reference value before fees and margins.
            </p>
          )}
        </section>
        <section>
          <h2>Ask what both ends charge and how the money arrives</h2>
          <p>Some services charge when you send and the receiving bank or agent may charge again. Ask how the money is received: a bank deposit, cash pickup or a mobile wallet. Each can come with different costs and limits.</p>
        </section>
        <section>
          <h2>Get the recipient's details exactly right</h2>
          <p>Use the recipient's name and account details exactly as their bank holds them. A small spelling difference can delay the transfer or send it back.</p>
        </section>
        <section>
          <h2>Expect identity checks and keep your receipts</h2>
          <p>Licensed services are required to verify who you are, so have your ID ready. Keep every receipt and reference number until the money has arrived.</p>
        </section>
        <section>
          <h2>Compare quotes on the same basis</h2>
          <p>Use the same total AUD payment, delivery method and quote time. Confirm the final NPR received, any receiving charges and the expected arrival date before accepting. Check the reference date too: a daily bank reference can lag the current market.</p>
        </section>
        <section aria-labelledby="guide-questions">
          <h2 id="guide-questions">Questions</h2>
          <dl className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.id} id={`faq-${f.id}`} className="scroll-mt-24">
                <dt className="font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Prose>
    </PageShell>
  );
}
