"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/client/store";
import { playBeep, playComplete, vibrateShort } from "@/lib/client/audio";

const STEPS = [
  { name: "Subhanallah", target: 33 },
  { name: "Alhamdulillah", target: 33 },
  { name: "Allahu Akbar", target: 33 },
];

export default function TasbihPage() {
  const { settings, setSetting, toast, hydrated } = useApp();
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [dummy, setDummy] = useState(new Date()); // render ulang tiap 1 detik

  useEffect(() => {
    const t = window.setInterval(() => setDummy(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  // Reset tiap new day
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("sd:tasbih:date");
    if (savedDate !== today) {
      setCount(0);
      setStep(0);
      localStorage.setItem("sd:tasbih:date", today);
    } else {
      const c = Number(localStorage.getItem(`sd:tasbih:count:${step}`) || 0);
      if (c > 0) setCount(c);
    }
  }, [step]);

  const current = STEPS[step];
  const remain = Math.max(current.target - count, 0);
  const pct = (count / current.target) * 100;

  const save2 = (s: number, c: number) => localStorage.setItem(`sd:tasbih:count:${s}`, String(c));

  function tap() {
    const nc = count + 1;
    if (nc >= current.target) {
      if (settings.tasbihVibrate) vibrateShort([80, 40, 80]);
      if (settings.dzikirSound) playComplete(settings.volume);
      localStorage.setItem(`sd:tasbih:count:${step}`, String(current.target));
      toast(`${current.name} ${current.target}x selesai!`, "success");
      if (step < STEPS.length - 1) {
        setStep(step + 1);
        setCount(0);
      } else {
        setStep(0);
        setCount(0);
        if (settings.dzikirSound) playComplete(settings.volume);
        toast("Tasbih selesai — Alhamdulillah! 🎉", "success");
      }
      return;
    }
    setCount(nc);
    save2(step, nc);
    if (settings.dzikirSound) playBeep(settings.volume > 0.4 ? 0.3 : settings.volume, settings.soundPitch);
  }

  const stepsDone = useMemo(
    () =>
      hydrated
        ? [0, 1, 2].map((i) =>
            i < step
              ? { progress: 100, done: true }
              : i === step
                ? { progress: pct, done: false }
                : { progress: 0, done: false }
          )
        : [],
    [hydrated, step, pct]
  );

  return (
    <>
      <div className="dzikir-steps">
        {STEPS.map((s, i) => (
          <button
            key={s.name}
            className={`dzikir-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            onClick={() => {
              setStep(i);
              setCount(Number(localStorage.getItem(`sd:tasbih:count:${i}`) || 0));
            }}
          >
            <span className="step-name">{s.name}</span>
            <span className="step-count">{Math.min(Number(localStorage.getItem(`sd:tasbih:count:${i}`) || 0), s.target)}/{s.target}</span>
            <span className="step-bar">
              <i style={{ width: hydrated ? stepsDone[i]?.progress + "%" : "0%" }}></i>
            </span>
          </button>
        ))}
      </div>

      <div className="tasbih-card">
        <div className="tasbih-info">
          <h2 className="current-dzikir">{current.name}</h2>
          <p className="tasbih-target">Target {current.target}x</p>
        </div>

        <div
          className="tasbih-counter"
          onClick={tap}
          onContextMenu={(e) => {
            e.preventDefault();
            setCount(0);
            save2(step, 0);
          }}
        >
          <div className="counter-circle" style={{ background: `conic-gradient(#2e7d64 ${pct}%, #e5efeB ${pct}%)` }}>
            <div className="counter-inner">
              <span className={`count-total ${pct >= 100 ? "done" : ""}`}>{count}</span>
              <span className="count-remaining">sisa {remain}</span>
            </div>
          </div>
          <p className="tasbih-tip">Ketuk tengah untuk <strong>{current.name}</strong></p>
          <p className="tasbih-hint">Klik kanan / tahan untuk reset hitungan</p>
        </div>
      </div>

      <div className="toggle-row">
        <span>Suara dzikir</span>
        <label className="switch">
          <input type="checkbox" checked={settings.dzikirSound} onChange={() => setSetting({ dzikirSound: !settings.dzikirSound })} />
          <span className="slider"></span>
        </label>
        <span>Getar</span>
        <label className="switch">
          <input type="checkbox" checked={settings.tasbihVibrate} onChange={() => setSetting({ tasbihVibrate: !settings.tasbihVibrate })} />
          <span className="slider"></span>
        </label>
      </div>
    </>
  );
}