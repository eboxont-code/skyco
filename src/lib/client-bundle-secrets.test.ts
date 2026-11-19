import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Scans the built browser bundle (dist/client) for server-only key names.
// Run after `bun run build`; skipped when no build output exists.
const CLIENT_DIR = join(process.cwd(), "dist", "client");
const FORBIDDEN = ["SUPABASE_SERVICE_ROLE_KEY", "service_role", "COINGECKO_API_KEY", "FRANKFURTER_API_KEY", "NRB_API_KEY"];
// The client library checks the "sb_secret_" prefix as a literal, so only flag an actual key value.
const SECRET_VALUE = /sb_secret_[A-Za-z0-9_-]{10,}/;

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : /\.(js|mjs|css|html|json)$/.test(n) ? [p] : [];
  });
}

describe("client bundle", () => {
  test.skipIf(!existsSync(CLIENT_DIR))("contains no provider or server key names", () => {
    const hits: string[] = [];
    for (const f of files(CLIENT_DIR)) {
      const text = readFileSync(f, "utf8");
      for (const k of FORBIDDEN) if (text.includes(k)) hits.push(`${f}: ${k}`);
      if (SECRET_VALUE.test(text)) hits.push(`${f}: secret key value`);
    }
    expect(hits).toEqual([]);
  });
});
