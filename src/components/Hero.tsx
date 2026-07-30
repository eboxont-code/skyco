import { Sparkles } from "lucide-react";
import badge from "@/assets/skyco-badge.png.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-sky-bright/30 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-sky-azure/25 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1.15fr_1fr]">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-deep ring-1 ring-sky-bright/40">
            <Sparkles className="h-3.5 w-3.5" />
            As Above, So Below
          </div>

          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="text-gradient-sky">SkyCo</span> builds small tools for everyday life.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl md:mx-0 mx-auto">
            Three of our products are live today: CurrenSee for currency and crypto rates, Chronos for
            multi-calendar planning, and My Finance Friend for portfolio tracking. All free to open, no
            account required.
          </p>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            <a
              href="#tools"
              className="inline-flex items-center justify-center rounded-full bg-sky-deep px-7 py-3 text-base font-semibold text-primary-foreground shadow-glow-cyan transition-all hover:bg-sky-azure"
            >
              See our live tools
            </a>
            <a
              href="#mission"
              className="inline-flex items-center justify-center rounded-full border-2 border-sky-deep/20 bg-white/60 backdrop-blur px-7 py-3 text-base font-semibold text-sky-deep transition-all hover:border-sky-bright hover:bg-white"
            >
              How we work
            </a>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="absolute inset-0 -z-10 rounded-full bg-sky-bright/25 blur-3xl" />
          <img
            src={badge.url}
            alt="SkyCo brand mark"
            width={384}
            height={384}
            fetchPriority="high"
            decoding="async"
            className="w-72 md:w-96 drop-shadow-[0_20px_40px_rgba(11,59,140,0.35)] animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </section>
  );
}
