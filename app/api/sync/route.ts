import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getFavorites, getSettings, getProgress, getStreak, setFavoritesBulk, setSettings, setProgress, toDateKey } from "@/lib/server";

export const runtime = "nodejs";

// Ambil semua data pengguna (favorit, pengaturan, progres, streak)
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const today = toDateKey(new Date());

  const [favDoa, favSholawat, todayProgress, streak] = await Promise.all([
    getFavorites(userId, "doa"),
    getFavorites(userId, "sholawat"),
    getProgress(userId, today),
    getStreak(userId),
  ]);

  return NextResponse.json({
    favorites: { doa: favDoa, sholawat: favSholawat },
    settings: await getSettings(userId),
    progress: todayProgress,
    streak,
  });
}

// Simpan data dari perangkat ini (merge)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id as string;
  const body = await request.json().catch(() => ({}));

  if (body.favorites) {
    if (Array.isArray(body.favorites.doa)) await setFavoritesBulk(userId, "doa", body.favorites.doa.map(String));
    if (Array.isArray(body.favorites.sholawat)) await setFavoritesBulk(userId, "sholawat", body.favorites.sholawat.map(String));
  }

  if (body.settings && typeof body.settings === "object") {
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(body.settings)) {
      if (typeof v === "string" || typeof v === "boolean" || typeof v === "number") clean[k] = String(v);
    }
    if (Object.keys(clean).length) await setSettings(userId, clean);
  }

  if (body.progress && typeof body.progress.date === "string" && Array.isArray(body.progress.checkedItems)) {
    await setProgress(userId, body.progress.date, body.progress.checkedItems.map(String), !!body.progress.done);
  }

  return NextResponse.json({ ok: true });
}