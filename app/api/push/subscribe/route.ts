import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { pushSubscription } from "@/db/schema";
import { guessCity } from "@/lib/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const body = await request.json().catch(() => ({}));

  const endpoint: string = body.endpoint;
  const keys = body.keys as { p256dh?: string; auth?: string } | undefined;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Payload langganan tidak lengkap" }, { status: 400 });
  }

  let lat = Number(body.lat);
  let lon = Number(body.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    lat = -6.2088;
    lon = 106.8456;
  }

  const loc = guessCity(lat, lon);

  const existing = await db
    .select({ id: pushSubscription.id })
    .from(pushSubscription)
    .where(and(eq(pushSubscription.userId, userId), eq(pushSubscription.endpoint, endpoint)))
    .get();

  if (!existing) {
    await db
      .insert(pushSubscription)
      .values({
        id: crypto.randomUUID(),
        userId,
        endpoint,
        keysP256dh: keys.p256dh,
        keysAuth: keys.auth,
        city: loc.city,
        lat: String(lat),
        lon: String(lon),
        createdAt: new Date(),
      })
      .run();
  }

  return NextResponse.json({ ok: true, city: loc.city });
}