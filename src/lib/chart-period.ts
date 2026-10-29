export const DEFAULT_CHART_DAYS = 30;

export function chartPeriod<T extends { date: string }>(points: T[], days: 7 | 30): T[] {
  const latest = points.reduce((last, point) => Math.max(last, Date.parse(point.date)), 0);
  if (!Number.isFinite(latest) || latest === 0) return [];
  const cutoff = latest - (days - 1) * 86_400_000;
  return points.filter(point => Date.parse(point.date) >= cutoff && Date.parse(point.date) <= latest);
}