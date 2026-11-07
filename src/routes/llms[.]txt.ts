import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { companyLinks, legalLinks } from "@/lib/site-nav";
import { fallbackDirectory } from "@/lib/projects";
import { buildLlmsContent, resolveLlmsDirectory } from "@/lib/llms-content";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        // Never block the response on outbound probes: read whatever is
        // already known and let the discovery cache refresh in the background.
        const directory = await resolveLlmsDirectory(async () => {
          const { getDirectorySnapshot } = await import("@/lib/project-discovery.server");
          return getDirectorySnapshot();
        }, fallbackDirectory);
        const body = buildLlmsContent(directory, companyLinks, legalLinks);

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
