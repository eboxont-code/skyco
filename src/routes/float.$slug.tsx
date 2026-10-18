import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { FloatPlanner } from "@/components/float/FloatPlanner";
import { breadcrumbScript } from "@/lib/seo";
import { FLOAT_PAGES, floatPageBySlug } from "@/lib/float-pages";
import { formatAud } from "@/lib/float";

const IMAGE = "https://skyco.online/og/float.jpg";
const NOT_AFFILIATED = "Not affiliated with Afterpay or any buy now pay later provider.";

export const Route = createFileRoute("/float/$slug")({
  loader: ({ params }) => {
    const page = floatPageBySlug(params.slug);
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Unavailable | Float" }, { name: "robots", content: "noindex" }] };
    const url = `https://skyco.online/float/${loaderData.slug}`;
    return {
      meta: [
        { title: loaderData.title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.title },
        { name: "twitter:description", content: loaderData.description },
        { name: "twitter:image", content: IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        breadcrumbScript([
          { name: "Products", path: "/#tools" },
          { name: "Float", path: "/float" },
          { name: loaderData.h1, path: `/float/${loaderData.slug}` },
        ]),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        },
      ],
    };
  },
  component: FloatSlugPage,
});

function SplitTool() {
  const [pay, setPay] = useState("");
  const [cycle, setCycle] = useState("Fortnightly");
  const amount = Number(pay);
  const valid = /^\d+(?:\.\d{1,2})?$/.test(pay) && amount > 0;
  return (
    <div className="rounded-2xl border border-sky-bright/20 bg-card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="split-pay" className="text-xs font-semibold text-foreground">Take home pay (AUD)</label>
          <input id="split-pay" inputMode="decimal" value={pay} onChange={(e) => setPay(e.target.value)} placeholder="1500" className="mt-1 block h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div>
          <label htmlFor="split-cycle" className="text-xs font-semibold text-foreground">Pay cycle</label>
          <select id="split-cycle" value={cycle} onChange={(e) => setCycle(e.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring">
            <option>Weekly</option><option>Fortnightly</option><option>Monthly</option>
          </select>
        </div>
      </div>
      <dl className="mt-4 space-y-2" aria-live="polite">
        {[["Needs 50%", 0.5], ["Wants 30%", 0.3], ["Savings 20%", 0.2]].map(([label, share]) => (
          <div key={label as string} className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">{label} per {String(cycle).toLowerCase()} pay</dt>
            <dd className="font-semibold tabular-nums text-foreground">{valid ? formatAud(amount * (share as number)) : "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ConvertTool() {
  const [amount, setAmount] = useState("");
  const [freq, setFreq] = useState("Monthly");
  const value = Number(amount);
  const valid = /^\d+(?:\.\d{1,2})?$/.test(amount) && value > 0;
  const perYear: Record<string, number> = { Weekly: 52, Fortnightly: 26, Monthly: 12, Quarterly: 4, Yearly: 1 };
  const yearly = valid ? value * perYear[freq] : 0;
  const rows: [string, number][] = [["Per week", yearly / 52], ["Per fortnight", yearly / 26], ["Per month", yearly / 12], ["Per year", yearly]];
  return (
    <div className="rounded-2xl border border-sky-bright/20 bg-card p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="conv-amount" className="text-xs font-semibold text-foreground">Bill amount (AUD)</label>
          <input id="conv-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="79" className="mt-1 block h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div>
          <label htmlFor="conv-freq" className="text-xs font-semibold text-foreground">How often</label>
          <select id="conv-freq" value={freq} onChange={(e) => setFreq(e.target.value)} className="mt-1 block h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring">
            {Object.keys(perYear).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
      </div>
      <dl className="mt-4 space-y-2" aria-live="polite">
        {rows.map(([label, v]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold tabular-nums text-foreground">{valid ? formatAud(v) : "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function FloatSlugPage() {
  const page = Route.useLoaderData();
  const links = page.related.flatMap((r) => {
    if (r.startsWith("/")) return [{ to: r, label: r === "/float" ? "Float" : r }];
    const target = floatPageBySlug(r);
    return target ? [{ to: `/float/${target.slug}`, label: target.h1 }] : [];
  });
  return (
    <PageShell eyebrow="Float" title={page.h1} parent={{ label: "Float", to: "/float" }} crumb={page.h1}>
      <div className="space-y-8">
        <p className="text-sm leading-relaxed text-muted-foreground">{page.intro}</p>
        {page.tool === "split" && <SplitTool />}
        {page.tool === "convert" && <ConvertTool />}
        <FloatPlanner key={page.slug} initialPeriod={page.period} bnplFirst={page.bnplFirst} showCommitted={page.committed} />
        {page.sections.map((s) => (
          <section key={s.heading} aria-labelledby={`sec-${s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
            <h2 id={`sec-${s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="text-2xl font-extrabold tracking-tight text-foreground">{s.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
        {page.tool === "convert" && (
          <p className="text-sm text-muted-foreground">
            Add the bill to <Link to="/float" className="font-semibold text-sky-deep underline underline-offset-2">Float</Link> to see it on its real due date.
          </p>
        )}
        <section aria-labelledby="float-page-faq">
          <h2 id="float-page-faq" className="text-2xl font-extrabold tracking-tight text-foreground">Questions</h2>
          <div className="mt-4 space-y-2">
            {page.faqs.map((f, i) => (
              <details key={f.q} id={`faq-${page.slug}-${i + 1}`} className="rounded-lg border border-sky-bright/15 px-4 py-3">
                <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-foreground">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <nav aria-labelledby="float-related">
          <h2 id="float-related" className="text-2xl font-extrabold tracking-tight text-foreground">Related</h2>
          <ul className="mt-4 space-y-1">
            {links.map((l) => (
              <li key={l.to}>
                {l.to === "/float" ? (
                  <Link to="/float" className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">{l.label}</Link>
                ) : (
                  <Link to="/float/$slug" params={{ slug: l.to.replace("/float/", "") }} className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <p className="rounded-xl border border-sky-bright/25 p-4 text-xs leading-relaxed text-muted-foreground">{NOT_AFFILIATED}</p>
      </div>
    </PageShell>
  );
}
