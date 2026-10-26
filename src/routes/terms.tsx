import { shareMeta, breadcrumbScript, pageScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, Callout } from "@/components/PageShell";

const UPDATED = "29 August 2026";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of use for SkyCo web tools" },
      {
        name: "description",
        content:
          "The terms that apply when you use skyco.online and SkyCo products, including data accuracy limits and financial disclaimers.",
      },
      { property: "og:title", content: "Terms of use for SkyCo web tools" },
      {
        property: "og:description",
        content: "The terms that apply when you use skyco.online and SkyCo products.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/terms" },
      ...shareMeta("terms", "SkyCo Terms page share card"),
      { name: "twitter:title", content: "Terms of use for SkyCo web tools" },
      { name: "twitter:description", content: "The terms that apply when you use skyco.online and SkyCo products." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/terms" }],
    scripts: [breadcrumbScript([{ name: "Terms", path: "/terms" }]), pageScript("WebPage", "SkyCo Terms", "/terms", "Terms page for SkyCo, a founder-led studio of small web tools.")],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Trust"
      title="Terms of Use"
      intro="Plain terms for a small studio. Use the products freely, but read the accuracy and financial notes before you rely on a number."
      updated={UPDATED}
    >
      <nav aria-label="On this page" className="mb-8"><p className="font-semibold text-foreground">On this page</p><ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2"><li><a href="#agreement" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Agreement</a></li><li><a href="#what-skyco-provides" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">What SkyCo provides</a></li><li><a href="#accuracy-of-data" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Accuracy of data</a></li><li><a href="#financial-disclaimer" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Financial disclaimer</a></li><li><a href="#acceptable-use" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Acceptable use</a></li><li><a href="#your-content" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Your content</a></li><li><a href="#intellectual-property" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Intellectual property</a></li><li><a href="#liability" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Liability</a></li><li><a href="#changes" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Changes</a></li><li><a href="#contact" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Contact</a></li></ul></nav>
      <Prose>
        <Callout title="Read this first">
          SkyCo products show information for general use. They are not financial, tax, legal,
          medical or religious advice, and figures can be delayed or wrong. Check an authoritative
          source before acting on anything that matters.
        </Callout>

        <h2 id="agreement" className="scroll-mt-24">Agreement</h2>
        <p>
          By using skyco.online or any SkyCo product you agree to these terms. If you do not agree,
          please do not use them.
        </p>

        <h2 id="what-skyco-provides" className="scroll-mt-24">What SkyCo provides</h2>
        <p>
          SkyCo publishes small web tools. They are provided free of charge, as they are, with no
          guarantee of availability. Features can change or be withdrawn.
        </p>

        <h2 id="accuracy-of-data" className="scroll-mt-24">Accuracy of data</h2>
        <ul>
          <li>
            Exchange rates, crypto prices and share prices come from third-party providers, can be
            delayed, and are indicative rather than dealable prices.
          </li>
          <li>
            Calendar conversions follow published calculation rules. Observance in
            practice varies by country and by community, in particular for lunar calendars where a
            local sighting or ruling decides the date.
          </li>
          <li>
            Nutrition, quantity and meal-plan suggestions in grocery content are general guidance,
            not dietary advice.
          </li>
        </ul>

        <h2 id="financial-disclaimer" className="scroll-mt-24">Financial disclaimer</h2>
        <p>
          My Finance Friend and CurrenSee are tracking and reference tools. SkyCo is not a broker,
          exchange, adviser or money transmitter, does not execute trades or transfers, does not
          connect to your bank or brokerage, and does not hold funds. Any decision you make with
          these numbers is your own.
        </p>

        <h2 id="acceptable-use" className="scroll-mt-24">Acceptable use</h2>
        <ul>
          <li>Do not attempt to break, overload or scrape the products at volume.</li>
          <li>Do not use them for anything unlawful or to harm others.</li>
          <li>Do not present SkyCo output as certified, official or professionally verified.</li>
        </ul>

        <h2 id="your-content" className="scroll-mt-24">Your content</h2>
        <p>
          What you enter stays yours. Giving SkyCo the text is only permission to process it so the
          product can do the job you asked for.
        </p>

        <h2 id="intellectual-property" className="scroll-mt-24">Intellectual property</h2>
        <p>
          The SkyCo name, the bird mark and the design of these sites belong to SkyCo. Product data
          supplied by third parties remains theirs.
        </p>

        <h2 id="liability" className="scroll-mt-24">Liability</h2>
        <p>
          To the extent the law allows, SkyCo is not liable for losses arising from use of these
          free tools, including losses from inaccurate, delayed or unavailable data. Nothing here
          excludes liability that cannot legally be excluded.
        </p>

        <h2 id="changes" className="scroll-mt-24">Changes</h2>
        <p>
          These terms can change. Material changes are noted on the{" "}
          <a href="/changelog">What&rsquo;s new</a> page and the updated date above changes.
        </p>

        <h2 id="contact" className="scroll-mt-24">Contact</h2>
        <p>
          Questions about these terms: <a href="mailto:support@skyco.online">support@skyco.online</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
