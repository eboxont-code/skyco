export type NrbDay = { date: string; rates: { currency: { iso3: string; name?: string; unit: number }; buy: string; sell: string }[] };
type NrbPayload = { days: NrbDay[]; fallback: boolean };

// Keep only provider-published, usable rows. Never substitute a peg or a made-up rate.
function publishedDays(json: unknown, today: string): NrbDay[] {
  const payload = (json as { data?: { payload?: unknown } } | null)?.data?.payload;
  if (!Array.isArray(payload)) return [];
  return payload.flatMap((day: NrbDay) => {
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || day.date > today || !Array.isArray(day.rates)) return [];
    const rates = day.rates.filter(row => row?.currency && /^[A-Z]{3}$/.test(row.currency.iso3) &&
      [Number(row.buy), Number(row.sell), Number(row.currency.unit)].every(value => Number.isFinite(value) && value > 0));
    return rates.length ? [{ date: day.date, rates }] : [];
  }).sort((a, b) => a.date.localeCompare(b.date));
}

export function createNrbLoader(request: typeof fetch = fetch, now: () => number = Date.now) {
  let cache: { expires: number; days: NrbDay[]; fallback: boolean } | undefined;
  return async (): Promise<NrbPayload> => {
    const time = now();
    if (cache && cache.expires > time) return { days: cache.days, fallback: cache.fallback };
    const today = new Date(time).toISOString().slice(0, 10);
    const from = new Date(time - 35 * 86400000).toISOString().slice(0, 10);
    const base = "https://www.nrb.org.np/api/forex/v1/rates";
    let days: NrbDay[] = [];
    let fallback = false;
    for (const url of [ `${base}?page=1&per_page=100&from=${from}&to=${today}`, `${base}?page=1&per_page=1` ]) {
      try {
        const response = await request(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) throw new Error("NRB unavailable");
        days = publishedDays(await response.json(), today);
        if (!days.length) throw new Error("NRB unavailable");
        break;
      } catch {
        fallback = true;
      }
    }
    // A refresh outage must not erase the last successful published payload.
    const cachedLatest = cache?.days.at(-1)?.date;
    if (cachedLatest && (!days.length || cachedLatest > (days.at(-1)?.date ?? ""))) {
      days = cache?.days ?? [];
      fallback = true;
    }
    if (!days.length) throw new Error("Reference rates unavailable");
    fallback = fallback || days.at(-1)?.date !== today;
    cache = { days, fallback, expires: time + (fallback ? 60_000 : 3_600_000) };
    return { days, fallback };
  };
}

export const loadNrbDays = createNrbLoader();