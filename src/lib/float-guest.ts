// Guest mode: keeps Float numbers in this browser only (adapted from the Float app's peek-stash).
import type { SharePayload } from "@/lib/float-share";

const KEY = "skyco.float.guest.v1";

export function readGuest(): SharePayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SharePayload>;
    const pick = (rows: unknown) =>
      Array.isArray(rows) ? rows.filter((r) => r && typeof r.name === "string" && Number.isFinite(Number(r.amount)) && typeof r.date === "string") : [];
    return { income: pick(parsed.income), bills: pick(parsed.bills), bnpl: pick(parsed.bnpl) };
  } catch {
    return null;
  }
}

export function saveGuest(data: SharePayload): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: Float still works for this visit */
  }
}

export function clearGuest(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
