"use client";

import { useState } from "react";
import { PRAYER_TABS, NIAT_WAJIB, NIAT_SUNNAH, NIAT_WUDHU, TATA_CARA_SHOLLAT, TATA_CARA_WUDHU, DZIKIR_SETELAH_SHOLAT, DZIKIR_COUNT } from "@/lib/data/panduan";
import { SoundButton } from "@/components/Cards";

type Bacaan = { arab: string; latin: string; meaning: string };

export default function PanduanPage() {
  const [tab, setTab] = useState("wajib");

  return (
    <>
      <div className="panduan-tabs">
        {PRAYER_TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="panduan-content">
        <div className="basmalah-card">
          <p className="arabic-doa">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <p>Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
        </div>

        {tab === "wajib" && <BacaanList title="Niat Sholat Wajib" items={NIAT_WAJIB} />}
        {tab === "sunnah" && <BacaanList title="Niat Sholat Sunnah" items={NIAT_SUNNAH} />}
        {tab === "wudhu" && <BacaanList title="Niat & Doa Wudhu" items={NIAT_WUDHU} />}
        {tab === "histep" && (
          <>
            <GuideView guide={TATA_CARA_SHOLLAT} />
            <GuideView guide={TATA_CARA_WUDHU} />
          </>
        )}
        {tab === "dzikir" && <DzikirSet />}
      </div>
    </>
  );
}

function BacaanList({ title, items }: { title: string; items: Bacaan[] }) {
  return (
    <section className="niats">
      <h3><i className="fas fa-book"></i> {title}</h3>
      {items.map((b, i) => (
        <div className="niat-card" key={i}>
          <p className="arabic-doa">{b.arab}</p>
          <p className="latin-doa">{b.latin}</p>
          <p className="meaning-doa">{b.meaning}</p>
          <SoundButton text={b.arab} title={title} />
        </div>
      ))}
    </section>
  );
}

function GuideView({ guide }: { guide: { title: string; icon: string; steps: string[]; note?: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="guide-card">
      <h3 onClick={() => setOpen(!open)}>
        <i className={`fas ${guide.icon}`}></i> {guide.title}
        <i className={`fas ${open ? "fa-chevron-up" : "fa-chevron-down"} guide-toggle`}></i>
      </h3>
      {open && (
        <>
          <ol className="guide-steps">
            {guide.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {guide.note && <p className="guide-note">{guide.note}</p>}
        </>
      )}
    </section>
  );
}

function DzikirSet() {
  return (
    <section className="dzikir-set">
      <h3><i className="fas fa-star-and-crescent"></i> Dzikir & Doa Setelah Sholat</h3>
      {DZIKIR_SETELAH_SHOLAT.map((b, i) => (
        <div className="niat-card" key={i}>
          <div className="dzikir-head">
            <p className="arabic-doa">{b.arab}</p>
            <span className="repeat-badge">{DZIKIR_COUNT[i] ?? ""}</span>
          </div>
          <p className="latin-doa">{b.latin}</p>
          <p className="meaning-doa">{b.meaning}</p>
          <SoundButton text={b.arab} title={`Dzikir ${i + 1}`} />
        </div>
      ))}
    </section>
  );
}