import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { splitDirectory, type ResolvedProject } from "@/lib/projects";

/**
 * Compact bottom bar on phones with a single action: use CurrenSee.
 * Hidden on md and up so the desktop layout is untouched.
 */
export function MobileActionBar({ directory }: { directory: ResolvedProject[] }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let footerVisible = false;
    const update = () => setHidden(footerVisible || Boolean(document.getElementById("skyco-mobile-menu")));
    const observer = new IntersectionObserver(entries => { footerVisible = entries.some(e => e.isIntersecting); update(); });
    const footer = document.querySelector("footer"); if (footer) observer.observe(footer);
    const menuObserver = new MutationObserver(update); menuObserver.observe(document.body, { childList: true, subtree: true }); update();
    return () => { observer.disconnect(); menuObserver.disconnect(); };
  }, []);
  const featured = splitDirectory(directory).live.find((p) => p.slug === "currensee");
  if (!featured || hidden) return null;

  return (
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-sky-bright/25 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
      <Link
        to="/currensee"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-deep px-6 text-sm font-bold text-primary-foreground shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Use CurrenSee here
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
