export type City = {
  key: string;
  city: string;
  province: string;
  lat: number;
  lon: number;
  tz: string;
};

export const CITIES: City[] = [
  { key: "jakarta", city: "Jakarta", province: "DKI Jakarta", lat: -6.2088, lon: 106.8456, tz: "Asia/Jakarta" },
  { key: "surabaya", city: "Surabaya", province: "Jawa Timur", lat: -7.2575, lon: 112.7521, tz: "Asia/Jakarta" },
  { key: "bandung", city: "Bandung", province: "Jawa Barat", lat: -6.9175, lon: 107.6191, tz: "Asia/Jakarta" },
  { key: "medan", city: "Medan", province: "Sumatera Utara", lat: 3.5952, lon: 98.6722, tz: "Asia/Jakarta" },
  { key: "makassar", city: "Makassar", province: "Sulawesi Selatan", lat: -5.1477, lon: 119.4327, tz: "Asia/Makassar" },
  { key: "semarang", city: "Semarang", province: "Jawa Tengah", lat: -6.9667, lon: 110.4167, tz: "Asia/Jakarta" },
  { key: "yogyakarta", city: "Yogyakarta", province: "DIY Yogyakarta", lat: -7.7956, lon: 110.3695, tz: "Asia/Jakarta" },
  { key: "palembang", city: "Palembang", province: "Sumatera Selatan", lat: -2.9761, lon: 104.7754, tz: "Asia/Jakarta" },
  { key: "bali", city: "Denpasar", province: "Bali", lat: -8.4095, lon: 115.1889, tz: "Asia/Makassar" },
  { key: "aceh", city: "Banda Aceh", province: "Aceh", lat: 5.5483, lon: 95.3238, tz: "Asia/Jakarta" },
];

export const CITY_MAP: Record<string, City> = Object.fromEntries(CITIES.map((c) => [c.key, c]));

export const DEFAULT_CITY = CITIES[0];

export function tzName(tz: string): string {
  if (tz === "Asia/Makassar") return "WITA";
  if (tz === "Asia/Jayapura") return "WIT";
  return "WIB";
}