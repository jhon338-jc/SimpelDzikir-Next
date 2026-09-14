let audioCtx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

// Bunyi “tit” lembut dengan frekuensi sesuai pitch (1-4)
export function playBeep(volume = 0.7, pitch = 3): void {
  const ac = ctx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const base = 261.63 * Math.pow(2, (pitch - 1) * 2 / 12);
  osc.type = "sine";
  osc.frequency.value = base;
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ac.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + 0.4);
}

// Bunyi selesai (nada naik)
export function playComplete(volume = 0.7): void {
  const ac = ctx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  [523.25, 659.25, 783.99].forEach((f, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    const t = ac.currentTime + i * 0.15;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  });
}

let vibrateTimer: number | null = null;

// Getar pola pendek (tasbih/dzikir; tabrakan ditunda)
export function vibrateShort(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (vibrateTimer !== null) return;
  navigator.vibrate(pattern);
  vibrateTimer = window.setTimeout(() => {
    vibrateTimer = null;
  }, 400);
}

// Baca teks Arab via SpeechSynthesis (opsional & eksperimental)
export function speakArabic(text: string): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}