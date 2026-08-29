import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { hrefForSlug } from "@/lib/projects";

/**
 * Clean SkyCo entry URL. The product keeps its own hosting; this route only
 * forwards visitors so every product is shareable under skyco.online.
 */
export const Route = createFileRoute("/grocery")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 302,
          headers: {
            Location: hrefForSlug("grocery-packs"),
            "Cache-Control": "public, max-age=300",
          },
        }),
    },
  },
});
