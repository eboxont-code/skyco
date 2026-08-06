import {
  ArrowUpRight,
  ArrowLeftRight,
  CalendarDays,
  Wallet,
  ShoppingBasket,
  NotebookPen,
  Clock,
  Sparkles,
} from "lucide-react";
import { splitDirectory, type ProjectIcon, type ResolvedProject } from "@/lib/projects";
import { countWord } from "@/lib/project-copy";
import { useWebMCPTools, text } from "@/lib/webmcp";

const icons: Record<ProjectIcon, typeof ArrowLeftRight> = {
  converter: ArrowLeftRight,
  calendar: CalendarDays,
  wallet: Wallet,
  grocery: ShoppingBasket,
  notes: NotebookPen,
  default: Sparkles,
};

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
            .map((p) => `${p.name} (${p.live ? "live" : "on the way"}): ${p.description}${p.live ? ` ${p.href}` : ""}`)
            .join("\n"),
        );
      },
    },
  ]);

  return (
    <section id="tools" className="px-6 py-20 md:py-28 bg-gradient-to-b from-sky-ice/60 to-background">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">The Toolkit</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {countWord(liveProjects.length)} products live, more on{" "}
              <span className="text-gradient-sky">the way</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground leading-relaxed">
            Every SkyCo product starts with a problem I run into myself. Each one runs on its own
            site and is free to open right now.
          </p>
        </div>

        <h3 className="sr-only">Live projects</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {liveProjects.map((project) => {
            const Icon = icons[project.icon] ?? icons.default;
            return (
              <a
                key={project.slug}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-sky-bright/20 bg-card p-6 transition-all hover:-translate-y-1 hover:border-sky-bright hover:shadow-glow-cyan"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-bright via-sky-azure to-sky-deep opacity-70" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-bright to-sky-azure text-white shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-sky-ice px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-deep">
                    Live
                  </span>
                </div>

                <h4 className="mt-4 text-lg font-bold text-foreground">{project.name}</h4>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-bright">
                  {project.tagline}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-deep px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  Open {project.name}
                </span>
              </a>
            );
          })}
        </div>

        {upcomingProjects.length > 0 && (
          <>
            <h3 className="mt-14 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              On the way
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {upcomingProjects.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-xl border border-dashed border-sky-bright/30 bg-card/50 p-5"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-sky-deep" aria-hidden="true" />
                    <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
