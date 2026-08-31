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
          "Live reachability of every SkyCo product, checked from the server when this page loads. See what is up before you report a problem.",
      },
      { property: "og:title", content: "Product Status | SkyCo" },
      {
        property: "og:description",
        content: "Live reachability of every SkyCo product, checked when this page loads.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/status" },
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
      intro="Each SkyCo product is checked from the server when this page loads. Reachable means the site answered; it does not promise every feature inside is perfect."
      wide
    >
      <div
        className={`rounded-2xl border p-5 ${
          allUp ? "border-sky-bright/30 bg-sky-ice/50" : "border-destructive/30 bg-destructive/5"
        }`}
      >
        <p className="text-sm font-bold text-foreground">
          {live.length} of {directory.length} listed products are reachable right now.
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
                  {project.live ? "Reachable" : "Planned"}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{project.tagline}</p>
            </div>

            {project.live && (
              <a
                href={entryHref(project)}
                className="inline-flex w-fit items-center rounded-full border-2 border-sky-deep/20 px-4 py-2 text-xs font-bold text-sky-deep transition-colors hover:border-sky-bright hover:bg-sky-ice"
              >
                Open {project.name}
              </a>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Prose>
          <h2>How this check works</h2>
          <p>
            When you load this page the server requests each product URL and records whether it
            answered. Results are cached briefly so the page stays fast, so a very recent outage can
            take a few minutes to appear here.
          </p>
          <h2>Seeing something this page does not?</h2>
          <p>
            If a product is marked reachable but is broken for you, that is worth an email. Tell me
            the product, your browser and what you saw on the{" "}
            <a href="/support">Support page</a>.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}
