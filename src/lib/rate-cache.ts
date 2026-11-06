type DatedRate = { from: string; to: string; rate: number; asOf: string; fetchedAt: string; stale?: boolean };

/** Bounded, optional in-memory snapshots. Expiry triggers refresh, not deletion. */
export function createRateCache<T extends DatedRate>(limit: number, now = Date.now) {
  const entries = new Map<string, { expires: number; result: T }>();
  return async (from: string, to: string, fetchResult: () => Promise<T>): Promise<T> => {
    const key = `${from}:${to}`;
    const cached = entries.get(key);
    if (cached && cached.expires > now()) return { ...cached.result };
    try {
      const result = await fetchResult();
      if (result.from !== from || result.to !== to || !Number.isFinite(result.rate) || result.rate <= 0 || !Number.isFinite(Date.parse(result.asOf)) || !Number.isFinite(Date.parse(result.fetchedAt))) {
        throw new Error("Reference rates unavailable");
      }
      const snapshot = { ...result, stale: result.stale === true };
      if (!entries.has(key) && entries.size >= limit) {
        const oldest = entries.keys().next().value;
        if (oldest !== undefined) entries.delete(oldest);
      }
      entries.set(key, { expires: now() + 60_000, result: snapshot });
      return { ...snapshot };
    } catch (error) {
      if (!cached) throw error;
      return { ...cached.result, stale: true };
    }
  };
}