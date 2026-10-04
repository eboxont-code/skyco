import { Sparkles, ShieldCheck, Zap, CircleDollarSign, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import badge from "@/assets/skyco-badge-512.webp";
import { entryHref, splitDirectory, type ResolvedProject } from "@/lib/projects";
import { countWord } from "@/lib/project-copy";

export function Hero({ directory }: { directory: ResolvedProject[] }) {
  const live = splitDirectory(directory).live;
  const featured = live.find((p) => p.slug === "currensee");
  const others = live.filter((p) => p.slug !== "currensee");


  return (
    <section className="relative overflow-hidden bg-hero-gradient px-6 pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_1fr]">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-deep ring-1 ring-sky-bright/40">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            As Above, So Below
          </div>

          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="text-gradient-sky">SkyCo</span> builds small tools for everyday life.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl md:mx-0 mx-auto">
            A founder-led software studio. {countWord(live.length)} products are live today, each
            doing one job well, for anyone who wants the answer without an app to manage.
          </p>

          <div className="mt-7 flex flex-wrap justify-center md:justify-start gap-2">
            {[
              { icon: Zap, label: "Use here, nothing to install" },
              { icon: CircleDollarSign, label: "Free to use" },
              { icon: ShieldCheck, label: "No account for most products" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-card/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-sky-deep ring-1 ring-sky-bright/25"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            {featured && (
              <a
                href={entryHref(featured)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sky-deep px-7 text-base font-semibold text-primary-foreground shadow-glow-cyan transition-all hover:bg-sky-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Use CurrenSee here
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <a
              href="#tools"
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-sky-deep/20 bg-card/70 backdrop-blur px-7 text-base font-semibold text-sky-deep transition-all hover:border-sky-bright hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              See the products
            </a>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Live rates for any currency pair, plus a 30 day chart. Free, no sign up.{" "}
            <Link to="/about" className="rounded-sm font-semibold text-sky-deep underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Why trust SkyCo
            </Link>
          </p>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                to={p.path ?? "/"}
                className="inline-flex items-center gap-1.5 min-h-11 rounded-lg border border-sky-bright/25 bg-card/70 px-3.5 py-2.5 text-xs font-bold text-sky-deep transition-all hover:border-sky-bright hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Try {p.name}
              </Link>
            ))}
          </div>

        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="absolute inset-0 -z-10 rounded-full bg-sky-bright/25 blur-3xl" />
          <img
            src={badge}
            alt="SkyCo brand mark: a bird inside a glowing blue ring"
            width={512}
            height={512}
            fetchPriority="high"
            decoding="async"
            className="w-56 sm:w-72 md:w-80 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
