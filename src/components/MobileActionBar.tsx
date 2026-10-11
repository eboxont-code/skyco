import { useEffect, useState } from "react";
import type { ResolvedProject } from "@/lib/projects";

/**
 * Compact bottom bar on phones with a single action: use CurrenSee.
 * Hidden on md and up so the desktop layout is untouched.
 */
export function MobileActionBar({ project }: { project: ResolvedProject }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const action = document.getElementById("product-hero-action");
      const footer = document.querySelector("footer");
      const editing = document.activeElement?.matches("input, textarea, select");
      setVisible(Boolean(action && action.getBoundingClientRect().bottom < 0 && (!footer || footer.getBoundingClientRect().top > window.innerHeight) && !editing && !document.getElementById("skyco-mobile-menu")));
    };
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    update();
    return () => { observer.disconnect(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); document.removeEventListener("focusin", update); document.removeEventListener("focusout", update); };
  }, [project.slug]);
  if (!project.live || !visible) return null;

  return (
    <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-sky-bright/25 bg-background/95 px-4 py-3 backdrop-blur md:hidden print:hidden">
      <a
        href="#use"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sky-deep px-6 text-sm font-bold text-primary-foreground shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Use {project.name} here
      </a>
    </div>
  );
}
