import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | SkyCo" },
      {
        name: "description",
        content:
          "Answers about SkyCo accounts, pricing, data storage, accuracy of rates and calendar dates, and how the products relate to each other.",
      },
      { property: "og:title", content: "Frequently Asked Questions | SkyCo" },
      {
        property: "og:description",
        content: "Answers about SkyCo accounts, pricing, data storage and accuracy.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/faq" },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/faq" }],
  }),
  component: FaqPage,
});

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is SkyCo?",
    a: (
      <>
        A small software studio. I build focused web tools for jobs that come up in ordinary life:
        converting money, lining up calendars, tracking a portfolio, planning a shop. Each product
        does one job and runs in the browser.
      </>
    ),
  },
  {
    q: "Do the products cost anything?",
    a: <>No. Everything currently listed on SkyCo is free to open and use, with no trial and no card details.</>,
  },
  {
    q: "Do I need an account?",
    a: (
      <>
        Not for CurrenSee, Chronos or Grocery Packs. My Finance Friend has a guest mode, and an
        optional account if you want your portfolio to be there on another device. Details are in{" "}
        <Link to="/security">Security and data handling</Link>.
      </>
    ),
  },
  {
    q: "Where is my data stored?",
    a: (
      <>
        For products without accounts, in your own browser. For My Finance Friend with an account,
        with a managed hosting provider under access rules that keep rows tied to your account. See{" "}
        <Link to="/privacy">Privacy</Link>.
      </>
    ),
  },
  {
    q: "Does SkyCo connect to my bank or broker?",
    a: (
      <>
        No, and it never will without being an explicit, separately announced feature. SkyCo asks
        for no banking credentials, no card numbers, and cannot move money.
      </>
    ),
  },
  {
    q: "How accurate are the exchange rates and prices?",
    a: (
      <>
        They come from third-party market data providers and can be delayed. They are indicative
        reference prices, not dealable quotes, and should not be the only source for a transaction.
      </>
    ),
  },
  {
    q: "How accurate are the calendar conversions?",
    a: (
      <>
        Conversions follow published calculation rules for each calendar system. Real-world
        observance can differ, particularly for lunar calendars where a local sighting or ruling
        sets the date. Treat the result as a reference, not a religious ruling.
      </>
    ),
  },
  {
    q: "Why are some products on lovable.app addresses?",
    a: (
      <>
        Products move onto a SkyCo address as their domains are connected. In the meantime the link
        points at wherever the product genuinely lives, and every product is reachable from
        skyco.online through a clean path such as /finance-friend.
      </>
    ),
  },
  {
    q: "Is there an app to install?",
    a: (
      <>
        No. Everything runs in the browser on phone or desktop. You can add any product to your home
        screen from your browser menu if you want an icon.
      </>
    ),
  },
  {
    q: "Who builds SkyCo?",
    a: (
      <>
        SkyCo is a founder-led company, currently one person doing the design, build and support.
        More on the <Link to="/about">About page</Link>.
      </>
    ),
  },
  {
    q: "Can I request a tool?",
    a: (
      <>
        Yes. Email me through the <Link to="/support">Support page</Link>. Ideas that solve a
        repeated chore have the best chance of being built.
      </>
    ),
  },
  {
    q: "How do I know a product is up?",
    a: (
      <>
        The <Link to="/status">Status page</Link> checks each product when you load it and shows what
        is reachable right now.
      </>
    ),
  },
];

function FaqPage() {
  return (
    <PageShell
      eyebrow="Answers"
      title="Frequently asked questions"
      intro="The questions I get most, answered plainly. If yours is not here, email me and I will add it."
    >
      <dl className="divide-y divide-sky-bright/15 rounded-2xl border border-sky-bright/20 bg-card">
        {faqs.map(({ q, a }) => (
          <div key={q} className="p-6">
            <dt className="text-base font-bold text-foreground">{q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-sky-deep [&_a]:underline [&_a]:underline-offset-2">
              {a}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm text-muted-foreground">
        Still stuck?{" "}
        <Link to="/support" className="font-semibold text-sky-deep underline underline-offset-2">
          Get in touch
        </Link>
        .
      </p>
    </PageShell>
  );
}
