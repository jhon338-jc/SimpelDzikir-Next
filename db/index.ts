import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import path from "node:path";
import * as schema from "./schema";

// Koneksi ganda: produksi = Turso (URL + token), lokal = file SQLite.
function connectionUrl(): string {
  const tursoUrl = process.env.TURSO_URL || process.env.TURSO_DATABASE_URL;
  if (tursoUrl) return tursoUrl;
  const file = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "simpledzikir.db");
  if (typeof window === "undefined") {
    try {
      mkdirSync(path.dirname(file), { recursive: true });
    } catch {
      /* read-only fs */
    }
  }
  return `file:${file}`;
}

function makeClient() {
  const url = connectionUrl();
  if (process.env.TURSO_URL || process.env.TURSO_DATABASE_URL) {
    return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  return createClient({ url });
}

// Singleton koneksi agar tidak bocor saat hot-reload
const globalForDb = globalThis as unknown as { client?: ReturnType<typeof makeClient> };

const client = globalForDb.client ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });

// Migrasi sederhana: buat tabel bila belum ada (CREATE TABLE IF NOT EXISTS)
const MIGRATION_SQL = `
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified INTEGER NOT NULL,
      image TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at INTEGER,
      refresh_token_expires_at INTEGER,
      scope TEXT,
      password TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS favorite (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      item_id TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'doa',
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS fav_user_idx ON favorite(user_id, item_id);
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      checked_items TEXT NOT NULL DEFAULT '[]',
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS progress_user_date_idx ON progress(user_id, date);
    CREATE TABLE IF NOT EXISTS setting (
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      key TEXT NOT NULL,
      value TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS setting_user_key_idx ON setting(user_id, key);
    CREATE TABLE IF NOT EXISTS push_subscription (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      endpoint TEXT NOT NULL UNIQUE,
      keys_p256dh TEXT NOT NULL,
      keys_auth TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Jakarta',
      lat TEXT NOT NULL DEFAULT '-6.2088',
      lon TEXT NOT NULL DEFAULT '106.8456',
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS push_user_idx ON push_subscription(user_id);
  `;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runMigrations() {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      // Beri waktu tunggu agar antrean tulis (mis. build multi-worker) saling menunggu
      await client.execute("PRAGMA busy_timeout = 10000").catch(() => {});
      await client.executeMultiple(MIGRATION_SQL);
      return;
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      const busy = /SQLITE_BUSY|locked/i.test(msg);
      if (busy && attempt < 4) {
        await sleep(500 * (attempt + 1));
        continue;
      }
      // Abaikan di lingkungan read-only / build; tabel akan dibuat saat runtime
      if (process.env.NODE_ENV === "development") {
        console.warn("[db] runMigrations gagal:", msg);
      }
      return;
    }
  }
}

// Jalankan saat bootstrap, fire-and-forget: kegagalan (read-only fs / build /
// lock antar-worker) tidak memblokir route, semua ditangani di dalam runMigrations.
void runMigrations();