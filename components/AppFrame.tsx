"use client";

import Header from "./Header";
import BottomNav from "./BottomNav";
import { useApp } from "@/lib/client/store";

export default function AppFrame({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string } | null;
}) {
  const { toasts, hydrated } = useApp();

  return (
    <div className="app-shell">
      <Header />
      <main className="main-menu">{children}</main>
      <BottomNav />
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
      {!hydrated && <div className="loading-hint">Memuat…</div>}
    </div>
  );
}