import { projectRegistry, fallbackDirectory, type ResolvedProject } from "./projects";

type CacheEntry = { at: number; data: ResolvedProject[] };

const TTL_MS = 1000 * 60 * 15;
const PROBE_TIMEOUT_MS = 2500;
let cache: CacheEntry | null = null;
let inFlight: Promise<ResolvedProject[]> | null = null;

async function reachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": "SkyCo-Directory/1.0" },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    return res.status < 400;
  } catch {
    return false;
  }
}

async function probe(): Promise<ResolvedProject[]> {
  return Promise.all(
    projectRegistry.map(async (project) => {
      const fallback = fallbackDirectory.find((p) => p.slug === project.slug);
      // Probe every candidate at once, then keep the best (earliest listed) hit.
      const results = await Promise.all(
        project.candidates.map(async (candidate) => ({
          candidate,
          ok: await reachable(candidate),
        })),
      );
      const hit = results.find((r) => r.ok);
      if (hit) return { ...project, href: hit.candidate, live: true };
      return {
        ...project,
        href: fallback?.href ?? project.candidates[0] ?? "https://skyco.online/",
        live: false,
      };
    }),
  );
}

/**
 * Resolves every registered SkyCo project to its best working URL and marks it
 * live or upcoming. Cached in memory so a page view never waits on more than
 * one round of probes, and always degrades to the static registry on failure.
 */
export async function resolveProjectDirectory(): Promise<ResolvedProject[]> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.data;
  if (inFlight) return inFlight;

  inFlight = probe()
    .then((data) => {
      cache = { at: Date.now(), data };
      return data;
    })
    .catch(() => cache?.data ?? fallbackDirectory)
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * Non-blocking read used by page rendering: returns whatever is already known
 * (cache, else the static registry) instantly and refreshes in the background.
 * Page loads never wait on outbound probes.
 */
export function getDirectorySnapshot(): ResolvedProject[] {
  const fresh = cache && Date.now() - cache.at < TTL_MS;
  if (!fresh && !inFlight) {
    void resolveProjectDirectory().catch(() => undefined);
  }
  return cache?.data ?? fallbackDirectory;
}
