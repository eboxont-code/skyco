import { ArrowRight, Clock, Check } from "lucide-react";
import { entryHref, splitDirectory, type ResolvedProject } from "@/lib/projects";
import { countWord } from "@/lib/project-copy";
import { productShots, shotFreshness } from "@/lib/product-shots";
import { useWebMCPTools, text } from "@/lib/webmcp";
import { WaitlistForm } from "@/components/WaitlistForm";


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
    <section id="tools" className="px-6 py-20 md:py-24 bg-gradient-to-b from-sky-ice/60 to-background">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">
            Built for real daily problems
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
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

        <h3 className="sr-only">Live products</h3>
        <div className="mt-12 space-y-16">
          {liveProjects.map((project, i) => {
            const shot = productShots[project.slug];
            const flip = i % 2 === 1;
            return (
              <article
                key={project.slug}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                <div className={flip ? "lg:order-2" : undefined}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-ice px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-deep">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      Live
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-sky-bright">
                      {project.tagline}
                    </span>
                  </div>

                  <h4 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {project.name}
                  </h4>
                  {project.demo && (
                    <p className="mt-3 text-lg font-semibold leading-snug text-sky-deep">
                      {project.demo}
                    </p>
                  )}
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {[project.why, project.account]
                      .filter((v): v is string => Boolean(v))
                      .map((line) => (
                        <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-bright" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                  </ul>

                  <a
                    href={entryHref(project)}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky-deep px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-sky-azure hover:shadow-glow-cyan"
                  >
                    Try {project.name} now
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                {shot && (
                  <div className={flip ? "lg:order-1" : undefined}>
                    <a
                      href={entryHref(project)}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="block overflow-hidden rounded-2xl border border-sky-bright/25 bg-card shadow-lg transition-all hover:-translate-y-1 hover:shadow-glow-cyan"
                    >
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        width={1280}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/10] w-full object-cover object-top"
                      />
                    </a>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-xs font-medium text-foreground">{shot.result}</p>
                      <span
                        suppressHydrationWarning
                        className="inline-flex items-center gap-1.5 rounded-full bg-sky-ice px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-deep"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        {shotFreshness(shot.captured)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      A real screen from {project.name}, not a mockup.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {upcomingProjects.length > 0 && (
          <>
            <h3 className="mt-20 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              On the way
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  {item.slug === "budget" && <WaitlistForm productName={item.name} />}
                </div>
              ))}

            </div>
          </>
        )}
      </div>
    </section>
  );
}
