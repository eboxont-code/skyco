import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/PageShell";
import { shareMeta } from "@/lib/seo";
import { fallbackDirectory } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

const PATH = "/guides/budgeting-in-australia-for-new-arrivals";
const URL = `https://skyco.online${PATH}`;
const TITLE = "Budgeting in Australia for New Arrivals: A Guide";
const DESCRIPTION = "A plain guide to budgeting on fortnightly pay in Australia, for students and workers from Nepal and South Asia. Free tools included.";
const HEADING = "Budgeting in Australia when you are new here";
const FAQ = [
  { q: "Should I budget weekly or fortnightly?", a: "Match your pay. If you are paid fortnightly, budget fortnightly." },
  { q: "What should I pay first each payday?", a: "Rent and any bill with a fixed due date, then set aside money for the next ones. Spend what is left." },
  { q: "Is buy now pay later a good idea when I am new?", a: "It can help with a one off cost, but several plans at once can take a big share of each pay. Add them to your budget before you agree." },
  { q: "Where can I check the rate before sending money home?", a: "CurrenSee shows today's reference rate for AUD to NPR and AUD to INR. Your provider's rate and fees decide what actually arrives." },
];
const organization = { "@type": "Organization", name: "SkyCo", url: "https://skyco.online" };

export const Route = createFileRoute("/guides/budgeting-in-australia-for-new-arrivals")({
  loader: () => getProjectDirectory().catch(() => fallbackDirectory),
  head: () => ({
    meta: [{ title: TITLE }, { name: "description", content: DESCRIPTION }, { property: "og:title", content: TITLE }, { property: "og:description", content: DESCRIPTION }, { property: "og:type", content: "article" }, { property: "og:url", content: URL }, ...shareMeta("float", HEADING), { name: "twitter:card", content: "summary_large_image" }],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: HEADING, description: DESCRIPTION, datePublished: "2026-10-19", dateModified: "2026-10-19", author: organization, publisher: organization, image: "https://skyco.online/og/float.jpg", mainEntityOfPage: URL }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://skyco.online" }, { "@type": "ListItem", position: 2, name: "Guides" }, { "@type": "ListItem", position: 3, name: "Budgeting in Australia", item: URL }] }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) },
    ],
  }),
  component: Guide,
});

function Guide() {
  return <PageShell eyebrow="Guides" title={HEADING} crumb="Budgeting in Australia" directory={Route.useLoaderData()}><Prose>
    <p>Last updated <time dateTime="2026-10-19">19 October 2026</time>.</p>
    <p>Moving to Australia brings a new pay rhythm, new bills and new ways to pay. This guide covers the basics so your first few months feel less tight.</p>
    <section><h2>Pay cycles</h2><p>Many jobs here pay weekly or fortnightly. Plan from payday to payday, not by calendar month. <Link to="/float/$slug" params={{ slug: "pay-cycle-budgeting" }}>Plan your pay cycle</Link>.</p></section>
    <section><h2>Rent and bond</h2><p>Landlords often ask for rent in advance and a bond before you move in. Ask for the exact amounts in writing and set them aside first.</p></section>
    <section><h2>Regular bills</h2><p>Phone, internet, power and transport each come on their own schedule. Turn them into a per pay amount. <Link to="/float/$slug" params={{ slug: "monthly-bills-to-weekly" }}>Convert monthly bills</Link>.</p></section>
    <section><h2>Buy now pay later</h2><p>Pay in 4 plans are easy to start and easy to stack. Count every instalment against the pay it falls in. <Link to="/float/$slug" params={{ slug: "afterpay-budget-calculator" }}>Check your instalments</Link>.</p></section>
    <section><h2>Sending money home</h2><p>Check today's reference rate before you send, then compare what each service says will arrive.</p><p><Link to="/currensee/$pair" params={{ pair: "aud-to-npr" }}>AUD to NPR</Link> · <Link to="/currensee/$pair" params={{ pair: "aud-to-inr" }}>AUD to INR</Link> · <Link to="/guides/sending-money-to-nepal-from-australia">Sending money to Nepal</Link></p></section>
    <section><h2>Try Float</h2><p><Link to="/float">Plan your next pay in Float</Link>.</p></section>
    <section><h2>Questions</h2>{FAQ.map(f => <details key={f.q}><summary className="min-h-11 py-3">{f.q}</summary><p>{f.a}</p></details>)}</section>
  </Prose></PageShell>;
}