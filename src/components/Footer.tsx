import { Cloud, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 text-foreground">
            <Cloud className="h-5 w-5 text-sky-bright" />
            <span className="font-semibold">SkyCo</span>
          </div>

          <p className="text-sm text-muted-foreground">
            As Above, So Below
          </p>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Built with <Heart className="h-3.5 w-3.5 text-sky-bright" /> for real people
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} SkyCo. Small lifts for better days.
        </div>
      </div>
    </footer>
  );
}
