export const KAABA_LAT = 21.4225;
export const KAABA_LON = 39.8262;

// Bearing dari lokasi pengguna ke Ka'bah (derajat)
export function qiblaAngle(lat: number, lon: number): number {
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;
  const lat2 = (KAABA_LAT * Math.PI) / 180;
  const lon2 = (KAABA_LON * Math.PI) / 180;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

// Jarak haversine ke Ka'bah (km)
export function distanceToKaaba(lat: number, lon: number): number {
  const R = 6371;
  const dlat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dlon = ((KAABA_LON - lon) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos((lat * Math.PI) / 180) * Math.cos((KAABA_LAT * Math.PI) / 180) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Normalisasi sudut ke [0, 360)
export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}