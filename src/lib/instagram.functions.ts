import { createServerFn } from "@tanstack/react-start";

export type IgPost = {
  url: string;
  thumbnail: string;
  caption: string;
};

const HANDLE = "skyco.online";
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;

export const getInstagramPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<IgPost[]> => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");

    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: PROFILE_URL,
        formats: [
          {
            type: "json",
            prompt:
              "Extract the 4 most recent Instagram posts from this profile page. For each, return the post permalink URL (starting with https://www.instagram.com/p/ or /reel/), the thumbnail image URL, and a short caption or alt text.",
            schema: {
              type: "object",
              properties: {
                posts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      url: { type: "string" },
                      thumbnail: { type: "string" },
                      caption: { type: "string" },
                    },
                    required: ["url", "thumbnail"],
                  },
                },
              },
              required: ["posts"],
            },
          },
        ],
        onlyMainContent: false,
        waitFor: 3000,
      }),
    });

    if (!res.ok) {
      // Firecrawl blocks instagram.com ("we do not support this site") and
      // may rate-limit or error on other providers. Degrade gracefully so
      // the UI can render its fallback tiles instead of a blank screen.
      console.warn(
        `[instagram] Firecrawl ${res.status}: ${await res.text().catch(() => "")}`,
      );
      return [];
    }
    const body = (await res.json()) as {
      data?: { json?: { posts?: IgPost[] } };
    };
    const posts = body.data?.json?.posts ?? [];
    return posts.slice(0, 4);
  },
);