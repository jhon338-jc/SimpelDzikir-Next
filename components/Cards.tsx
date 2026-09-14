"use client";

import { useApp } from "@/lib/client/store";
import { speakArabic } from "@/lib/client/audio";

export function FavoriteButton({ kind, id }: { kind: "doa" | "sholawat"; id: string }) {
  const { favorites, toggleFavorite } = useApp();
  const active = favorites[kind]?.has(id) ?? false;
  return (
    <button
      className={`fav-btn ${active ? "active" : ""}`}
      onClick={() => toggleFavorite(kind, id)}
      aria-label={active ? "Hapus favorit" : "Tambah favorit"}
    >
      <i className={`fas ${active ? "fa-heart" : "fa-heart-regular"}`}></i>
    </button>
  );
}

export function SoundButton({ text, title }: { text: string; title: string }) {
  const { toast } = useApp();
  return (
    <button
      className="sound-btn"
      onClick={() => {
        const ok = speakArabic(text);
        toast(ok ? `Memutar bacaan: ${title}` : "Audio tidak tersedia di perangkat ini", ok ? "info" : "error");
      }}
      title="Putar audio / baca"
    >
      <i className="fas fa-volume-up"></i>
    </button>
  );
}