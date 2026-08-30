import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import badge from "@/assets/skyco-badge-96.webp";
import {
  entryHref,
  fallbackDirectory,
  splitDirectory,
  type ResolvedProject,
} from "@/lib/projects";
import { companyLinks, legalLinks, trustStrip, SUPPORT_EMAIL } from "@/lib/site-nav";

export function Footer({ directory = fallbackDirectory }: { directory?: ResolvedProject[] }) {
  const liveProjects = splitDirectory(directory).live;

  return (
    <footer className="border-t border-sky-bright/20 bg-gradient-to-b from-background to-sky-ice/50 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-foreground">
              <img
                src={badge}
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm font-extrabold">
                Sky<span className="text-sky-bright">Co</span>
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-sky-deep/70">
              As Above, So Below
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Small, focused web tools. One job each, free to open, no clutter.
            </p>
          </div>

          <nav aria-label="SkyCo products">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Products</p>
            <ul className="mt-3 space-y-2">
              {liveProjects.map((project) => (
                <li key={project.slug}>
                  <a
                    href={entryHref(project)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Company</p>
            <ul className="mt-3 space-y-2">
              {companyLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal and contact">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Legal</p>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/skyco.online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sky-bright/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">SkyCo</span>
            {trustStrip.map((l) => (
              <span key={l.to} className="flex items-center gap-2">
                <span aria-hidden="true">&middot;</span>
                <Link to={l.to} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </span>
            ))}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SkyCo. Made with
            <Heart className="h-3 w-3 fill-sky-bright text-sky-bright" aria-label="love" />
          </p>
        </div>
      </div>
    </footer>
  );
}
