import {
  ShoppingCart,
  Wallet,
  CalendarDays,
  ArrowLeftRight,
  Clock,
} from "lucide-react";

const tools = [
  {
    icon: ShoppingCart,
    title: "Grocery List",
    description:
      "Build a clean grocery list quickly and take it with you. No clutter, no fuss — just what you need.",
    status: "Coming soon",
  },
  {
    icon: Wallet,
    title: "Budget & Expenses",
    description:
      "Simple budgeting and expense tracking that doesn’t require a finance degree to understand.",
    status: "Coming soon",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    description:
      "Keep important dates and plans visible right in your browser. Clean, simple, and always within reach.",
    status: "Coming soon",
  },
  {
    icon: ArrowLeftRight,
    title: "Currency Converter",
    description:
      "Quick conversions for different countries or just checking what something actually costs.",
    status: "Coming soon",
  },
];

export function ToolsGrid() {
  return (
    <section id="tools" className="px-6 py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tools for real life
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Small but genuinely useful things that remove little points of stress
            from your day. Simple on purpose. Clean. Easy to pick up and put down.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-sky-bright/10 hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-light text-sky-deep transition-colors group-hover:bg-sky-bright group-hover:text-primary-foreground">
                <tool.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {tool.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tool.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-sky-deep/70">
                <Clock className="h-3.5 w-3.5" />
                {tool.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
