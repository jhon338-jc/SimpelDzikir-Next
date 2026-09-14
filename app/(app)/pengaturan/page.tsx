"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/client/store";
import { subscribePush, unsubscribePush } from "@/lib/client/sw";

export default function PengaturanPage() {
  const { settings, setSetting, toast, user, streak } = useApp();
  const [pushTest, setPushTest] = useState<"idle" | "loading" | "ok" | "err">("idle");

  useEffect(() => {
    const pushReady = (() => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return false;
      return true;
    })();
    if (pushReady && !settings.pushEnabled) {
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (sub) setSetting({ pushEnabled: true });
        })
        .catch(() => {});
    }
  }, [settings.pushEnabled, setSetting]);

  async function togglePush() {
    if (!settings.pushEnabled) {
      const res = await subscribePush("");
      if (res.ok) {
        setSetting({ pushEnabled: true });
        toast("Notifikasi diaktifkan", "success");
      } else toast(res.error || "Gagal", "error");
    } else {
      await unsubscribePush();
      setSetting({ pushEnabled: false });
      toast("Notifikasi dimatikan", "info");
    }
  }

  async function testPush() {
    setPushTest("loading");
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setPushTest("ok");
        toast(data.sent > 0 ? `Notifikasi uji terkirim (${data.sent} device)` : "Tidak ada device terdaftar", data.sent > 0 ? "success" : "info");
      } else {
        setPushTest("err");
        toast("Gagal kirim notifikasi", "error");
      }
    } catch {
      setPushTest("err");
      toast("Gagal kirim notifikasi", "error");
    }
  }

  return (
    <>
      <section className="setings-section">
        <h3><i className="fas fa-palette"></i> Tampilan</h3>
        <div className="setting-row">
          <span>Mode Gelap</span>
          <label className="switch">
            <input type="checkbox" checked={settings.darkMode} onChange={() => setSetting({ darkMode: !settings.darkMode })} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <span>Ukuran Teks</span>
          <div className="segmented">
            {(["small", "medium", "large"] as const).map((s) => (
              <button key={s} className={settings.fontSize === s ? "active" : ""} onClick={() => setSetting({ fontSize: s })}>
                {s === "small" ? "Kecil" : s === "medium" ? "Sedang" : "Besar"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="setings-section">
        <h3><i className="fas fa-volume-up"></i> Audio & Getaran</h3>
        <div className="setting-row">
          <span>Suara aplikasi</span>
          <label className="switch">
            <input type="checkbox" checked={settings.soundEnabled} onChange={() => setSetting({ soundEnabled: !settings.soundEnabled })} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <span>Volume ({Math.round(settings.volume * 100)}%)</span>
          <input
            type="range" min={0} max={100} value={Math.round(settings.volume * 100)}
            onChange={(e) => setSetting({ volume: Number(e.target.value) / 100 })}
          />
        </div>
        <div className="setting-row">
          <span>Nada (tinggi)</span>
          <input
            type="range" min={1} max={4} value={settings.soundPitch}
            onChange={(e) => setSetting({ soundPitch: Number(e.target.value) })}
          />
        </div>
        <div className="setting-row">
          <span>Suara penghitung tasbih</span>
          <label className="switch">
            <input type="checkbox" checked={settings.dzikirSound} onChange={() => setSetting({ dzikirSound: !settings.dzikirSound })} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <span>Getar tasbih</span>
          <label className="switch">
            <input type="checkbox" checked={settings.tasbihVibrate} onChange={() => setSetting({ tasbihVibrate: !settings.tasbihVibrate })} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <span>Putar otomatis audio doa</span>
          <label className="switch">
            <input type="checkbox" checked={settings.autoplayDoa} onChange={() => setSetting({ autoplayDoa: !settings.autoplayDoa })} />
            <span className="slider"></span>
          </label>
        </div>
      </section>

      <section className="setings-section">
        <h3><i className="fas fa-bell"></i> Notifikasi</h3>
        <div className="setting-row">
          <span>Notifikasi push</span>
          <label className="switch">
            <input type="checkbox" checked={settings.pushEnabled} onChange={togglePush} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-row">
          <span>Notifikasi waktu sholat (push)</span>
          <label className="switch">
            <input type="checkbox" checked={settings.pushAdhan} onChange={() => setSetting({ pushAdhan: !settings.pushAdhan })} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="action-row">
          <button className="btn-outline" onClick={testPush} disabled={pushTest === "loading"}>
            <i className="fas fa-paper-plane"></i>
            {pushTest === "loading" ? "Mengirim…" : "Kirim Notifikasi Uji"}
          </button>
        </div>
      </section>

      <section className="setings-section">
        <h3><i className="fas fa-user"></i> Akun & Sinkronisasi</h3>
        <div className="setting-row">
          <span>Masuk sebagai</span>
          <strong>{user?.name || "—"}</strong>
        </div>
        <div className="setting-row">
          <span>Email</span>
          <strong>{user?.email || "—"}</strong>
        </div>
        <div className="setting-row">
          <span>Streak dzikir harian</span>
          <strong>{streak} hari 🔥</strong>
        </div>
        <p className="setting-note">
          Favorit, pengaturan, dan progres dzikir disinkronkan otomatis ke akun Anda di semua perangkat.
        </p>
      </section>
    </>
  );
}