import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Legacy entry path. The product now lives at the hub route /finance-friend,
 * so this permanently forwards and keeps a single indexable copy.
 */
export const Route = createFileRoute("/finance")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: {
            Location: "https://skyco.online/finance-friend",
            "Cache-Control": "public, max-age=86400",
          },
        }),
    },
  },
});
