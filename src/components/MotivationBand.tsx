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
    <section id="motivation" className="px-6 py-24 bg-motivation-band">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A quiet boost when you need it
          </h2>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">
            Real, energising reminders that you&apos;re capable of doing hard things
            and that taking care of yourself matters.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {quotes.map((quote, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/15 backdrop-blur-sm p-8 border border-white/20 transition-all hover:bg-white/20"
            >
              <Quote className="h-8 w-8 text-white/60" />
              <p className="mt-4 text-lg font-medium text-white leading-relaxed">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="mt-4 text-sm font-medium text-white/70">
                — {quote.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
