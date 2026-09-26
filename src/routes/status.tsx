import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose } from "@/components/PageShell";
import { fallbackDirectory, splitDirectory, entryHref, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

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
      { title: "Product Status | SkyCo" },
      {
        name: "description",
        content:
          "Published availability for every SkyCo product, with direct links to check each browser tool yourself.",
      },
      { property: "og:title", content: "Product Status | SkyCo" },
      {
        property: "og:description",
        content: "Published availability for every SkyCo product, with direct links to each tool.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/status" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Product Status | SkyCo" },
      { name: "twitter:description", content: "Published availability and direct links for every live SkyCo product." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/status" }],
  }),
  component: StatusPage,
});

function StatusPage() {
  const directory = Route.useLoaderData();
  const { live, upcoming } = splitDirectory(directory);
  const allUp = upcoming.length === 0 || live.length > 0;

  return (
    <PageShell
      eyebrow="Status"
      title="Product status"
      intro="This page reflects the products currently published on the SkyCo hub. Use the direct links below to check the feature you need."
      wide
    >
      <div
        className={`rounded-2xl border p-5 ${
          allUp ? "border-sky-bright/30 bg-sky-ice/50" : "border-destructive/30 bg-destructive/5"
        }`}
      >
        <p className="text-sm font-bold text-foreground">
          {live.length} of {directory.length} listed products are published now.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Products still in build are listed as planned rather than down.
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {directory.map((project) => (
          <li
            key={project.slug}
            className="flex flex-col gap-3 rounded-2xl border border-sky-bright/20 bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
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
            </div>

            {project.live && (
              <a
                href={entryHref(project)}
                className="inline-flex w-fit items-center rounded-full border-2 border-sky-deep/20 px-4 py-2 text-xs font-bold text-sky-deep transition-colors hover:border-sky-bright hover:bg-sky-ice"
              >
                Use {project.name}
              </a>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Prose>
          <h2>What this status means</h2>
          <p>
            Published means the product has a working route on this hub. It is not continuous uptime
            monitoring. If a feature is not working for you, report exactly what you saw.
          </p>
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
