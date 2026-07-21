import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import badge from "@/assets/skyco-badge.png.asset.json";

// SkyCo is the parent brand; these are its sister projects.
const projects = [
  {
    label: "Celestial Timekeeper",
    tagline: "Calendar & time across cultures",
    href: "https://stellar-chronos-spark.lovable.app",
  },
  {
    label: "My Finance Friend",
    tagline: "Personal portfolio tracker",
    href: "https://chat-folio-pilot.lovable.app",
  },
  {
    label: "CurrenSee",
    tagline: "Live currency converter",
    href: "https://currensee.skyco.online",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <a href="/" className="flex items-center gap-2 text-foreground" aria-label="SkyCo home">
          <img src={badge.url} alt="SkyCo brand mark" className="h-10 w-10 rounded-full" />
          <span className="text-lg font-extrabold tracking-tight">
            Sky<span className="text-sky-bright">Co</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setProjectsOpen(true)}
            onMouseLeave={() => setProjectsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setProjectsOpen((v) => !v)}
              aria-expanded={projectsOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Projects
              <ChevronDown className={cn("h-4 w-4 transition-transform", projectsOpen && "rotate-180")} />
            </button>
            {projectsOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full pt-3 w-72"
              >
                <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-2">
                  {projects.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      className="flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                        <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 mt-1 text-muted-foreground shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a
            href="#tools"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tools
          </a>
          <a
            href="#help"
            className="rounded-full bg-sky-deep px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-sky-azure hover:shadow-glow-cyan"
          >
            Get in Touch
          </a>
        </nav>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Projects
            </p>
            <div className="space-y-1">
              {projects.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                    <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
          <a
            href="#tools"
            className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Tools
          </a>
          <a
            href="#help"
            className="inline-block rounded-full bg-sky-deep px-5 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
}
