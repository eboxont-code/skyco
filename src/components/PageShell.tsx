import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { ResolvedProject } from "@/lib/projects";

/**
 * Shared frame for every non-home page: same header, same footer, same
 * measure and rhythm, so the whole site reads as one product.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  updated,
  children,
  directory,
  wide = false,
  parent,
  crumb,
}: {
  parent?: { label: string; to: "/currensee" };
  crumb?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
  directory?: ResolvedProject[];
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar directory={directory} solid />
      <main id="main-content" tabIndex={-1} className="info-print flex-1 pt-20 focus:outline-none">
        <div className="border-b border-sky-bright/15 bg-gradient-to-b from-sky-ice/70 to-background px-6 py-14">
          <div className={wide ? "mx-auto max-w-5xl" : "mx-auto max-w-3xl"}>
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                {parent && (
                  <>
                    <li><Link to={parent.to} className="inline-flex min-h-11 items-center font-semibold text-sky-deep underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{parent.label}</Link></li>
                    <li aria-hidden="true">/</li>
                  </>
                )}
                <li aria-current="page">{crumb ?? title}</li>
              </ol>
            </nav>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-deep">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {title}
            </h1>
            {intro && (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>
            )}
            {updated && (
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Last updated <time dateTime={toIsoDate(updated)}>{updated}</time>
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-12">
          <div className={wide ? "mx-auto max-w-5xl" : "mx-auto max-w-3xl"}>{children}<a href="#main-content" className="mt-8 inline-flex min-h-11 items-center font-semibold text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Back to top</a></div>
        </div>
      </main>
      <Footer directory={directory} />
    </div>
  );
}

/** Consistent typography for the written pages. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="space-y-8 text-base leading-relaxed text-muted-foreground
        [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground
        [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground
        [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
        [&_a]:font-medium [&_a]:text-sky-deep [&_a]:underline [&_a]:underline-offset-4
        [&_strong]:font-semibold [&_strong]:text-foreground"
    >
      {children}
    </div>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-2xl border border-sky-bright/25 bg-sky-ice/50 p-5">
      <p className="text-sm font-bold text-foreground">{title}</p>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </aside>
  );
}

function toIsoDate(value: string) {
  const d = new Date(`${value} 12:00 UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}
