import { changelog, formatDate } from "@/lib/changelog";
import { shareMeta, breadcrumbScript, pageScript } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/PageShell";
import { fallbackDirectory, splitDirectory, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";
import { useState } from "react";
import { getRate } from "@/lib/rates.functions";

export const Route = createFileRoute("/status")({
  loader: async (): Promise<ResolvedProject[]> => {
    try {
      return await getProjectDirectory();
    } catch {
      return fallbackDirectory;
    }
  },
  head: () => ({
    meta: [
      { title: "SkyCo product status: published and planned tools" },
      {
        name: "description",
        content:
          "See which SkyCo tools have a published route and which are planned. Published status is not continuous uptime monitoring.",
      },
      { property: "og:title", content: "SkyCo product status: published and planned tools" },
      {
        property: "og:description",
        content: "See which SkyCo tools have a published route and which are planned. Published status is not continuous uptime monitoring.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/status" },
      ...shareMeta("status", "SkyCo Status page share card"),
      { name: "twitter:title", content: "SkyCo product status: published and planned tools" },
      { name: "twitter:description", content: "See which SkyCo tools have a published route and which are planned. Published status is not continuous uptime monitoring." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/status" }],
    scripts: [breadcrumbScript([{ name: "Status", path: "/status" }]), pageScript("WebPage", "SkyCo Status", "/status", "Published and planned SkyCo product routes; published status is not continuous uptime monitoring.")],
  }),
  component: StatusPage,
});

function StatusPage() {
  const directory = Route.useLoaderData();
  const { live, upcoming } = splitDirectory(directory);
  const hasPublishedProducts = live.length > 0;

  return (
    <PageShell
      eyebrow="Status"
      title="Product status"
      intro="This page shows which products have a published route on the SkyCo hub and which are still planned. Published status is not a continuous uptime check."
      wide
    >
      {changelog[0] && <p className="mb-4 text-sm text-muted-foreground">Last updated <time dateTime={changelog[0].date}>{formatDate(changelog[0].date)}</time></p>}
      <div
        className={`rounded-2xl border p-5 ${
          hasPublishedProducts ? "border-sky-bright/30 bg-sky-ice/50" : "border-destructive/30 bg-destructive/5"
        }`}
      >
        <p className="text-sm font-bold text-foreground">
          {live.length} of {directory.length} listed products are published now.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Products still in build are listed as planned rather than down.
        </p>
      </div>

      <RateCheck />
      <ul className="mt-6 space-y-3">
        {live.map((project) => (
          <li
            key={project.slug}
            className="flex flex-col gap-3 rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${
                    project.live ? "bg-emerald-500" : "bg-muted-foreground/40"
                  }`}
                />
                <h2 className="text-base font-bold text-foreground">{project.name}</h2>
                <span className="rounded-full bg-sky-ice px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-deep">
                  {project.live ? "Published" : "Planned"}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{project.tagline}</p>
              <p className="mt-1 text-sm text-muted-foreground">Data sources: {project.dataSources?.length ? project.dataSources.join(" and ") : "None, runs in your browser"}.</p>
            </div>

            {project.path && (
              <Link
                to={project.path}
                className="inline-flex min-h-11 w-fit items-center rounded-full border-2 border-sky-deep/20 px-4 py-2 text-xs font-bold text-sky-deep transition-colors hover:border-sky-bright hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Use {project.name}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {upcoming.length > 0 && (
        <section className="mt-10" aria-labelledby="planned-products-heading">
          <h2 id="planned-products-heading" className="text-xl font-bold text-foreground">
            Planned — not live yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These products are not available yet and do not have a published route.
          </p>
          <ul className="mt-4 space-y-3">
            {upcoming.map((project) => (
              <li
                key={project.slug}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground">{project.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
                </div>
                <span className="w-fit rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Planned — not live yet
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10">
        <Prose>
          <h2>What this status means</h2>
          <p>
            Published means the product has a working route on this hub. It is not continuous uptime
            monitoring. If a feature is not working for you, report exactly what you saw.
          </p>
          <h2>What each product depends on</h2>
          <ul>
            {live.map(p => <li key={p.slug}>{p.name}: {p.dataSources?.length ? p.dataSources.join(" and ") : "None, runs in your browser"}.</li>)}
          </ul>
          <p>I do not publish uptime percentages because I do not run continuous monitoring.</p>
          <h2>Seeing something this page does not?</h2>
          <p>
            If a product is marked published but is broken for you, that is worth an email. Tell me
            the product, your browser and what you saw on the{" "}
            <a href="/support">Support page</a>.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}

function RateCheck() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const check = async () => {
    setBusy(true);
    setMessage("Checking USD to EUR...");
    try {
      const result = await getRate({ data: { from: "USD", to: "EUR" } });
      setMessage(`Rates are answering: 1 USD = ${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 4 }).format(result.rate)} EUR from ${result.source}, reference date ${result.asOf}.`);
    } catch {
      setMessage("The rate check did not get an answer just now. Try again in a minute.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mt-6 rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <button type="button" onClick={check} disabled={busy} className="min-h-11 rounded-full bg-sky-deep px-5 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">Check rates now</button>
      <p role="status" className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
