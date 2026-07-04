import { Heart } from "lucide-react";
import badge from "@/assets/skyco-badge.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-sky-bright/20 bg-gradient-to-b from-background to-sky-ice/50 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-foreground">
          <img src={badge.url} alt="SkyCo" className="h-8 w-8 rounded-full" />
          <span className="text-sm font-extrabold">
            Sky<span className="text-sky-bright">Co</span>
          </span>
          <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-sky-deep/70">
            As Above, So Below
          </span>
        </div>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SkyCo. Made with
          <Heart className="h-3 w-3 fill-sky-bright text-sky-bright" /> for real people.
        </p>
      </div>
    </footer>
  );
}
