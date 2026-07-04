import { Sparkles } from "lucide-react";
import badge from "@/assets/skyco-badge.png.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient px-6 pt-24 pb-14 md:pt-28 md:pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-sky-bright/30 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-72 w-72 rounded-full bg-sky-azure/25 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.15fr_1fr]">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-deep ring-1 ring-sky-bright/40">
            <Sparkles className="h-3.5 w-3.5" />
            As Above, So Below
          </div>

          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Welcome to <span className="text-gradient-sky">SkyCo</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0 mx-auto">
            A quiet place built to help you move through your days with more
            ease, more clarity, and more energy for whatever matters to you.
          </p>

          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
            <a
              href="#tools"
              className="inline-flex items-center justify-center rounded-full bg-sky-deep px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-cyan transition-all hover:bg-sky-azure"
            >
              Explore the Tools
            </a>
            <a
              href="#mission"
              className="inline-flex items-center justify-center rounded-full border-2 border-sky-deep/20 bg-white/60 backdrop-blur px-6 py-2.5 text-sm font-semibold text-sky-deep transition-all hover:border-sky-bright hover:bg-white"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="absolute inset-0 -z-10 rounded-full bg-sky-bright/25 blur-3xl" />
          <img
            src={badge.url}
            alt="SkyCo — As Above, So Below"
            className="w-64 md:w-80 drop-shadow-[0_20px_40px_rgba(11,59,140,0.35)] animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </section>
  );
}
