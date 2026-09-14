"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { AppSettings } from "./settings";
import { DEFAULT_SETTINGS, applySettingsDom, loadSettings, saveSettings } from "./settings";
import { registerServiceWorker } from "./sw";

export type ToastMsg = { id: number; msg: string; type: "success" | "error" | "info" };

export type SyncData = {
  favorites: { doa: string[]; sholawat: string[] };
  settings: Record<string, string>;
  streak: { streak: number; lastDate: string | null };
  progress: { done: boolean; checkedItems: string } | null;
};

type Store = {
  hydrated: boolean;
  user: { name: string; email: string } | null;
  settings: AppSettings;
  setSetting: (patch: Partial<AppSettings>) => void;
  favorites: { doa: Set<string>; sholawat: Set<string> };
  toggleFavorite: (kind: "doa" | "sholawat", id: string) => void;
  streak: number;
  todayDone: boolean;
  checkAdhkar: (date: string, checked: string[], done: boolean) => void;
  toast: (msg: string, type?: ToastMsg["type"]) => void;
  toasts: ToastMsg[];
  pushSync: (data?: { favorites?: { doa?: string[]; sholawat?: string[] }; settings?: Record<string, string> | AppSettings }) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function useApp(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useApp harus dipakai dalam <AppFrame>");
  return s;
}

export function AppProvider({ user, children }: { user: { name: string; email: string } | null; children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [favorites, setFavorites] = useState<{ doa: Set<string>; sholawat: Set<string> }>({ doa: new Set(), sholawat: new Set() });
  const [streak, setStreak] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const syncTimer = useRef<number | null>(null);

  const toast = useCallback((msg: string, type: ToastMsg["type"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const pushSync = useCallback(
    async (data?: { favorites?: { doa?: string[]; sholawat?: string[] }; settings?: Record<string, string> | Partial<AppSettings> }) => {
      if (!user) return;
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
      syncTimer.current = window.setTimeout(async () => {
        const payload: any = { settings: {} };
        if (data?.favorites) payload.favorites = data.favorites;
        else if (hydrated) payload.favorites = { doa: [...favorites.doa], sholawat: [...favorites.sholawat] };
        if (data?.settings) {
          payload.settings = sanitizeSettings(data.settings as Record<string, unknown>);
        }
        try {
          await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch {
          /* offline fine */
        }
      }, 500);
    },
    [user, favorites, hydrated]
  );

  // Load awal dari /api/sync + localStorage
  useEffect(() => {
    const local = loadSettings();
    setSettingsState(local);
    applySettingsDom(local);
    registerServiceWorker();

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/sync", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as SyncData;
          if (cancelled) return;
          setFavorites({
            doa: new Set(data.favorites?.doa || []),
            sholawat: new Set(data.favorites?.sholawat || []),
          });
          setStreak(data.streak?.streak || 0);
          setTodayDone(!!data.progress?.done);
          // Merge pengaturan remote yang tidak ada di lokal
          const merged = { ...local };
          if (data.settings && Object.keys(data.settings).length) {
            if (data.settings.city) merged.city = data.settings.city;
            if (data.settings.darkMode) merged.darkMode = data.settings.darkMode === "true";
            if (data.settings.language) merged.language = data.settings.language as any;
            if (data.settings.autoplayDoa) merged.autoplayDoa = data.settings.autoplayDoa === "true";
            saveSettings(merged);
            setSettingsState(merged);
            applySettingsDom(merged);
          }
        }
      } catch {
        /* offline */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSetting = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettingsState((prev) => {
        const next = { ...prev, ...patch };
        saveSettings(next);
        applySettingsDom(next);
        pushSync({ settings: patch });
        return next;
      });
    },
    [pushSync]
  );

  const toggleFavorite = useCallback(
    (kind: "doa" | "sholawat", id: string) => {
      setFavorites((prev) => {
        const nextSet = new Set(prev[kind]);
        if (nextSet.has(id)) nextSet.delete(id);
        else nextSet.add(id);
        const next = { ...prev, [kind]: nextSet };
        pushSync({ favorites: { doa: [...next.doa], sholawat: [...next.sholawat] } });
        return next;
      });
      toast(kind === "doa" ? "Favorit diperbarui" : "Favorit sholawat diperbarui", "success");
    },
    [pushSync, toast]
  );

  const checkAdhkar = useCallback(
    (date: string, checked: string[], done: boolean) => {
      setTodayDone(done);
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: { date, checkedItems: checked, done } }),
      }).catch(() => {});
    },
    []
  );

  const value: Store = {
    hydrated,
    user,
    settings,
    setSetting,
    favorites,
    toggleFavorite,
    streak,
    todayDone,
    checkAdhkar,
    toast,
    toasts,
    pushSync,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function sanitizeSettings(s: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(s)) {
    if (v === undefined || v === null) continue;
    out[k] = String(v);
  }
  return out;
}