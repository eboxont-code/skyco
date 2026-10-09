import { ArrowDown, Check, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { productShots, shotFreshness } from "@/lib/product-shots";
import { splitDirectory, type ResolvedProject } from "@/lib/projects";

/**
 * One shared layout for every product page hosted on skyco.online/<product>.
 * The hub owns the page, the SEO and the product experience.
 */
export function ProductPage({
  slug,
  directory,
  headline,
  intro,
  points,
  experience,
  experienceTitle,
}: {
  slug: string;
  directory: ResolvedProject[];
  headline: string;
  intro: string;
  points: string[];
  /** The product itself, running on this page. */
  experience?: React.ReactNode;
  experienceTitle?: string;
}) {
  const project =
    directory.find((p) => p.slug === slug) ?? splitDirectory(directory).live[0];
  const shot = productShots[slug];
  const others = directory.filter((p) => p.live && p.slug !== slug);

  if (!project) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar directory={directory} solid />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-20 focus:outline-none">
        <section className="border-b border-sky-bright/15 bg-gradient-to-b from-sky-ice/70 to-background px-6 py-14">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link to="/" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-sky-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li><Link to="/" hash="tools" className="inline-flex min-h-11 items-center text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Products</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page">{project.name}</li>
                </ol>
              </nav>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-ice px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-deep">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {project.live ? "Live" : "On the way"}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-deep">
                  {project.tagline}
                </span>
              </div>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                {project.name}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{headline}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#use"
                   onClick={() => requestAnimationFrame(() => document.getElementById("use")?.focus())}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-deep px-7 text-sm font-bold text-primary-foreground transition-all hover:bg-sky-azure hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Use {project.name} here
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  to="/support"
                  search={{ product: project.name }}
                  className="inline-flex min-h-12 items-center rounded-full border border-sky-bright/40 px-6 text-sm font-semibold text-sky-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Ask a question
                </Link>
              </div>

              {project.account && (
                <p className="mt-3 text-xs text-muted-foreground">{project.account}</p>
              )}
            </div>

            {shot && (
              <div>
                <div className="block overflow-hidden rounded-2xl border border-sky-bright/25 bg-card shadow-lg">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={1280}
                    height={800}
                    decoding="async"
                    loading="eager"
                    fetchPriority="high"
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                </div>

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
              </div>
            )}
          </div>
        </section>

        {experience && (
          <section id="use" tabIndex={-1} aria-labelledby="use-heading" className="focus:outline-none scroll-mt-24 border-b border-sky-bright/15 px-6 py-14">
            <div className="mx-auto max-w-4xl">
              <h2 id="use-heading" className="text-2xl font-extrabold tracking-tight text-foreground">
                {experienceTitle ?? `Use ${project.name}`}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Running here on SkyCo. Nothing to install and no account needed.
              </p>
              <div className="mt-6">{experience}</div>
            </div>
          </section>
        )}

        <section className="px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              What you get
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-2xl border border-sky-bright/20 bg-card p-5 text-sm leading-relaxed text-muted-foreground"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-bright" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <Link to="/support" hash={`faq-${project.path?.slice(1) ?? slug}`} className="mt-5 inline-flex min-h-11 items-center rounded-sm font-semibold text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Questions about {project.name}</Link>

            {project.why && (
              <div className="mt-10 rounded-2xl border border-sky-bright/25 bg-sky-ice/50 p-6">
                <p className="text-sm font-bold text-foreground">Why I built it</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.why}</p>
                {project.example && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {project.example}
                  </p>
                )}
              </div>
            )}

            <div className="mt-10">
              <a
                href="#use"
                   onClick={() => requestAnimationFrame(() => document.getElementById("use")?.focus())}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-sky-deep px-7 text-sm font-bold text-primary-foreground transition-all hover:bg-sky-azure hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Use {project.name} here
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {others.length > 0 && (
              <nav aria-label="Related SkyCo products" className="mt-16 border-t border-sky-bright/15 pt-10">
                <h2 className="text-xl font-extrabold text-foreground">
                  Other SkyCo tools
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Every product runs here in your browser.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {others.map((p) => (
                    <Link
                      key={p.slug}
                      to={p.path ?? "/"}
                      className="rounded-2xl border border-sky-bright/20 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <p className="text-sm font-bold text-foreground">Use {p.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {p.demo ?? p.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/"
                  className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-semibold text-sky-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to the SkyCo hub
                </Link>
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer directory={directory} />
    </div>
  );
}
