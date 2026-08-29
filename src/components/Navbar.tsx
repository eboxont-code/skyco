import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import badge from "@/assets/skyco-badge-96.webp";
import {
  entryHref,
  fallbackDirectory,
  splitDirectory,
  type ResolvedProject,
} from "@/lib/projects";
import { companyLinks } from "@/lib/site-nav";

export function Navbar({
  directory = fallbackDirectory,
  solid = false,
}: {
  directory?: ResolvedProject[];
  solid?: boolean;
}) {
  // SkyCo is the parent brand; these are its live projects.
  const projects = splitDirectory(directory).live.map((p) => ({
    label: p.name,
    tagline: p.tagline,
    href: entryHref(p),
  }));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!projectsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProjectsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projectsOpen]);

  const opaque = solid || scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        opaque
          ? "bg-background/85 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2 text-foreground" aria-label="SkyCo home">
          <img
            src={badge}
            alt=""
            aria-hidden="true"
            width={96}
            height={96}
            decoding="async"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-lg font-extrabold tracking-tight">
            Sky<span className="text-sky-bright">Co</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setProjectsOpen(true)}
            onMouseLeave={() => setProjectsOpen(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setProjectsOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setProjectsOpen((v) => !v)}
              aria-expanded={projectsOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Products
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", projectsOpen && "rotate-180")}
              />
            </button>
            {projectsOpen && (
              <div role="menu" className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72">
                <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-2">
                  {projects.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      role="menuitem"
                      className="block rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
                    >
                      <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                      <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {companyLinks
            .filter((l) => l.to !== "/faq")
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-foreground" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}

          <Link
            to="/support"
            className="rounded-full bg-sky-deep px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-sky-azure hover:shadow-glow-cyan"
          >
            Get in touch
          </Link>
        </nav>

        <button
          className="md:hidden rounded-md p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Products
            </p>
            <div className="space-y-1">
              {projects.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="block rounded-md px-2 py-2 hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                  <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              SkyCo
            </p>
            <div className="grid grid-cols-2 gap-y-2">
              {companyLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/support"
            className="inline-block rounded-full bg-sky-deep px-5 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Get in touch
          </Link>
        </div>
      )}
    </header>
  );
}
