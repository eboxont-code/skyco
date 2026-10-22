import { CURRENCIES } from "@/lib/rates.functions";

/**
 * Browser storage for CurrenSee preferences. Everything is optional: when
 * storage is blocked every helper falls back to empty values and writes are
 * ignored, so the converter keeps working.
 */

export type Pair = { from: string; to: string };

const FAVORITES_KEY = "skyco.currensee.favorites";
const DEFAULT_KEY = "skyco.currensee.default";
const SAVED_KEY = "skyco.currensee.saved";
const ALERTS_KEY = "skyco.currensee.alerts";
const ALERT_INTERVAL_KEY = "skyco.currensee.alertInterval";
const ALERT_HISTORY_KEY = "skyco.currensee.alertHistory";

function validPair(p: unknown): p is Pair {
  return (
    Boolean(p) &&
    typeof p === "object" &&
    typeof (p as Pair).from === "string" &&
    typeof (p as Pair).to === "string" &&
    CURRENCIES.includes((p as Pair).from) &&
    CURRENCIES.includes((p as Pair).to)
  );
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage is optional. */
  }
}

export function getFavorites(): Pair[] {
  const saved = read<unknown>(FAVORITES_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter(validPair).slice(0, 12);
}

export function isFavorite(pair: Pair): boolean {
  return getFavorites().some((p) => p.from === pair.from && p.to === pair.to);
}

export function toggleFavorite(pair: Pair): Pair[] {
  const current = getFavorites();
  const exists = current.some((p) => p.from === pair.from && p.to === pair.to);
  const next = exists
    ? current.filter((p) => !(p.from === pair.from && p.to === pair.to))
    : [pair, ...current].slice(0, 12);
  write(FAVORITES_KEY, next);
  return next;
}

export function getDefaultPair(): Pair | null {
  const saved = read<unknown>(DEFAULT_KEY, null);
  return validPair(saved) ? saved : null;
}

export function setDefaultPair(pair: Pair) {
  write(DEFAULT_KEY, pair);
}

export type SavedConversion = {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  asOf: string;
  source: string;
  at: string;
};

export function getSavedConversions(): SavedConversion[] {
  const saved = read<unknown>(SAVED_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved
    .filter(
      (s): s is SavedConversion =>
        Boolean(s) &&
        typeof s === "object" &&
        validPair(s) &&
        typeof (s as SavedConversion).amount === "number" &&
        typeof (s as SavedConversion).result === "number" &&
        typeof (s as SavedConversion).rate === "number" &&
        typeof (s as SavedConversion).asOf === "string" &&
        typeof (s as SavedConversion).source === "string" &&
        typeof (s as SavedConversion).at === "string",
    )
    .slice(0, 20);
}

export function saveConversion(entry: SavedConversion): SavedConversion[] {
  const next = [entry, ...getSavedConversions()].slice(0, 20);
  write(SAVED_KEY, next);
  return next;
}

export function clearSavedConversions() {
  write(SAVED_KEY, []);
}

export type RateAlert = {
  id: string;
  from: string;
  to: string;
  direction: "above" | "below";
  threshold: number;
  enabled: boolean;
  lastRate?: number;
  lastCheckedAt?: string;
  triggeredAt?: string;
};

export function getAlerts(): RateAlert[] {
  const saved = read<unknown>(ALERTS_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved
    .filter(
      (a): a is RateAlert =>
        Boolean(a) &&
        typeof a === "object" &&
        typeof (a as RateAlert).id === "string" &&
        validPair(a) &&
        ((a as RateAlert).direction === "above" || (a as RateAlert).direction === "below") &&
        typeof (a as RateAlert).threshold === "number" &&
        typeof (a as RateAlert).enabled === "boolean",
    )
    .slice(0, 10);
}

export function setAlerts(alerts: RateAlert[]) {
  write(ALERTS_KEY, alerts.slice(0, 10));
}

export function getAlertInterval(): number {
  const saved = read<unknown>(ALERT_INTERVAL_KEY, 15);
  const minutes = typeof saved === "number" ? saved : 15;
  return [5, 15, 30, 60].includes(minutes) ? minutes : 15;
}

export function setAlertInterval(minutes: number) {
  write(ALERT_INTERVAL_KEY, minutes);
}

export type AlertHistoryEntry = {
  alertId: string;
  from: string;
  to: string;
  rate: number;
  threshold: number;
  direction: "above" | "below";
  asOf: string;
  at: string;
};

export function getAlertHistory(): AlertHistoryEntry[] {
  const saved = read<unknown>(ALERT_HISTORY_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved
    .filter(
      (h): h is AlertHistoryEntry =>
        Boolean(h) &&
        typeof h === "object" &&
        typeof (h as AlertHistoryEntry).alertId === "string" &&
        validPair(h) &&
        typeof (h as AlertHistoryEntry).rate === "number" &&
        typeof (h as AlertHistoryEntry).threshold === "number" &&
        typeof (h as AlertHistoryEntry).at === "string",
    )
    .slice(0, 30);
}

export function pushAlertHistory(entry: AlertHistoryEntry) {
  write(ALERT_HISTORY_KEY, [entry, ...getAlertHistory()].slice(0, 30));
}

export function clearAlertHistory() {
  write(ALERT_HISTORY_KEY, []);
}
