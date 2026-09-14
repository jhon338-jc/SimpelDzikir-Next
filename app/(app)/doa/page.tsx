"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/client/store";
import { DOA_LIST, DOA_CATEGORIES, type Doa } from "@/lib/data/doa";
import { FavoriteButton, SoundButton } from "@/components/Cards";

export default function DoaPage() {
  const { settings } = useApp();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [onlyFav, setOnlyFav] = useState(false);
  const { favorites } = useApp();

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DOA_LIST.filter((d) => {
      if (cat !== "all" && d.cat !== cat) return false;
      if (onlyFav && !favorites.doa.has(d.title)) return false;
      if (q && !(d.title.toLowerCase().includes(q) || d.latin.toLowerCase().includes(q) || d.meaning.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, cat, onlyFav, favorites.doa]);

  return (
    <>
      <section className="search-section">
        <input
          type="text"
          placeholder="Cari doa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-search-class="doa-card"
        />
        <button className={`fav-filter ${onlyFav ? "active" : ""}`} onClick={() => setOnlyFav(!onlyFav)}>
          <i className="fas fa-heart"></i>
        </button>
      </section>

      <div className="chips-row">
        {DOA_CATEGORIES.map((c) => (
          <button key={c.key} className={`chip ${cat === c.key ? "chip-active" : ""}`} onClick={() => setCat(c.key)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="doa-list">
        {list.length === 0 && <p className="empty-state">Tidak ada doa yang cocok.</p>}
        {list.map((d) => (
          <DoaCardItem key={d.title} d={d} />
        ))}
      </div>
    </>
  );
}

function DoaCardItem({ d }: { d: Doa }) {
  const { settings } = useApp();
  const [open, setOpen] = useState(false);
  return (
    <div className={`doa-card ${open ? "expanded" : ""}`} data-cat={d.cat}>
      <div className="doa-head" onClick={() => setOpen(!open)}>
        <div className="doa-icon"><i className={`fas ${d.icon}`}></i></div>
        <div className="doa-title">
          <h3>{d.title}</h3>
          <span>{d.cat}</span>
        </div>
        <i className={`fas ${open ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
      </div>
      <div className="doa-content">
        <p className="arabic-doa">{d.arab}</p>
        <p className="latin-doa">{d.latin}</p>
        <p className="meaning-doa">{d.meaning}</p>
        <div className="doa-actions">
          <SoundButton text={d.arab} title={d.title} />
          <FavoriteButton kind="doa" id={d.title} />
        </div>
      </div>
    </div>
  );
}