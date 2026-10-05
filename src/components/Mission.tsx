import { Heart, Target, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { splitDirectory, type ResolvedProject } from "@/lib/projects";
import { countWord } from "@/lib/project-copy";

const pillars = [
  {
    icon: Heart,
    title: "Built for daily use",
    description:
      "I ship tools I open myself every week, not features that only look good in a demo.",
  },
  {
    icon: Target,
    title: "One job per product",
    description:
      "Each SkyCo product solves a single problem properly instead of stretching into a suite.",
  },
  {
    icon: Zap,
    title: "No friction, no clutter",
    description:
      "Fast to load, free to open, and no sign-up wall standing between you and the answer.",
  },
];

export function Mission({ directory }: { directory: ResolvedProject[] }) {
  const liveCount = splitDirectory(directory).live.length;
  return (
    <section id="mission" aria-labelledby="mission-heading" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">How I work</p>
          <h2 id="mission-heading" className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            A founder-led studio for <span className="text-gradient-sky">practical software</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            SkyCo is a small, founder-led company, and I run it. I build focused web products for the
            everyday problems people actually hit: converting money, keeping track of dates, following a
            portfolio, getting the weekly shop done. {countWord(liveCount)}{" "}
            {liveCount === 1 ? "is" : "are"} live, and I add a new one when a problem is worth solving
            properly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <Link to="/about" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4">
              More about SkyCo
            </Link>
            <span aria-hidden="true" className="text-muted-foreground/50">
              &middot;
            </span>
            <Link to="/security" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4">
              How your data is handled
            </Link>
            <span aria-hidden="true" className="text-muted-foreground/50">
              &middot;
            </span>
            <Link to="/status" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4">
              Product status
            </Link>
          </div>
        </div>


        <div className="grid gap-5 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="group rounded-2xl border border-sky-bright/20 bg-card p-6 transition-all hover:border-sky-bright hover:-translate-y-1 hover:shadow-glow-cyan"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-bright to-sky-azure text-white">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
