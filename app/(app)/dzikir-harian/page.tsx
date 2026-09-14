"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/client/store";
import { DZIKIR_PAGI, DZIKIR_PETANG, type Adhkar } from "@/lib/data/dzikir-harian";
import { SoundButton } from "@/components/Cards";
import { playComplete, vibrateShort } from "@/lib/client/audio";
import { toDateKey } from "@/lib/utils";

export default function DzikirHarianPage() {
  const { settings, checkAdhkar, todayDone, toast } = useApp();
  const date = useMemo(() => toDateKey(new Date()), []);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Load state hari ini dari localStorage (dan tandai selesai jika progress server sudah done)
  useEffect(() => {
    const raw = localStorage.getItem(`sd:dzikir:${date}`);
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      // pastikan item lama tidak utuh
      setChecked(new Set(arr.filter((x) => [...DZIKIR_PAGI, ...DZIKIR_PETANG].some((a) => a.latin === x))));
    }
  }, [date]);

  useEffect(() => {
    if (todayDone) setChecked(new Set([...DZIKIR_PAGI, ...DZIKIR_PETANG].map((a) => a.latin)));
  }, [todayDone]);

  const total = DZIKIR_PAGI.length + DZIKIR_PETANG.length;

  function toggle(itemId: string) {
    const next = new Set(checked);
    if (next.has(itemId)) next.delete(itemId);
    else next.add(itemId);
    setChecked(next);
    localStorage.setItem(`sd:dzikir:${date}`, JSON.stringify([...next]));

    const done = next.size >= total;
    if (next.size % 5 === 0 && settings.dzikirVibrate) vibrateShort(40);
    if (done && settings.dzikirSound) playComplete(settings.volume);
    checkAdhkar(date, [...next], done);
    if (next.size % 5 === 0) toast(`${next.size}/${total} dzikir ditandai`, "info");
  }

  function reset() {
    setChecked(new Set());
    localStorage.setItem(`sd:dzikir:${date}`, JSON.stringify([]));
    checkAdhkar(date, [], false);
    toast("Progres hari ini direset", "info");
  }

  const allComplete = checked.size >= total;

  return (
    <>
      <div className="dzikir-summary-card">
        <div className="dzikir-progress-text">
          <strong>{checked.size}/{total}</strong>
          <span>dzikir ditandai hari ini</span>
        </div>
        <label className="switch">
          <input type="checkbox" checked={allComplete} onChange={() => (allComplete ? reset() : setChecked(new Set()) )} />
          <span className="slider"></span>
        </label>
      </div>

      <section className="dzikir-section">
        <h3>
          <i className="fas fa-sun"></i> Dzikir Pagi <small>{DZIKIR_PAGI.length} bacaan</small>
        </h3>
        <div className="dzikir-harian-list">
          {DZIKIR_PAGI.map((a) => (
            <AdhkarItem key={a.latin} a={a} done={checked.has(a.latin)} onToggle={() => toggle(a.latin)} />
          ))}
        </div>
      </section>

      <section className="dzikir-section">
        <h3>
          <i className="fas fa-moon"></i> Dzikir Petang <small>{DZIKIR_PETANG.length} bacaan</small>
        </h3>
        <div className="dzikir-harian-list">
          {DZIKIR_PETANG.map((a) => (
            <AdhkarItem key={a.latin} a={a} done={checked.has(a.latin)} onToggle={() => toggle(a.latin)} />
          ))}
        </div>
      </section>
    </>
  );
}

function AdhkarItem({ a, done, onToggle }: { a: Adhkar; done: boolean; onToggle: () => void }) {
  return (
    <div className={`dzikir-harian-item ${done ? "done" : ""}`} onClick={onToggle}>
      <div className="dzikir-harian-head">
        <i className={`fas ${done ? "fa-check-circle" : "fa-circle"}`}></i>
        <span className="repeat-badge">{a.repeat}×</span>
      </div>
      <p className="arab-text">{a.arab}</p>
      <p className="latin-text">{a.latin}</p>
      <p className="meaning-text">{a.meaning}</p>
      <SoundButton text={a.arab} title={a.latin} />
    </div>
  );
}