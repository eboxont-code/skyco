import { shareMeta, breadcrumbScript, pageScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Bug, Lightbulb, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/PageShell";
import { SUPPORT_EMAIL } from "@/lib/site-nav";
import { ContactForm } from "@/components/ContactForm";
import { ProductFaqs } from "@/components/ProductFaqs";

export const Route = createFileRoute("/support")({
  validateSearch: (search: Record<string, unknown>): { product?: string } => ({ product: typeof search.product === "string" ? search.product : undefined }),
  head: () => ({
    meta: [
      { title: "Support and Contact | SkyCo" },
      {
        name: "description",
        content:
          "Get help with a SkyCo product, report a bug, request a feature or ask a privacy question. One inbox, answered by the person who built it.",
      },
      { property: "og:title", content: "Support and Contact | SkyCo" },
      {
        property: "og:description",
        content: "Get help with a SkyCo product, report a bug or ask a privacy question.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/support" },
      ...shareMeta("support", "SkyCo Support page share card"),
      { name: "twitter:title", content: "Support and Contact | SkyCo" },
      { name: "twitter:description", content: "Get help with a SkyCo product, report a bug or ask a privacy question." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/support" }],
    scripts: [breadcrumbScript([{ name: "Support", path: "/support" }]), pageScript("ContactPage", "SkyCo Support", "/support", "Support page for SkyCo, a founder-led studio of small web tools.")],
  }),
  component: SupportPage,
});

const routes = [
  {
    icon: Bug,
    title: "Something is broken",
    body: "Tell me the product, what you did, and what you saw. A screenshot and your browser help a lot.",
    subject: "Bug report",
  },
  {
    icon: Lightbulb,
    title: "Feature or product idea",
    body: "If a tool would save you a repeated chore, I want to hear it. Most SkyCo products started that way.",
    subject: "Feature idea",
  },
  {
    icon: ShieldCheck,
    title: "Privacy or security",
    body: "Ask what is stored, request deletion, or report a vulnerability with steps to reproduce.",
    subject: "Privacy or security question",
  },
  {
    icon: Mail,
    title: "Anything else",
    body: "General questions, partnerships, or a note about something that reads wrong on the site.",
    subject: "Hello SkyCo",
  },
];

function SupportPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="Get in touch"
      intro="One inbox, read by the person who builds these products. I aim to reply within two working days."
      wide
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {routes.map(({ icon: Icon, title, body, subject }) => (
          <a
            key={title}
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`}
            className="group rounded-2xl border border-sky-bright/20 bg-card p-6 transition-all hover:-translate-y-1 hover:border-sky-bright hover:shadow-glow-cyan"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-bright to-sky-azure text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <p className="mt-4 text-sm font-bold text-sky-deep">Email about this</p>
          </a>
        ))}
      </div>

      <ProductFaqs />
      <ContactForm key={Route.useSearch().product} initialProduct={Route.useSearch().product} />

      <div className="mt-10">
        <Prose>
          <h2>Direct email</h2>
          <p>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> reaches me for everything above.
            There is no ticket system and no chatbot in between.
          </p>

          <h2>Before you write</h2>
          <ul>
            <li>
              A product not loading may be a known outage. The{" "}
              <Link to="/status">Status page</Link> checks each product live.
            </li>
            <li>
              Common questions about accounts, data and accuracy are answered on the{" "}
              <Link to="/faq">FAQ</Link>.
            </li>
            <li>
              Recent releases and fixes are listed on <Link to="/changelog">What&rsquo;s new</Link>.
            </li>
          </ul>

          <h2>What I cannot help with</h2>
          <p>
            SkyCo cannot advise on investments, taxes or religious date observance. Products are
            reference tools, and the <Link to="/terms">Terms of Use</Link> explain the limits.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}
