import type { IgPost } from "./instagram.types";

const HANDLE = "skyco.online";
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;
const TTL_MS = 1000 * 60 * 60; // 1 hour
const REQUEST_TIMEOUT_MS = 8000;

let cache: { at: number; data: IgPost[] } | null = null;
let inFlight: Promise<IgPost[]> | null = null;

async function scrape(): Promise<IgPost[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
    console.warn(`[instagram] Firecrawl ${res.status}: ${await res.text().catch(() => "")}`);
    return [];
  }
  const body = (await res.json()) as { data?: { json?: { posts?: IgPost[] } } };
  return (body.data?.json?.posts ?? []).slice(0, 4);
}

/** Cached, timeout-bounded read. Never throws, so the UI can render fallbacks. */
export async function loadInstagramPosts(): Promise<IgPost[]> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.data;
  if (inFlight) return inFlight;

  inFlight = scrape()
    .then((data) => {
      cache = { at: Date.now(), data };
      return data;
    })
    .catch(() => cache?.data ?? [])
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
