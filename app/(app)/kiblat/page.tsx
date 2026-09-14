"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/client/store";
import { CITIES, CITY_MAP } from "@/lib/cities";
import { qiblaAngle, distanceToKaaba, normalizeDeg } from "@/lib/kiblat";

export default function KiblatPage() {
  const { settings, setSetting, toast } = useApp();
  const city = CITY_MAP[settings.city] ?? CITIES[0];

  const [useGps, setUseGps] = useState(settings.useGps);
  const [coords, setCoords] = useState<{ lat: number; lon: number; active: boolean }>({ lat: city.lat, lon: city.lon, active: false });
  const [heading, setHeading] = useState(0);
  const [compassActive, setCompassActive] = useState(false);
  const compassRef = useRef<HTMLDivElement>(null);
  const listenerRef = useRef<{ remove: () => void } | null>(null);

  const angle = useMemo(() => normalizeDeg(qiblaAngle(coords.lat, coords.lon)), [coords.lat, coords.lon]);
  const distance = useMemo(() => distanceToKaaba(coords.lat, coords.lon), [coords.lat, coords.lon]);
  const rotation = useMemo(() => normalizeDeg(angle - heading), [angle, heading]);

  useEffect(() => {
    setCoords({ lat: city.lat, lon: city.lon, active: false });
  }, [city]);

  useEffect(() => {
    if (!useGps) return;
    if (!("geolocation" in navigator)) {
      toast("GPS tidak didukung", "error");
      setUseGps(false);
      setSetting({ useGps: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, active: true }),
      () => {
        toast("Izin lokasi ditolak", "error");
        setUseGps(false);
        setSetting({ useGps: false });
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [useGps, setSetting, toast]);

  const startCompass = useCallback(() => {
    if (!("DeviceOrientationEvent" in window)) {
      toast("Kompas tidak didukung perangkat ini", "error");
      return;
    }
    stopCompass();
    const handler = (e: DeviceOrientationEvent) => {
      const evt = e as unknown as { webkitCompassHeading?: number; alpha?: number | null; absolute?: boolean };
      if (evt.absolute === true && evt.webkitCompassHeading !== undefined) {
        setHeading(evt.webkitCompassHeading);
        setCompassActive(true);
      } else if (typeof e.alpha === "number") {
        setHeading(360 - e.alpha);
        setCompassActive(true);
      }
    };
    window.addEventListener("deviceorientation", handler);
    listenerRef.current = { remove: () => window.removeEventListener("deviceorientation", handler) };
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((r: string) => {
          if (r !== "granted") toast("Izin kompas ditolak", "info");
        })
        .catch(() => {});
    }
  }, []);

  const stopCompass = useCallback(() => {
    listenerRef.current?.remove();
    listenerRef.current = null;
    setCompassActive(false);
  }, []);

  useEffect(() => {
    return () => listenerRef.current?.remove();
  }, []);

  useEffect(() => {
    if (!compassRef.current) return;
    compassRef.current.style.transform = `rotate(${-rotation}deg)`;
  }, [rotation]);

  return (
    <>
      <section className="kiblat-compass-card">
        <div className="compass-ring" ref={compassRef}>
          <div className="compass-north"><span>U</span></div>
          <div className="compass-dial">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`tick tick-${i}`} style={{ transform: `rotate(${i * 30}deg) translateY(-118px)` }}></span>
            ))}
          </div>
          <div className="compass-center">
            <i className="fas fa-caret-up"></i>
            <strong>{heading.toFixed(0)}°</strong>
          </div>
        </div>
        <div className="kiblat-arrow-wrap" style={{ transform: `rotate(${rotation}deg)` }}>
          <i className="fas fa-location-arrow kiblat-arrow"></i>
        </div>
        <div className="kiblat-info">
          <h2 id="qiblaAngle">{angle}°</h2>
          <p>Arah Kiblat dari Lokasi Anda</p>
          <p className="distance">
            <i className="fas fa-map-marker-alt"></i> {distance} km ke Ka&apos;bah
          </p>
          <p className="coords">
            {coords.active ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)} (GPS)` : `${city.city}, ${city.province}`}
          </p>
        </div>
        <div className="compass-actions">
          <button className="btn-primary" onClick={compassActive ? stopCompass : startCompass}>
            <i className={`fas ${compassActive ? "fa-hand-pointer" : "fa-compass"}`}></i>
            {compassActive ? "Matikan Kompas" : "Aktifkan Kompas"}
          </button>
        </div>
      </section>

      <section className="location-bar">
        <div className="gps-toggle">
          <label className="switch">
            <input type="checkbox" checked={useGps} onChange={() => { setUseGps(!useGps); setSetting({ useGps: !useGps }); }} />
            <span className="slider"></span>
          </label>
          <span>{useGps ? "Lokasi GPS" : "Pilih Kota"}</span>
        </div>
        {!useGps && (
          <select value={city.key} onChange={(e) => setSetting({ city: e.target.value })} className="city-select">
            {CITIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.city} · {c.province}
              </option>
            ))}
          </select>
        )}
      </section>
    </>
  );
}