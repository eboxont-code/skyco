import { Instagram, ArrowUpRight, Heart, MessageCircle } from "lucide-react";

const HANDLE = "skyco.online";
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;

// Placeholder tiles until live posts are wired in via the Instagram Basic
// Display API (needs an access token / connector).
const tiles = [
  { emoji: "🌤️", caption: "As above, so below — a quiet reminder." },
  { emoji: "🕊️", caption: "Small lifts, better days." },
  { emoji: "✨", caption: "Steady wins the week." },
  { emoji: "🌊", caption: "Move gently, land softly." },
];

export function MotivationBand() {
  return (
    <section id="motivation" className="px-6 py-20 md:py-24 bg-motivation-band">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">On Instagram</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Follow{" "}
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
            <Instagram className="h-4 w-4" />
            Open Instagram
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <a
              key={i}
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-white/12 backdrop-blur-sm border border-white/20 transition-all hover:bg-white/20 hover:-translate-y-1"
            >
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-90 transition-transform group-hover:scale-110">
                {tile.emoji}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sky-night/80 to-transparent p-4">
                <p className="text-sm font-semibold text-white line-clamp-2">
                  {tile.caption}
                </p>
                <div className="mt-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-white/70">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> View</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> @{HANDLE}</span>
                </div>
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="h-3.5 w-3.5 text-sky-deep" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
