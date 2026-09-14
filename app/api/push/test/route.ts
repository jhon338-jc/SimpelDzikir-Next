import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { pushSubscription } from "@/db/schema";
import { sendPush, isVapidConfigured } from "@/lib/webpush";

export const runtime = "nodejs";

// Kirim push test ke semua device pengguna
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isVapidConfigured()) {
    return NextResponse.json(
      { error: "VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY belum di-set di environment" },
      { status: 503 }
    );
  }

  const userId = session.user.id as string;
  const subs = await db
    .select({
      endpoint: pushSubscription.endpoint,
      keysP256dh: pushSubscription.keysP256dh,
      keysAuth: pushSubscription.keysAuth,
      city: pushSubscription.city,
    })
    .from(pushSubscription)
    .where(eq(pushSubscription.userId, userId))
    .all();

  let sent = 0;
  let failed = 0;
  const dead: string[] = [];
  for (const s of subs) {
    const result = await sendPush(
      { endpoint: s.endpoint, keys: { p256dh: s.keysP256dh, auth: s.keysAuth } },
      "Simpel Dzikir",
      `Uji coba notifikasi berhasil! (${s.city})`
    );
    if (result === "sent") sent++;
    else if (result === "dead") dead.push(s.endpoint);
    else failed++;
  }

  for (const e of dead) await db.delete(pushSubscription).where(eq(pushSubscription.endpoint, e)).run();

  return NextResponse.json({ ok: true, sent, failed, cleaned: dead.length, total: subs.length });
}