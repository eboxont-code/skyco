import { Heart, Target, Zap } from "lucide-react";

const pillars = [
  {
    icon: Heart,
    title: "Body & Mind",
    description:
      "I care about the boring basics. Sleep, water, a walk, one small habit at a time.",
  },
  {
    icon: Target,
    title: "Personal Growth",
    description:
      "I want to feel a little more capable each week. Not perfect, just moving forward.",
  },
  {
    icon: Zap,
    title: "Everyday Energy",
    description:
      "The less time I lose to friction, the more I have for the people and work I love.",
  },
];

export function Mission() {
  return (
    <section id="mission" className="relative px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Why I'm doing this</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Small lifts that <span className="text-gradient-sky">add up</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            I don't believe in life hacks or big overnight changes. I believe
            in tiny, honest tools that quietly help. That's what I'm making here.
          </p>
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
