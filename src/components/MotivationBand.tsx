import { Quote } from "lucide-react";

const quotes = [
  {
    text: "You don't have to be perfect to make progress. You just have to keep showing up.",
    author: "SkyCo",
  },
  {
    text: "Small steps every day lead to big changes over time. Trust the process.",
    author: "SkyCo",
  },
  {
    text: "Taking care of yourself isn't selfish — it's how you stay strong for everything else.",
    author: "SkyCo",
  },
  {
    text: "Progress doesn't have to be loud. Quiet consistency is its own kind of power.",
    author: "SkyCo",
  },
];

export function MotivationBand() {
  return (
    <section id="motivation" className="px-6 py-12 md:py-16 bg-motivation-band">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            A quiet boost, whenever you need it.
          </h2>
          <p className="max-w-sm text-sm text-white/80 leading-relaxed">
            Real, energising reminders — because taking care of yourself matters.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((quote, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/12 backdrop-blur-sm p-5 border border-white/20 transition-all hover:bg-white/20 hover:-translate-y-0.5"
            >
              <Quote className="h-5 w-5 text-white/70" />
              <p className="mt-2 text-sm font-semibold text-white leading-relaxed">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-white/60">
                — {quote.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
