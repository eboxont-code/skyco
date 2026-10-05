import { Instagram, ArrowUpRight } from "lucide-react";

const HANDLE = "skyco.online";
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;

const tiles = [
  { emoji: "🌤️", label: "Build notes", copy: "What I am shipping this week" },
  { emoji: "🕊️", label: "Behind the scenes", copy: "How each SkyCo tool comes together" },
  { emoji: "✨", label: "New releases", copy: "First look at every launch" },
  { emoji: "🌊", label: "Ideas", copy: "Problems worth building for" },
];

export function MotivationBand() {
  return (
    <section id="motivation" aria-labelledby="motivation-heading" className="px-6 py-20 md:py-24 bg-motivation-band">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">On Instagram</p>
            <h2 id="motivation-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Follow my build log on{" "}
              <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                @{HANDLE}
              </a>
            </h2>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-sky-deep transition-all hover:shadow-glow-cyan hover:-translate-y-0.5"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            Open Instagram
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <li key={tile.label}>
              <a
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl border border-white/20 bg-white/12 backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-1"
              >
                <span className="absolute inset-0 flex items-center justify-center text-6xl opacity-90 transition-transform group-hover:scale-110">
                  {tile.emoji}
                </span>
                <span className="relative bg-gradient-to-t from-sky-night/90 via-sky-night/40 to-transparent p-4">
                  <span className="block text-sm font-semibold text-white">{tile.label}</span>
                  <span className="mt-1 block text-xs text-white/75">{tile.copy}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
