import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { splitDirectory, type ResolvedProject } from "@/lib/projects";
import { countWord } from "@/lib/project-copy";
import { productShots } from "@/lib/product-shots";
import { useWebMCPTools, text } from "@/lib/webmcp";


export function ToolsGrid({ directory }: { directory: ResolvedProject[] }) {
  const { live: liveProjects, upcoming: upcomingProjects } = splitDirectory(directory);

  // WebMCP: expose the product directory so agents get real URLs and status.
  useWebMCPTools([
    {
      name: "list_skyco_products",
      description:
        "List SkyCo products with their name, what they do, live status and URL. Use it to answer what SkyCo offers or to find the right SkyCo product for a task.",
      inputSchema: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["live", "upcoming", "all"],
            description: "Filter by product status. Defaults to live.",
          },
        },
        required: [],
        additionalProperties: false,
      },
      execute: async (args) => {
        const status = args["status"] === "upcoming" || args["status"] === "all" ? args["status"] : "live";
        const rows =
          status === "all" ? directory : directory.filter((p) => (status === "live" ? p.live : !p.live));
        if (rows.length === 0) return text("No SkyCo products match that status.");
        return text(
          rows
            .map((p) => `${p.name} (${p.live ? "live" : "on the way"}): ${p.description}${p.live ? ` https://skyco.online${p.path ?? ""}` : ""}`)
            .join("\n"),
        );
      },
    },
  ]);

  return (
    <section id="tools" aria-labelledby="tools-heading" className="px-6 py-12 md:py-16 bg-gradient-to-b from-sky-ice/60 to-background">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-deep">
            Built for real daily problems
          </p>
          <h2 id="tools-heading" className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {countWord(liveProjects.length)} products.{" "}
            <span className="text-gradient-sky">
              {countWord(liveProjects.length)} jobs.
            </span>{" "}
            No unnecessary complexity.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Each one solves a problem I ran into myself. Use any of them right here, see the real
            screen below before you click, and decide for yourself.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liveProjects.map(project => {
            const shot = productShots[project.slug];
            return <article key={project.slug} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              {shot ? <img src={shot.src} srcSet={shot.srcSet} sizes="(max-width: 640px) 100vw, 50vw" alt={shot.alt} width={1280} height={800} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover object-top" /> : <div className="flex aspect-[16/10] items-center justify-center bg-muted text-4xl" role="img" aria-label={`${project.name} icon`}>{project.icon}</div>}
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-bold uppercase text-sky-deep">Live</span>
                <h3 id={`tool-name-${project.slug}`} className="mt-2 text-2xl font-bold text-foreground">{project.name}</h3>
                <p className="mt-3 mb-6 text-base text-muted-foreground">{project.tagline}</p>
                <Button asChild className="mt-auto min-h-12 w-full bg-sky-deep text-primary-foreground hover:bg-sky-azure"><Link to={project.path ?? "/"}>Use {project.name} here <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
              </div>
            </article>;
          })}
        </div>

        {upcomingProjects.length > 0 && <p className="mt-6 text-sm text-muted-foreground">Planned, not yet available: {upcomingProjects.map(p => p.name).join(", ")}.</p>}

      </div>
    </section>
  );
}
