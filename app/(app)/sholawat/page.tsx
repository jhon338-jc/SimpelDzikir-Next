"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/client/store";
import { SHOLAWAT_LIST } from "@/lib/data/sholawat";
import { FavoriteButton, SoundButton } from "@/components/Cards";

export default function SholawatPage() {
  const { favorites } = useApp();
  const [search, setSearch] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SHOLAWAT_LIST.filter((s) => {
      if (onlyFav && !favorites.sholawat.has(s.title)) return false;
      if (q && !(s.title.toLowerCase().includes(q) || s.latin.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, onlyFav, favorites.sholawat]);

  return (
    <>
      <section className="search-section">
        <input
          type="text"
          placeholder="Cari sholawat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-search-class="sholawat-card"
        />
        <button className={`fav-filter ${onlyFav ? "active" : ""}`} onClick={() => setOnlyFav(!onlyFav)}>
          <i className="fas fa-heart"></i>
        </button>
      </section>

      <div className="sholawat-list">
        {list.length === 0 && <p className="empty-state">Tidak ada sholawat yang cocok.</p>}
        {list.map((s) => (
          <div key={s.title} className="sholawat-card">
            <div className="sholawat-content">
              <h3 onClick={() => setOpen(open === s.title ? null : s.title)}>
                <i className="fas fa-pray"></i> {s.title}
              </h3>
              {open === s.title && (
                <>
                  <p className="arabic-sholawat">{s.arab}</p>
                  <p className="latin-sholawat">{s.latin}</p>
                  <p className="meaning-sholawat">{s.meaning}</p>
                </>
              )}
            </div>
            <div className="sholawat-actions">
              <SoundButton text={s.arab} title={s.title} />
              <FavoriteButton kind="sholawat" id={s.title} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}