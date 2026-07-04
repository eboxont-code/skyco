import {
  ShoppingCart,
  Wallet,
  CalendarDays,
  ArrowLeftRight,
  Clock,
  ArrowUpRight,
} from "lucide-react";

type Tool = {
  icon: typeof ShoppingCart;
  title: string;
  description: string;
  status: "Live" | "Coming soon";
  href?: string;
};

const tools: Tool[] = [
  {
    icon: ShoppingCart,
    title: "Grocery List",
    description:
      "A quick list I can build on my phone and actually take to the shop. No accounts, no clutter.",
    status: "Coming soon",
  },
  {
    icon: Wallet,
    title: "Budget & Expenses",
    description:
      "The simple money tracker I wish existed. Type it in, see where it's going, move on.",
    status: "Coming soon",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    description:
      "The dates I care about, right in my browser. Nothing to sync, nothing to log into.",
    status: "Coming soon",
  },
  {
    icon: ArrowLeftRight,
    title: "Currency Converter",
    description:
      "CurrenSee is my little converter for travel days and cross-border shopping. Try it out.",
    status: "Live",
    href: "https://skycocurrensee.lovable.app",
  },
];

export function ToolsGrid() {
  return (
    <section id="tools" className="px-6 py-20 md:py-28 bg-gradient-to-b from-sky-ice/60 to-background">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">The Toolkit</p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Tools I'm building for <span className="text-gradient-sky">real life</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground leading-relaxed">
            One is already live. The rest I'm working on, slowly, in the
            evenings. If something here would help you, let me know.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const isLive = tool.status === "Live" && tool.href;
            const Wrapper: React.ElementType = isLive ? "a" : "div";
            const wrapperProps = isLive
              ? {
                  href: tool.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <Wrapper
                key={tool.title}
                {...wrapperProps}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-sky-bright/20 bg-card p-6 transition-all hover:-translate-y-1 hover:border-sky-bright hover:shadow-glow-cyan"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-bright via-sky-azure to-sky-deep opacity-70" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-bright to-sky-azure text-white shadow-sm">
                  <tool.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {tool.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>

                {isLive ? (
                  <div className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-deep px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    <ArrowUpRight className="h-3 w-3" />
                    Open {tool.title}
                  </div>
                ) : (
                  <div className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-ice px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-deep">
                    <Clock className="h-3 w-3" />
                    {tool.status}
                  </div>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
