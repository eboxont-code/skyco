import { ArrowUpRight } from "lucide-react";
import { entryHref, splitDirectory, type ResolvedProject } from "@/lib/projects";

/**
 * Compact bottom bar on phones with a single action: open CurrenSee.
 * Hidden on md and up so the desktop layout is untouched.
 */
export function MobileActionBar({ directory }: { directory: ResolvedProject[] }) {
  const featured = splitDirectory(directory).live.find((p) => p.slug === "currensee");
  if (!featured) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sky-bright/25 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
      <a
        href={entryHref(featured)}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-deep px-6 text-sm font-bold text-primary-foreground shadow-glow-cyan"
      >
        Open CurrenSee
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
