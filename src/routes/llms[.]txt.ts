import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { fallbackDirectory, splitDirectory } from "@/lib/projects";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        // Never block the response on outbound probes: read whatever is
        // already known and let the discovery cache refresh in the background.
        let directory = fallbackDirectory;
        try {
          const { getDirectorySnapshot } = await import("@/lib/project-discovery.server");
          directory = getDirectorySnapshot();
        } catch {
          directory = fallbackDirectory;
        }
        const { live, upcoming } = splitDirectory(directory);

        const body = [
          "# SkyCo",
          "",
          `> SkyCo is a founder-led software studio building small web tools for everyday life. ${live.length} products are live today.`,
          "",
          "SkyCo is the single home for a family of focused, no-clutter web tools. Every live product runs at a path on skyco.online.",
          "",
          "## Pages",
          "",
          "- [Home](https://skyco.online/): Overview of SkyCo, its live products, how the company works, and how to get in touch.",
          "",
          "## Projects",
          "",
          ...live.map((p) => `- [${p.name}](https://skyco.online${p.path ?? ""}): ${p.description}`),
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
