"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authClient } from "@/lib/client/auth-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="login-screen">Memuat…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { error: upErr } = await authClient.signUp.email({ name, email, password });
        if (upErr) {
          setError(upErr.message || "Gagal mendaftar");
          setLoading(false);
          return;
        }
      } else {
        const { error: inErr } = await authClient.signIn.email({ email, password });
        if (inErr) {
          setError(inErr.message || "Email atau kata sandi salah");
          setLoading(false);
          return;
        }
      }
      router.push(next);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <i className="fas fa-mosque"></i>
          <h1>Simpel Dzikir</h1>
          <p>Digital Islamic Companion</p>
        </div>

        <div className="login-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }}>
            Masuk
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }}>
            Daftar
          </button>
        </div>

        <form onSubmit={submit} className="login-form">
          {mode === "register" && (
            <label>
              Nama
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                required
                minLength={2}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </label>
          <label>
            Kata Sandi
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Memproses…" : mode === "login" ? "Masuk" : "Buat Akun"}
          </button>
        </form>

        <p className="login-note">
          Akun tunggal untuk menyinkronkan favorit, pengaturan, dan progres dzikir di semua perangkat.
        </p>
      </div>
    </div>
  );
}