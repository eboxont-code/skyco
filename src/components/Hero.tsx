import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import badge from "@/assets/skyco-badge-512.webp";
import badge192 from "@/assets/skyco-badge-192.webp";
import badge256 from "@/assets/skyco-badge-256.webp";
import badge384 from "@/assets/skyco-badge-384.webp";
import { entryHref, splitDirectory, type ResolvedProject } from "@/lib/projects";
import { countWord } from "@/lib/project-copy";

export function Hero({ directory }: { directory: ResolvedProject[] }) {
  const live = splitDirectory(directory).live;
  const featured = live.find((p) => p.slug === "currensee");


  return (
    <section aria-labelledby="home-heading" className="relative overflow-hidden bg-hero-gradient px-6 pt-24 pb-8 md:pt-36 md:pb-16">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0 break-words text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-deep ring-1 ring-sky-bright/40">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            As Above, So Below
          </div>

          <h1 id="home-heading" className="mt-4 text-4xl font-extrabold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="text-gradient-sky">SkyCo</span> builds small tools for everyday life.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-xl md:mx-0 mx-auto">
            A founder-led software studio. {countWord(live.length)} products are live today, each
            doing one job well, for anyone who wants the answer without an app to manage.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
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
            <Link to="/" hash="mission" className="rounded-sm font-semibold text-sky-deep underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Why trust SkyCo
            </Link>
          </p>

        </div>

        <div className="relative flex justify-center md:justify-end">
          <img
            src={badge}
            srcSet={`${badge192} 192w, ${badge256} 256w, ${badge384} 384w, ${badge} 512w`}
            sizes="(max-width: 640px) 160px, 256px"
            alt="SkyCo brand mark: a bird inside a glowing blue ring"
            width={512}
            height={512}
            fetchPriority="high"
            decoding="async"
            className="w-40 min-[641px]:w-64 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
