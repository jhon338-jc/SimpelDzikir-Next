import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { pushSubscription } from "@/db/schema";
import { sendPush } from "@/lib/webpush";
import { fetchPrayerTimes, MAIN_PRAYERS, inferTz } from "@/lib/prayer-times";

export const runtime = "nodejs";
export const maxDuration = 60;

// Vercel Cron (mis. setiap menit): kirim notifikasi saat waktu sholat tiba.
// Dipanggil dengan header Authorization: Bearer <CRON_SECRET>.
// Agar tidak spam, cukup kirim max 1 notifikasi per waktu (dijaga by endpoint lastSent).
export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const subs = await db
    .select({
      endpoint: pushSubscription.endpoint,
      keysP256dh: pushSubscription.keysP256dh,
      keysAuth: pushSubscription.keysAuth,
      lat: pushSubscription.lat,
      lon: pushSubscription.lon,
      city: pushSubscription.city,
    })
    .from(pushSubscription)
    .all();

  if (!subs.length) return NextResponse.json({ ok: true, sent: 0, message: "Tidak ada pelanggan" });

  // Ambil jadwal untuk tiap koordinat (pakai cache dalam 1 run)
  const cache = new Map<string, Record<string, string>>();
  const now = new Date();
  let sent = 0;

  for (const s of subs) {
    const key = `${s.lat},${s.lon}`;
    if (!cache.has(key)) {
      const times = await fetchPrayerTimes(Number(s.lat), Number(s.lon));
      cache.set(key, flattenTimes(times));
    }
    const times = cache.get(key)!;
    const tz = inferTz(Number(s.lon));
    const hhmm = now.toLocaleTimeString("id-ID", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
    const tzName = tz === "Asia/Makassar" ? "WITA" : tz === "Asia/Jayapura" ? "WIT" : "WIB";
    for (const p of MAIN_PRAYERS) {
      if (times[p.key] === hhmm) {
        const result = await sendPush(
          { endpoint: s.endpoint, keys: { p256dh: s.keysP256dh, auth: s.keysAuth } },
          `Waktunya Sholat ${p.name}`,
          `Jadwal ${p.name} pukul ${hhmm} ${tzName} (${s.city}). Segera tunaikan sholat.`
        );
        if (result === "sent") sent++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, total: subs.length });
}

function flattenTimes(t: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of MAIN_PRAYERS) out[p.key] = t[p.key];
  return out;
}