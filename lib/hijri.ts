const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

const INTL_NAMES: Record<string, string> = {
  Muharram: "Muharram",
  Safar: "Safar",
  "Rabiul awal": "Rabiul Awal",
  "Rabiul akhir": "Rabiul Akhir",
  "Jumadil awal": "Jumadil Awal",
  "Jumadil akhir": "Jumadil Akhir",
  Rajab: "Rajab",
  "Sya'ban": "Sya'ban",
  Ramadan: "Ramadan",
  Syawal: "Syawal",
  Dzulqadah: "Dzulqa'dah",
  Dzulhijjah: "Dzulhijjah",
};

// Tanggal Hijriah hari ini ("3 Rabiulakhir 1448 H") via Intl islamic-umalqura
export function hijriDate(date: Date = new Date()): string {
  try {
    const fmt = new Intl.DateTimeFormat("id-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const parts = fmt.formatToParts(date);
    let d = "";
    let m = "";
    let y = "";
    for (const p of parts) {
      if (p.type === "day") d = p.value;
      else if (p.type === "month") m = p.value;
      else if (p.type === "year") y = p.value;
    }
    if (d && m && y) return `${d} ${INTL_NAMES[m] || m} ${y} H`;
  } catch {
    /* fallback di bawah */
  }

  // Fallback kasar
  const jan1 = new Date(date.getFullYear(), 0, 1);
  const est = Math.ceil((date.getTime() - jan1.getTime()) / 86400000) + 20;
  const day = est % 354;
  const month = Math.floor(day / 29.5);
  return `${(day % 30) + 1} ${HIJRI_MONTHS[month] || ""} ${date.getFullYear() - 579} H`;
}