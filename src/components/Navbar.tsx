import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import badge from "@/assets/skyco-badge-96.webp";
import {
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
    href: p.path ?? "/",
  }));
  const pathname = useRouterState({ select: state => state.location.pathname });
  const productsButton = useRef<HTMLButtonElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const mobilePanel = useRef<HTMLDivElement>(null);
  const desktopMenu = useRef<HTMLDivElement>(null);
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
      if (e.key === "Escape") { setProjectsOpen(false); productsButton.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projectsOpen]);

  useEffect(() => { setMobileOpen(false); setProjectsOpen(false); }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobilePanel.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMobileOpen(false); menuToggle.current?.focus(); return; }
      if (event.key !== "Tab") return;
      const nodes = [menuToggle.current, ...Array.from(mobilePanel.current?.querySelectorAll<HTMLElement>("a, button") ?? [])].filter((node): node is HTMLElement => node !== null);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); };
  }, [mobileOpen]);
  const focusItem = (index: number) => requestAnimationFrame(() => {
    const nodes = desktopMenu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (nodes?.length) nodes[(index + nodes.length) % nodes.length]?.focus();
  });
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
        <Link to="/" className="flex items-center gap-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="SkyCo home">
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
              ref={productsButton}
              type="button"
              onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setProjectsOpen(true); focusItem(event.key === "ArrowDown" ? 0 : -1); } }}
              onClick={() => setProjectsOpen((v) => !v)}
              aria-expanded={projectsOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Products
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", projectsOpen && "rotate-180")}
              />
            </button>
            {projectsOpen && (
              <div ref={desktopMenu} role="menu" onKeyDown={event => {
                const nodes = Array.from(desktopMenu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
                const index = nodes.indexOf(document.activeElement as HTMLElement);
                if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); focusItem(event.key === "Home" ? 0 : event.key === "End" ? -1 : index + (event.key === "ArrowDown" ? 1 : -1)); }
              }} className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72">
                <div className="rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-2">
                  <Link to="/" hash="tools" role="menuitem" className="block min-h-11 rounded-md px-3 py-2 text-sm font-semibold text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">All products</Link>
                  {projects.map((p) => (
                    <Link
                      key={p.href}
                      to={p.href}
                      role="menuitem"
                      className="block rounded-lg px-3 py-2.5 hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                      <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                    </Link>
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
                activeProps={{ className: "text-foreground", "aria-current": "page" }}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {l.label}
              </Link>
            ))}

          <Link
            to="/support"
            className="rounded-full bg-sky-deep px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-sky-azure hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get in touch
          </Link>
        </nav>

        <button
          ref={menuToggle}
          aria-controls="skyco-mobile-menu"
          className="md:hidden rounded-md p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="skyco-mobile-menu" ref={mobilePanel} className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Products
            </p>
            <div className="space-y-1">
              {projects.map((p) => (
                <Link
                  key={p.href}
                  to={p.href}
                  className="block rounded-md px-2 py-2 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                  <span className="block text-xs text-muted-foreground">{p.tagline}</span>
                </Link>
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
