import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/PageShell";
import { breadcrumbScript, pageScript, shareMeta } from "@/lib/seo";
import { fallbackDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const PATH = "/guides/sending-money-to-nepal-from-australia";
const TITLE = "Sending money to Nepal from Australia: a plain guide | SkyCo";
const DESCRIPTION =
  "What to check before you send Australian dollars to Nepal: the real rate, fees on both ends, how the money arrives and the details you need.";
const URL = `https://skyco.online${PATH}`;

export const Route = createFileRoute("/guides/sending-money-to-nepal-from-australia")({
  loader: async (): Promise<ResolvedProject[]> => getProjectDirectory().catch(() => fallbackDirectory),
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
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: "Sending money to Nepal from Australia", description: DESCRIPTION, mainEntityOfPage: URL, dateModified: "2026-10-15", author: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online" }, publisher: { "@type": "Organization", name: "SkyCo", url: "https://skyco.online" }, image: "https://skyco.online/og/guide-nepal.jpg" }) },
      breadcrumbScript([{ name: "Sending money to Nepal from Australia", path: PATH }]),
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <PageShell eyebrow="Guide" title="Sending money to Nepal from Australia" directory={Route.useLoaderData()}>
      <Prose>
        <p>Updated <time dateTime="2026-10-15">15 October 2026</time>.</p>
        <section>
          <h2>Compare the rupees received, not the fee alone</h2>
          <p>A low or zero fee can hide a weaker exchange rate. Ask each service how many Nepalese rupees will arrive for the same amount of Australian dollars, and compare that final number.</p>
        </section>
        <section>
          <h2>Check the offered rate against today's reference rate</h2>
          <p>Look up today's reference rate on <Link to="/currensee/$pair" params={{ pair: "aud-to-npr" }}>AUD to NPR</Link> before you send. This is the midpoint of Nepal Rastra Bank's published buy and sell rates, adjusted for the currency unit, not a transfer quote. The difference from a provider's quote does not show its profit or the full cost by itself. The <Link to="/currensee/rates">full list of NPR rates today</Link> shows the published buy, sell and midpoint values.</p>
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
      </Prose>
    </PageShell>
  );
}
