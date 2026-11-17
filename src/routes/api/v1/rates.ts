import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/rates")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getRateApiHandler } = await import("@/lib/rate-api.server");
        return getRateApiHandler()(request);
      },
    },
  },
});
