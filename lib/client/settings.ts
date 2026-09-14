export type AppSettings = {
  city: string;
  useGps: boolean;
  darkMode: boolean;
  fontSize: "small" | "medium" | "large";
  language: "id" | "ar";
  volume: number; // 0..1
  soundEnabled: boolean;
  soundPitch: number; // 1..4
  autoplayDoa: boolean;
  dzikirSound: boolean;
  dzikirVibrate: boolean;
  tasbihVibrate: boolean;
  adzanAlarms: string[]; // nama sholat: Subuh, Dzuhur, Ashar, Maghrib, Isya
  pushEnabled: boolean;
  pushAdhan: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  city: "jakarta",
  useGps: false,
  darkMode: false,
  fontSize: "medium",
  language: "id",
  volume: 0.7,
  soundEnabled: true,
  soundPitch: 3,
  autoplayDoa: false,
  dzikirSound: true,
  dzikirVibrate: true,
  tasbihVibrate: true,
  adzanAlarms: ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"],
  pushEnabled: false,
  pushAdhan: true,
};

const KEY = "sd:settings:v1";

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(settings));
}

// TERAPKAN ke DOM (tema, ukuran font)
export function applySettingsDom(settings: AppSettings): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark-mode", settings.darkMode);
  document.documentElement.classList.remove("font-small", "font-medium", "font-large");
  document.documentElement.classList.add(`font-${settings.fontSize}`);
  const px = settings.fontSize === "small" ? "15px" : settings.fontSize === "large" ? "18px" : "16px";
  document.documentElement.style.setProperty("--font-size-base", px);
}

export function toSyncPayload(settings: AppSettings) {
  return {
    settings: {
      city: settings.city,
      useGps: settings.useGps,
      darkMode: settings.darkMode,
      fontSize: settings.fontSize,
      language: settings.language,
      volume: settings.volume,
      autoplayDoa: settings.autoplayDoa,
      pushEnabled: settings.pushEnabled,
      pushAdhan: settings.pushAdhan,
    },
  };
}

export function hasBasisSettings(remote: Record<string, string>): boolean {
  return Object.keys(remote).length > 0;
}