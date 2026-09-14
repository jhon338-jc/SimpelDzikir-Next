"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  async function handleLogout() {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } catch {}
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="header">
      <div className="header-content">
        {!isHome && (
          <button className="back-btn" onClick={() => router.back()} aria-label="Kembali">
            <i className="fas fa-arrow-left"></i>
          </button>
        )}
        <Link href="/" className="logo">
          <i className="fas fa-mosque"></i>
          <span>Simpel Dzikir</span>
        </Link>
        <div className="user-greeting">
          <i className="fas fa-user-circle"></i>
          <span className="greeting-name">Hi</span>
          <button className="logout-btn" onClick={handleLogout} title="Keluar">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
}