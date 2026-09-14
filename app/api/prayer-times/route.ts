import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { fetchPrayerTimes } from "@/lib/prayer-times";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? "0");
  const lon = Number(searchParams.get("lon") ?? "0");

  let authenticated = false;
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    authenticated = !!session;
  } catch {
    authenticated = false;
  }

  if (lat === 0 && lon === 0) {
    return NextResponse.json(
      { error: "Parameter lat & lon wajib diisi" },
      { status: 400 }
    );
  }

  try {
    const times = await fetchPrayerTimes(lat, lon);
    return NextResponse.json({ times, authenticated });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil jadwal sholat" }, { status: 502 });
  }
}