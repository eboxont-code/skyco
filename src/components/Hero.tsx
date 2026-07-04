import { ChevronDown, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-hero-gradient px-6 pt-20 text-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-sky-medium/20 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-sky-bright/15 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-sky-warm/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-light px-4 py-1.5 text-sm font-medium text-sky-deep ring-1 ring-sky-medium/30">
          <Sparkles className="h-4 w-4" />
          As Above, So Below
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Welcome to{" "}
          <span className="text-gradient-sky">SkyCo</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          A place built to help you move through your days with a little more
          ease, a little more clarity, and a little more energy to go after
          whatever matters to you.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#tools"
            className="inline-flex items-center justify-center rounded-full bg-sky-deep px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-sky-deep/20 transition-all hover:bg-sky-deep/90 hover:shadow-xl hover:shadow-sky-deep/30"
          >
            Explore the Tools
          </a>
          <a
            href="#mission"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-8 py-3 text-base font-medium text-foreground transition-all hover:bg-muted"
          >
            Learn More
          </a>
        </div>
      </div>

      <a
        href="#mission"
        className="absolute bottom-8 animate-bounce text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-6 w-6" />
      </a>
    </section>
  );
}
