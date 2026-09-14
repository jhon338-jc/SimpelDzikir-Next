"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/client/store";
import { CITY_MAP, CITIES } from "@/lib/cities";
import { nextPrayer, countdownTo, formatTimeFromMinutes, type PrayerTimes } from "@/lib/prayer-times";

const MENU = [
  { href: "/panduan", icon: "fa-praying-hands", title: "Panduan Sholat", desc: "Wajib & sunnah lengkap", badge: "Lengkap" },
  { href: "/doa", icon: "fa-book-quran", title: "Kumpulan Doa", desc: "Doa harian lengkap", badge: "Lengkap" },
  { href: "/sholawat", icon: "fa-music", title: "Sholawat", desc: "Kumpulan sholawat Nabi", badge: "Populer" },
  { href: "/jadwal", icon: "fa-calendar-alt", title: "Jadwal Sholat", desc: "5 waktu + Duha & Tahajud", badge: "Real-time" },
  { href: "/kiblat", icon: "fa-compass", title: "Arah Kiblat", desc: "Penunjuk arah kiblat", badge: "Akurat" },
  { href: "/tasbih", icon: "fa-star-of-life", title: "Tasbih Digital", desc: "Penghitung dzikir 33x", badge: "Interaktif" },
  { href: "/dzikir-harian", icon: "fa-sun", title: "Dzikir Pagi & Petang", desc: "Adhkar harian lengkap", badge: "Berkah" },
  { href: "/asmaul", icon: "fa-crown", title: "Asmaul Husna", desc: "99 Nama Allah & artinya", badge: "99 Nama" },
];

export default function BerandaPage() {
  const { user, settings, streak, todayDone, hydrated } = useApp();
  const city = CITY_MAP[settings.city] ?? CITIES[0];
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setTimes(null);
    let stale = false;
    fetch(`/api/prayer-times?lat=${city.lat}&lon=${city.lon}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !stale && setTimes(d.times))
      .catch(() => {});
    return () => {
      stale = true;
    };
  }, [city]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const next = useMemo(() => (times ? nextPrayer(times, now) : null), [times, now]);
  const hour = now.getHours();
  const greeting = hour < 11 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 19 ? "Selamat Sore" : "Selamat Malam";
  const firstName = (user?.name || "").split(" ")[0] || "Saudaraku";

  const tillNext = next ? countdownTo(next.timeMinutes, now, next.name === "Subuh" && now.getMinutes() * 60 + now.getSeconds() >= next.timeMinutes * 60) : "--:--:--";

  return (
    <>
      <div className="hero-section">
        <div className="hero-greeting">
          <h2>
            Assalamu&apos;alaikum, <span>{firstName}</span>
          </h2>
          <p>{greeting}, semoga hari-mu penuh berkah ✨</p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <i className="fas fa-mosque"></i>
            <div>
              <span className="stat-number">5</span>
              <span className="stat-label">Waktu Sholat</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-fire"></i>
            <div>
              <span className="stat-number">{streak}</span>
              <span className="stat-label">Streak Dzikir</span>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <div>
              <span className="stat-number">{todayDone ? "✓" : "–"}</span>
              <span className="stat-label">Adhkar Hari Ini</span>
            </div>
          </div>
        </div>
      </div>

      <div className="next-prayer-card">
        <div className="next-prayer-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="next-prayer-info">
          <span>Waktu Sholat Selanjutnya · {city.city}</span>
          <strong>{next ? next.name : "--"}</strong>
        </div>
        <div className="next-prayer-time">
          <span>{next ? formatTimeFromMinutes(next.timeMinutes) : "--:--"}</span>
          <span className="countdown-small">{hydrated ? tillNext : "--:--:--"}</span>
        </div>
      </div>

      <div className="menu-grid">
        {MENU.map((m) => (
          <Link href={m.href} className="menu-card" key={m.href}>
            <div className="menu-icon">
              <i className={`fas ${m.icon}`}></i>
            </div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
            <span className="menu-badge">{m.badge}</span>
          </Link>
        ))}
      </div>

      <div className="quick-actions">
        <Link href="/jadwal" className="quick-btn">
          <i className="fas fa-stopwatch"></i>
          <div>
            <span>Waktu Sholat</span>
            <strong>
              {next ? `${next.name} ${formatTimeFromMinutes(next.timeMinutes)}` : "--"}
            </strong>
          </div>
          <i className="fas fa-chevron-right"></i>
        </Link>
      </div>

      <div className="quote-card">
        <i className="fas fa-quote-right"></i>
        <p>&ldquo;Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain&rdquo;</p>
        <span>— HR. Thabrani</span>
      </div>
    </>
  );
}