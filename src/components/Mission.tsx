import { Heart, Target, Zap } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Body & Mind",
    description:
      "Take care of yourself. Small habits, better organisation, and steady progress that actually fits real life.",
  },
  {
    icon: Target,
    title: "Personal Growth",
    description:
      "Build what matters to you. Protect your peace, improve your habits, and feel more capable every day.",
  },
  {
    icon: Zap,
    title: "Everyday Energy",
    description:
      "Practical tools that remove friction — so you have more time and headspace for what you love.",
  },
];

export function Mission() {
  return (
    <section id="mission" className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Small lifts that add up
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          SkyCo exists because practical support makes a real difference. Not in a
          loud, overwhelming way. In a steady, encouraging way that fits into real
          life. People don&apos;t need more complicated systems. They need things that
          actually work, feel good to use, and respect their time and energy.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="group rounded-2xl border border-border bg-card p-8 text-center transition-all hover:shadow-lg hover:shadow-sky-bright/10 hover:-translate-y-1"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-light text-sky-deep">
              <pillar.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-foreground">
              {pillar.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
