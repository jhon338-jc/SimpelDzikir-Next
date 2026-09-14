export type PrayerTimes = {
  imsak: string;
  subuh: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  tahajud: string;
};

export const PRAYER_ORDER: { key: keyof PrayerTimes; name: string; icon: string }[] = [
  { key: "imsak", name: "Imsak", icon: "fa-cloud-sun" },
  { key: "subuh", name: "Subuh", icon: "fa-sun" },
  { key: "dhuha", name: "Dhuha", icon: "fa-cloud-sun" },
  { key: "dzuhur", name: "Dzuhur", icon: "fa-sun" },
  { key: "ashar", name: "Ashar", icon: "fa-sun" },
  { key: "maghrib", name: "Maghrib", icon: "fa-moon" },
  { key: "isya", name: "Isya", icon: "fa-star" },
  { key: "tahajud", name: "Tahajud", icon: "fa-moon" },
];

export const MAIN_PRAYERS: { name: string; key: keyof PrayerTimes }[] = [
  { name: "Subuh", key: "subuh" },
  { name: "Dzuhur", key: "dzuhur" },
  { name: "Ashar", key: "ashar" },
  { name: "Maghrib", key: "maghrib" },
  { name: "Isya", key: "isya" },
];

export function addMinutes(hhmm: string, minutes: number): string {
  const p = hhmm.split(":").map(Number);
  const total = (p[0] || 0) * 60 + (p[1] || 0) + minutes;
  const H = ((Math.floor(total / 60) % 24) + 24) % 24;
  const M = ((total % 60) + 60) % 60;
  return String(H).padStart(2, "0") + ":" + String(M).padStart(2, "0");
}

export function parseTime(hhmm: string): number {
  if (!hhmm) return 0;
  const p = hhmm.split(":").map(Number);
  return p[0] * 60 + p[1];
}

export function formatTimeFromMinutes(minutes: number): string {
  const h = ((Math.floor(minutes / 60) % 24) + 24) % 24;
  const m = ((minutes % 60) + 60) % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

export function formatTime(baseHour: number, minuteValue: number): string {
  const h = (baseHour + Math.floor(minuteValue / 60)) % 24;
  const m = Math.abs(minuteValue % 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

// Est. waktu sholat (bukan hisab penuh — hanya fallback offline)
export function calculatePrayerTimes(date: Date, tz: string): PrayerTimes {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  let tzOffset = 0;
  if (tz === "Asia/Jayapura") tzOffset = 2;
  else if (tz === "Asia/Makassar") tzOffset = 1;
  const subuhOffset = Math.sin((dayOfYear * Math.PI) / 365) * 30;

  return {
    imsak: formatTime(4, 25 + tzOffset),
    subuh: formatTime(4, 40 + Math.floor(subuhOffset / 60) + tzOffset + (subuhOffset % 60)),
    dhuha: formatTime(6, 30 + tzOffset),
    dzuhur: formatTime(12, 0 + tzOffset),
    ashar: formatTime(15, 15 + tzOffset),
    maghrib: formatTime(18, 0 + tzOffset),
    isya: formatTime(19, 15 + tzOffset),
    tahajud: formatTime(2, 0 + tzOffset),
  };
}

// Normalisasi hasil Aladhan -> PrayerTimes
export function fromAladhan(t: Record<string, string>): PrayerTimes {
  return {
    imsak: t.Imsak || "--:--",
    subuh: t.Fajr || "--:--",
    dhuha: addMinutes(t.Sunrise || "06:00", 15),
    dzuhur: t.Dhuhr || "--:--",
    ashar: t.Asr || "--:--",
    maghrib: t.Maghrib || "--:--",
    isya: t.Isha || "--:--",
    tahajud: t.Midnight || "02:00",
  };
}

// Sholat selanjutnya (hanya 5 waktu utama)
export function nextPrayer(times: PrayerTimes, now: Date): { name: string; timeMinutes: number } {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (const p of MAIN_PRAYERS) {
    const t = parseTime(times[p.key]);
    if (t > currentMinutes) return { name: p.name, timeMinutes: t };
  }
  const first = MAIN_PRAYERS[0];
  return { name: first.name, timeMinutes: parseTime(times[first.key]) };
}

export function countdownTo(nextMinutes: number, now: Date, isNextDay = false): string {
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  let diff = nextMinutes * 60 - currentSeconds;
  if (isNextDay || diff <= 0) diff += 24 * 3600;
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// Server-side: ambil dari Aladhan (method 19 = KEMENAG), fallback estimasi
export async function fetchPrayerTimes(lat: number, lon: number): Promise<PrayerTimes> {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const url =
    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}` +
    `?latitude=${lat}&longitude=${lon}&method=19&latitudeAdjustmentMethod=3`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("upstream error");
    const json = await res.json();
    return fromAladhan(json.data?.timings);
  } catch {
    return calculatePrayerTimes(new Date(), inferTz(lon));
  }
}

function inferTz(lon: number): string {
  if (lon > 125) return "Asia/Jayapura";
  if (lon > 115) return "Asia/Makassar";
  return "Asia/Jakarta";
}

export { inferTz };