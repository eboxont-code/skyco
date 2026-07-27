import { Heart, ExternalLink } from "lucide-react";
import badge from "@/assets/skyco-badge.png.asset.json";
import { liveProjects } from "@/lib/projects";

export function Footer() {
  return (
    <footer className="border-t border-sky-bright/20 bg-gradient-to-b from-background to-sky-ice/50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-foreground">
              <img src={badge.url} alt="SkyCo brand mark" className="h-8 w-8 rounded-full" />
              <span className="text-sm font-extrabold">
                Sky<span className="text-sky-bright">Co</span>
              </span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-sky-deep/70">
                As Above, So Below
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The home base for every small tool I build.
            </p>
          </div>

          <nav aria-label="SkyCo projects">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Projects</h2>
            <ul className="mt-3 space-y-2">
              {liveProjects.map((project) => (
                <li key={project.slug}>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {project.name}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 flex items-center gap-1 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SkyCo. Made with
          <Heart className="h-3 w-3 fill-sky-bright text-sky-bright" aria-label="love" />
        </p>
      </div>
    </footer>
  );
}
