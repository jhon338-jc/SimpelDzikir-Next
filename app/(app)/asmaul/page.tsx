"use client";

import { useMemo, useState } from "react";
import { ASMAUL_HUSNA } from "@/lib/data/asmaul";

export default function AsmaulPage() {
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ASMAUL_HUSNA;
    return ASMAUL_HUSNA.filter((n) =>
      [String(n.num), n.arab, n.latin.toLowerCase(), n.meaning.toLowerCase()].some((v) => v.includes(q))
    );
  }, [search]);

  return (
    <>
      <div className="asmaul-summary">
        <i className="fas fa-crown"></i>
        <div>
          <strong>{list.length} dari 99</strong>
          <span>Asmaul Husna — Nama-nama Allah</span>
        </div>
      </div>

      <section className="search-section">
        <input
          type="text"
          placeholder="Cari nama / arti..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-search-class="asmaul-card"
        />
      </section>

      <div className="asmaul-grid">
        {list.map((n) => (
          <div className="asmaul-card" key={n.num}>
            <span className="asmaul-num">{n.num}</span>
            <p className="asmaul-arab">{n.arab}</p>
            <p className="asmaul-latin">{n.latin}</p>
            <p className="asmaul-meaning">{n.meaning}</p>
          </div>
        ))}
      </div>
    </>
  );
}