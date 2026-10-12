// Moved from the Float app (src/lib/peek-share.ts): encodes numbers into a short ?d= link.
import type { Frequency } from "@/lib/float";

export type ShareEntry = { name: string; amount: number; date: string; frequency: Frequency; originalAmount?: number | null; dealEndsOn?: string | null };
export type SharePayload = { income: ShareEntry[]; bills: ShareEntry[]; bnpl: ShareEntry[] };

const FREQUENCIES: Frequency[] = ["weekly", "fortnightly", "monthly"];
type Tuple = [string, number, string, number, number | null, string | null];
const ISO = /^\d{4}-\d{2}-\d{2}$/;

function toTuple(e: ShareEntry): Tuple {
  return [e.name.slice(0, 40), Math.round(e.amount * 100) / 100, e.date, Math.max(0, FREQUENCIES.indexOf(e.frequency)), e.originalAmount ?? null, e.dealEndsOn ?? null];
}

function fromTuple(raw: unknown): ShareEntry | null {
  if (!Array.isArray(raw)) return null;
  const [name, amount, date, freq, original, ends] = raw as Tuple;
  if (typeof name !== "string" || !name.trim()) return null;
  if (!Number.isFinite(Number(amount))) return null;
  if (typeof date !== "string" || !ISO.test(date)) return null;
  return {
    name,
    amount: Number(amount),
    date,
    frequency: FREQUENCIES[Number(freq)] ?? "monthly",
    originalAmount: original !== null && Number.isFinite(Number(original)) ? Number(original) : null,
    dealEndsOn: typeof ends === "string" && ISO.test(ends) ? ends : null,
  };
}

function encode(text: string): string {
  let binary = "";
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeFloatShare(p: SharePayload): string {
  return encode(JSON.stringify({ i: p.income.map(toTuple), b: p.bills.map(toTuple), p: p.bnpl.map(toTuple) }));
}

export function decodeFloatShare(value: string | undefined | null): SharePayload | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decode(value)) as { i?: unknown[]; b?: unknown[]; p?: unknown[] };
    const list = (rows: unknown[] | undefined) => (Array.isArray(rows) ? rows : []).map(fromTuple).filter((r): r is ShareEntry => r !== null);
    const payload = { income: list(parsed.i), bills: list(parsed.b), bnpl: list(parsed.p) };
    return payload.income.length || payload.bills.length || payload.bnpl.length ? payload : null;
  } catch {
    return null;
  }
}
