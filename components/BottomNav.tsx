"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", icon: "fa-home", label: "Beranda" },
  { href: "/jadwal", icon: "fa-calendar-alt", label: "Jadwal" },
  { href: "/kiblat", icon: "fa-compass", label: "Kiblat" },
  { href: "/tasbih", icon: "fa-star-of-life", label: "Tasbih" },
  { href: "/pengaturan", icon: "fa-cog", label: "Setelan" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className={`nav-item ${pathname === n.href ? "active" : ""}`}>
          <i className={`fas ${n.icon}`}></i>
          <span>{n.label}</span>
        </Link>
      ))}
    </nav>
  );
}