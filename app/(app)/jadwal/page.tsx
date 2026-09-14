"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/client/store";
import { CITIES, CITY_MAP, tzName } from "@/lib/cities";
import { PRAYER_ORDER, nextPrayer, countdownTo, formatTimeFromMinutes, type PrayerTimes } from "@/lib/prayer-times";
import { hijriDate } from "@/lib/hijri";
import { subscribePush, unsubscribePush } from "@/lib/client/sw";
import { playBeep } from "@/lib/client/audio";

export default function JadwalPage() {
  const { settings, setSetting, toast } = useApp();
  const city = CITY_MAP[settings.city] ?? CITIES[0];

  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [useGps, setUseGps] = useState(settings.useGps);
  const [gps, setGps] = useState<{ lat: number; lon: number; active: boolean } | null>(null);
  const [now, setNow] = useState(new Date());
  const alarmDinged = useRef<Set<string>>(new Set());

  const lat = gps?.active ? gps.lat : city.lat;
  const lon = gps?.active ? gps.lon : city.lon;

  // GPS
  useEffect(() => {
    if (!useGps) return;
    if (!("geolocation" in navigator)) {
      toast("GPS tidak didukung browser ini", "error");
      setUseGps(false);
      setSetting({ useGps: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lon: pos.coords.longitude, active: true });
      },
      () => {
        toast("Izin lokasi ditolak", "error");
        setUseGps(false);
        setSetting({ useGps: false });
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [useGps, setSetting, toast]);

  // Jadwal
  useEffect(() => {
    setLoading(true);
    setTimes(null);
    let stale = false;
    fetch(`/api/prayer-times?lat=${lat}&lon=${lon}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!stale) {
          setTimes(d.times);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!stale) setLoading(false);
      });
    return () => {
      stale = true;
    };
  }, [lat, lon]);

  // Jam real-time
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // Alarm berbunyi saat waktu sholat tiba (dari pengaturan adzanAlarms)
  useEffect(() => {
    if (!times) return;
    const hhmm = now.toLocaleTimeString("id-ID", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", hour12: false });
    for (const p of PRAYER_ORDER) {
      if (!["subuh", "dzuhur", "ashar", "maghrib", "isya"].includes(p.key)) continue;
      if (times[p.key] === hhmm && settings.adzanAlarms.includes(p.name)) {
        const key = `${p.name}:${hhmm}`;
        if (!alarmDinged.current.has(key)) {
          alarmDinged.current.add(key);
          if (settings.dzikirSound) playBeep(settings.volume, settings.soundPitch);
          toast(`Waktunya sholat ${p.name}`, "success");
        }
      }
    }
    // reset harian bila jam mondar-mandir (jarang)
  }, [now, times, settings.adzanAlarms, settings.dzikirSound, settings.volume, settings.soundPitch, city.tz, toast]);

  const clockTime = now.toLocaleTimeString("id-ID", { timeZone: city.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const clockDate = now.toLocaleDateString("id-ID", { timeZone: city.tz, weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const hijri = useMemo(() => hijriDate(now), [now]);

  const next = useMemo(() => (times ? nextPrayer(times, now) : null), [times, now]);
  const tillNext = next ? countdownTo(next.timeMinutes, now) : "--:--:--";

  function toggleAlarm(name: string) {
    const has = settings.adzanAlarms.includes(name);
    const nextArr = has ? settings.adzanAlarms.filter((n) => n !== name) : [...settings.adzanAlarms, name];
    setSetting({ adzanAlarms: nextArr });
    toast(has ? `Alarm ${name} dimatikan` : `Alarm ${name} diaktifkan`, has ? "info" : "success");
  }

  async function handlePush() {
    if (!settings.pushEnabled) {
      const res = await subscribePush("");
      if (res.ok) {
        setSetting({ pushEnabled: true });
        toast("Notifikasi diaktifkan. Coba via halaman Setelan", "success");
      } else toast(res.error || "Gagal mengaktifkan notifikasi", "error");
    } else {
      setSetting({ pushEnabled: false });
      await unsubscribePush();
      toast("Notifikasi dimatikan", "info");
    }
  }

  return (
    <>
      <section className="clock-section">
        <div className="clock-time" id="clockTime">{clockTime}</div>
        <div className="clock-date" id="clockDate">{clockDate}</div>
        <div className="clock-timezone">
          <span id="clockTimezone">{tzName(city.tz)}</span>
          {!gps?.active && useGps && <span className="gps-status">· GPS</span>}
        </div>
        <div className="hijri-date" id="currentHijri">{hijri}</div>
      </section>

      <section className="location-bar">
        <div className="gps-toggle">
          <label className="switch">
            <input type="checkbox" checked={useGps} onChange={() => { setUseGps(!useGps); setSetting({ useGps: !useGps }); }} />
            <span className="slider"></span>
          </label>
          <span>{useGps ? "Lokasi GPS" : "Pilih Kota"}</span>
        </div>
        {!gps?.active && !useGps && (
          <select
            value={city.key}
            onChange={(e) => setSetting({ city: e.target.value })}
            className="city-select"
          >
            {CITIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.city} · {c.province}
              </option>
            ))}
          </select>
        )}
        {gps?.active && (
          <span className="gps-coords">
            {gps.lat.toFixed(3)}, {gps.lon.toFixed(3)}
          </span>
        )}
      </section>

      {loading ? (
        <div className="loading-hint">Mengambil jadwal…</div>
      ) : (
        <section className="prayer-card">
          <h3>
            <i className="fas fa-clock"></i> Waktu Sholat — {gps?.active ? "Lokasi Anda" : city.city}
          </h3>
          <div className="prayer-grid">
            {PRAYER_ORDER.map((p) => (
              <div className="prayer-card-item" key={p.key}>
                <i className={`fas ${p.icon}`}></i>
                <span className="prayer-name">{p.name}</span>
                <span className="prayer-time" id={p.key}>{times?.[p.key] ?? "--:--"}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="next-prayer-card">
        <div className="next-prayer-icon"><i className="fas fa-hourglass-half"></i></div>
        <div className="next-prayer-info">
          <span>Menuju Waktu Sholat</span>
          <strong>{next ? next.name : "--"}</strong>
        </div>
        <div className="next-prayer-time">
          <span id="countdown">{tillNext}</span>
          <span className="countdown-small">{(next ? formatTimeFromMinutes(next.timeMinutes) : "--:--")} WIB</span>
        </div>
      </section>

      <section className="alarm-section">
        <h3><i className="fas fa-bell"></i> Alarm Waktu Sholat</h3>
        <div className="chips-row">
          {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((n) => (
            <button
              key={n}
              className={`chip ${settings.adzanAlarms.includes(n) ? "chip-active" : ""}`}
              onClick={() => toggleAlarm(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="sound-row">
          <span>Bunyi alarm</span>
          <label className="switch">
            <input type="checkbox" checked={settings.dzikirSound} onChange={() => setSetting({ dzikirSound: !settings.dzikirSound })} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="action-row">
          <button className="btn-outline" onClick={handlePush}>
            <i className={`fas ${settings.pushEnabled ? "fa-bell-slash" : "fa-bell"}`}></i>
            {settings.pushEnabled ? "Matikan Notifikasi" : "Aktifkan Notifikasi"}
          </button>
        </div>
      </section>
    </>
  );
}