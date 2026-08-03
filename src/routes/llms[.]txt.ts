import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fallbackDirectory, splitDirectory } from "@/lib/projects";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        let directory = fallbackDirectory;
        try {
          const { resolveProjectDirectory } = await import("@/lib/project-discovery.server");
          directory = await resolveProjectDirectory();
        } catch {
          directory = fallbackDirectory;
        }
        const { live, upcoming } = splitDirectory(directory);

        const body = [
          "# SkyCo",
          "",
          `> SkyCo is a founder-led software studio building small web tools for everyday life. ${live.length} products are live today.`,
          "",
          "SkyCo is the parent company for a family of focused, no-clutter web tools. Each product lives on its own site and links back here.",
          "",
          "## Pages",
          "",
          "- [Home](https://skyco.online/): Overview of SkyCo, its live products, how the company works, and how to get in touch.",
          "",
          "## Projects",
          "",
          ...live.map((p) => `- [${p.name}](${p.href}): ${p.description}`),
          ...(upcoming.length
            ? ["", "## On the way", "", ...upcoming.map((p) => `- ${p.name}: ${p.description}`)]
            : []),
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
