import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { favorite, progress, setting, pushSubscription } from "@/db/schema";
import { toDateKey } from "@/lib/utils";

export { toDateKey };

// ===== Favorit =====
export async function getFavorites(userId: string, kind: string): Promise<string[]> {
  const rows = await db
    .select({ itemId: favorite.itemId })
    .from(favorite)
    .where(and(eq(favorite.userId, userId), eq(favorite.kind, kind)))
    .all();
  return rows.map((r) => r.itemId);
}

export async function toggleFavorite(userId: string, kind: string, itemId: string): Promise<boolean> {
  const existing = await db
    .select({ id: favorite.id })
    .from(favorite)
    .where(and(eq(favorite.userId, userId), eq(favorite.kind, kind), eq(favorite.itemId, itemId)))
    .get();

  if (existing) {
    await db.delete(favorite).where(eq(favorite.id, existing.id)).run();
    return false;
  }

  await db
    .insert(favorite)
    .values({
      id: crypto.randomUUID(),
      userId,
      itemId,
      kind,
      createdAt: new Date(),
    })
    .run();
  return true;
}

export async function setFavoritesBulk(userId: string, kind: string, itemIds: string[]): Promise<void> {
  const current = await getFavorites(userId, kind);
  const toRemove = current.filter((id) => !itemIds.includes(id));
  const toAdd = itemIds.filter((id) => !current.includes(id));

  for (const id of toRemove)
    await db
      .delete(favorite)
      .where(and(eq(favorite.userId, userId), eq(favorite.kind, kind), eq(favorite.itemId, id)))
      .run();
  for (const id of toAdd)
    await db.insert(favorite).values({ id: crypto.randomUUID(), userId, itemId: id, kind, createdAt: new Date() }).run();
}

// ===== Pengaturan =====
export async function getSettings(userId: string): Promise<Record<string, string>> {
  const rows = await db.select({ key: setting.key, value: setting.value }).from(setting).where(eq(setting.userId, userId)).all();
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function setSettings(userId: string, values: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    const existing = await db.select({ userId: setting.userId }).from(setting).where(and(eq(setting.userId, userId), eq(setting.key, key))).get();
    if (existing) {
      await db.update(setting).set({ value }).where(and(eq(setting.userId, userId), eq(setting.key, key))).run();
    } else {
      await db.insert(setting).values({ userId, key, value }).run();
    }
  }
}

// ===== Progres dzikir harian =====
export async function getProgress(userId: string, date: string) {
  const row = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.date, date)))
    .get();
  return row ?? null;
}

export async function setProgress(userId: string, date: string, checkedItems: string[], doneValue: boolean) {
  const existing = await getProgress(userId, date);
  const payload = {
    checkedItems: JSON.stringify(checkedItems),
    done: doneValue,
    updatedAt: new Date(),
  };
  if (existing) {
    await db.update(progress).set(payload).where(and(eq(progress.userId, userId), eq(progress.date, date))).run();
  } else {
    await db.insert(progress).values({ id: crypto.randomUUID(), userId, date, ...payload }).run();
  }
}

// Streak beruntun (hari berturut-turut yang ada progres selesai)
export async function getStreak(userId: string): Promise<{ streak: number; lastDate: string | null }> {
  const rows = (
    await db
      .select({ date: progress.date })
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.done, true)))
      .all()
  )
    .map((r) => r.date)
    .sort();

  if (!rows.length) return { streak: 0, lastDate: null };

  let streak = 0;
  const last = new Date(rows[rows.length - 1]);
  const cursor = new Date(last);
  const seen = new Set(rows);
  while (seen.has(toDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { streak, lastDate: rows[rows.length - 1] };
}

// ===== Push subscription =====
export function guessCity(lat: number, lon: number): { city: string; lat: number; lon: number } {
  const cities: { city: string; lat: number; lon: number }[] = [
    { city: "Jakarta", lat: -6.2088, lon: 106.8456 },
    { city: "Surabaya", lat: -7.2575, lon: 112.7521 },
    { city: "Bandung", lat: -6.9175, lon: 107.6191 },
    { city: "Medan", lat: 3.5952, lon: 98.6722 },
    { city: "Makassar", lat: -5.1477, lon: 119.4327 },
    { city: "Semarang", lat: -6.9667, lon: 110.4167 },
    { city: "Yogyakarta", lat: -7.7956, lon: 110.3695 },
    { city: "Palembang", lat: -2.9761, lon: 104.7754 },
    { city: "Denpasar", lat: -8.4095, lon: 115.1889 },
    { city: "Banda Aceh", lat: 5.5483, lon: 95.3238 },
  ];
  let best = cities[0];
  let bestDist = Infinity;
  for (const c of cities) {
    const d = Math.pow(c.lat - lat, 2) + Math.pow(c.lon - lon, 2);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

export async function userHasSubscription(userId: string, endpoint: string): Promise<boolean> {
  const row = await db
    .select({ id: pushSubscription.id })
    .from(pushSubscription)
    .where(and(eq(pushSubscription.userId, userId), eq(pushSubscription.endpoint, endpoint)))
    .get();
  return !!row;
}

export async function deleteSubscription(endpoint: string): Promise<void> {
  await db.delete(pushSubscription).where(eq(pushSubscription.endpoint, endpoint)).run();
}