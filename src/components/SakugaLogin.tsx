"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  SakugaButtonElement,
  SakugaCheckboxElement,
  SakugaInputElement,
  SakugaTabsElement,
  SakugaToastElement,
} from "@/types/sakuga";

interface DbHealth {
  ok: boolean;
  latencyMs?: number;
  host?: string;
  database?: string;
  user_count?: number;
}

export default function SakugaLogin({ health }: { health: DbHealth }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Key Animator");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const modeTabsRef = useRef<SakugaTabsElement>(null);
  const userRef = useRef<SakugaInputElement>(null);
  const passRef = useRef<SakugaInputElement>(null);
  const nameRef = useRef<SakugaInputElement>(null);
  const emailRef = useRef<SakugaInputElement>(null);
  const rememberRef = useRef<SakugaCheckboxElement>(null);
  const submitBtnRef = useRef<SakugaButtonElement>(null);
  const toastRef = useRef<SakugaToastElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wire <sakuga-tabs> for Login / Register mode switch
  useEffect(() => {
    if (!mounted) return;
    const tabs = modeTabsRef.current;
    if (!tabs) return;
    const onTabChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const val = detail?.value as "login" | "register";
      if (val) {
        setAuthMode(val);
        setError("");
      }
    };
    tabs.addEventListener("change", onTabChange);
    return () => tabs.removeEventListener("change", onTabChange);
  }, [mounted]);

  // Wire <sakuga-input> & <sakuga-checkbox>
  useEffect(() => {
    if (!mounted) return;
    const cleanups: Array<() => void> = [];

    const uInp = userRef.current;
    if (uInp) {
      uInp.value = username;
      const onU = () => setUsername(uInp.value || "");
      uInp.addEventListener("input", onU);
      uInp.addEventListener("change", onU);
      cleanups.push(() => {
        uInp.removeEventListener("input", onU);
        uInp.removeEventListener("change", onU);
      });
    }

    const pInp = passRef.current;
    if (pInp) {
      pInp.value = password;
      const onP = () => setPassword(pInp.value || "");
      pInp.addEventListener("input", onP);
      pInp.addEventListener("change", onP);
      cleanups.push(() => {
        pInp.removeEventListener("input", onP);
        pInp.removeEventListener("change", onP);
      });
    }

    const nInp = nameRef.current;
    if (nInp) {
      nInp.value = fullName;
      const onN = () => setFullName(nInp.value || "");
      nInp.addEventListener("input", onN);
      nInp.addEventListener("change", onN);
      cleanups.push(() => {
        nInp.removeEventListener("input", onN);
        nInp.removeEventListener("change", onN);
      });
    }

    const eInp = emailRef.current;
    if (eInp) {
      eInp.value = email;
      const onE = () => setEmail(eInp.value || "");
      eInp.addEventListener("input", onE);
      eInp.addEventListener("change", onE);
      cleanups.push(() => {
        eInp.removeEventListener("input", onE);
        eInp.removeEventListener("change", onE);
      });
    }

    const rem = rememberRef.current;
    if (rem) {
      rem.checked = remember;
      const onR = () => setRemember(Boolean(rem.checked));
      rem.addEventListener("change", onR);
      cleanups.push(() => rem.removeEventListener("change", onR));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [mounted, authMode]);

  const handleSubmit = async () => {
    if (loading) return;
    setError("");
    const usernameVal = (userRef.current?.value ?? username).trim();
    const passwordVal = passRef.current?.value ?? password;
    const fullNameVal = (nameRef.current?.value ?? fullName).trim();
    const emailVal = (emailRef.current?.value ?? email).trim();

    if (!usernameVal || !passwordVal) {
      setError("Username dan password wajib diisi!");
      toastRef.current?.show?.("Isi username & password terlebih dahulu!");
      return;
    }

    setLoading(true);
    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameVal,
          password: passwordVal,
          full_name: fullNameVal || usernameVal,
          email: emailVal || `${usernameVal}@sakuga.local`,
          role,
          remember: rememberRef.current?.checked ?? remember,
        }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        submitBtnRef.current?.done?.();
        toastRef.current?.show?.(
          `Login Berhasil! Selamat datang, ${data.user.full_name}`
        );
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 650);
      } else {
        setLoading(false);
        setError(data.error || "Autentikasi gagal");
        toastRef.current?.show?.(data.error || "Autentikasi gagal");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Gagal menghubungi server");
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const btn = submitBtnRef.current;
    if (!btn) return;
    const onClick = () => handleSubmit();
    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  });

  const fillDemo = (u: string, p: string) => {
    setAuthMode("login");
    setUsername(u);
    setPassword(p);
    setError("");
    if (modeTabsRef.current) modeTabsRef.current.selected = 0;
    if (userRef.current) userRef.current.value = u;
    if (passRef.current) passRef.current.value = p;
    toastRef.current?.show?.(`Akun demo '${u}' siap digunakan!`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-white via-[#faf9ff] to-[#f4f3fc]">
      {mounted && (
        <div className="fixed bottom-6 right-6 z-50">
          <sakuga-toast ref={toastRef}></sakuga-toast>
        </div>
      )}

      <div className="w-full max-w-[540px]">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white border-[1.5px] border-[#dcdaf0] mb-3 shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                health.ok ? "bg-[#10b981]" : "bg-[#ef4444]"
              }`}
            />
            <span>
              PostgreSQL Auth:{" "}
              <strong>
                {health.host || "postgres15"}/{health.database || "sakuga_db"}
              </strong>{" "}
              ({health.latencyMs ?? 1}ms)
            </span>
          </div>

          <h1
            className="m-0 italic font-extrabold text-[32px] leading-tight text-[#1d1a4a]"
            style={{
              fontFamily:
                '"Avenir Next", "Nunito", -apple-system, "Segoe UI", system-ui, sans-serif',
            }}
          >
            Sakuga VFX × React Studio
          </h1>
          <p className="m-0 mt-1.5 text-sm text-[#8580b0]">
            Silakan login terlebih dahulu untuk mengakses Halaman Utama (CRUD &amp;
            Tabel Produksi)
          </p>
        </div>

        {/* Main Auth Card */}
        <section className="sk-card p-6 sm:p-8 shadow-xl border-2 border-[#1d1a4a] bg-white space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dcdaf0] pb-4">
            <div>
              <h2 className="m-0 text-lg font-extrabold text-[#1d1a4a]">
                {authMode === "login"
                  ? "🔐 Masuk ke Akun Studio"
                  : "✨ Registrasi Animator Baru"}
              </h2>
              <p className="m-0 text-xs text-[#8580b0]">
                Terhubung ke tabel <code>sakuga_users</code> di PostgreSQL 15
              </p>
            </div>

            {mounted && (
              <sakuga-tabs ref={modeTabsRef} label="Auth Mode">
                <option value="login">Login</option>
                <option value="register">Register</option>
              </sakuga-tabs>
            )}
          </div>

          {mounted && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#1d1a4a] mb-1.5">
                  Username atau Email (<code>&lt;sakuga-input&gt;</code>)
                </label>
                <div style={{ "--sk-input-width": "100%" } as React.CSSProperties}>
                  <sakuga-input
                    ref={userRef}
                    label="Username"
                    placeholder="Masukkan username (misal: admin)"
                  ></sakuga-input>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1a4a] mb-1.5">
                  Password (<code>&lt;sakuga-input type=&quot;password&quot;&gt;</code>)
                </label>
                <div style={{ "--sk-input-width": "100%" } as React.CSSProperties}>
                  <sakuga-input
                    ref={passRef}
                    type="password"
                    label="Password"
                    placeholder="Masukkan password"
                  ></sakuga-input>
                </div>
              </div>

              {authMode === "register" && (
                <div className="space-y-4 pt-2 border-t border-[#dcdaf0]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1d1a4a] mb-1.5">
                        Nama Lengkap
                      </label>
                      <div
                        style={
                          { "--sk-input-width": "100%" } as React.CSSProperties
                        }
                      >
                        <sakuga-input
                          ref={nameRef}
                          label="Full Name"
                          placeholder="Misal: Kenji Keyframe"
                        ></sakuga-input>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1d1a4a] mb-1.5">
                        Email Studio
                      </label>
                      <div
                        style={
                          { "--sk-input-width": "100%" } as React.CSSProperties
                        }
                      >
                        <sakuga-input
                          ref={emailRef}
                          type="email"
                          label="Email"
                          placeholder="kenji@sakuga.local"
                        ></sakuga-input>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1d1a4a] mb-1.5">
                      Role / Jabatan Produksi
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full h-[42px] px-3 rounded-xl border-[1.5px] border-[#1d1a4a] bg-white text-sm font-semibold text-[#1d1a4a]"
                    >
                      <option value="Studio Director">Studio Director</option>
                      <option value="Lead Animator">Lead Animator</option>
                      <option value="Key Animator">Key Animator</option>
                      <option value="VFX Compositor">VFX Compositor</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <div className="px-3.5 py-2.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-xs font-bold text-[#b91c1c]">
                  ⚠ {error}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <sakuga-checkbox ref={rememberRef}>
                  Ingat sesi saya (30 hari)
                </sakuga-checkbox>

                <div className="flex items-center gap-2">
                  <sakuga-tooltip text="Klik tombol di samping untuk verifikasi kredensial ke PostgreSQL dan masuk ke halaman utama!"></sakuga-tooltip>
                  <sakuga-button ref={submitBtnRef}>
                    {authMode === "login"
                      ? "Login ke Main Page"
                      : "Daftar & Masuk"}
                  </sakuga-button>
                </div>
              </div>
            </form>
          )}

          {/* Demo Accounts Quick Fill */}
          <div className="rounded-2xl bg-[#faf9ff] p-4 border-[1.5px] border-[#dcdaf0] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1d1a4a]">
                ⚡ Akun Demo PostgreSQL (Klik untuk isi otomatis)
              </span>
              <span className="text-[11px] font-semibold text-[#7c5cff]">
                sakuga_users
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemo("admin", "admin123")}
                className="text-left p-2.5 rounded-xl border border-[#dcdaf0] hover:border-[#1d1a4a] bg-white transition-all cursor-pointer"
              >
                <div className="text-xs font-extrabold text-[#1d1a4a]">
                  Studio Director
                </div>
                <div className="text-xs font-mono text-[#7c5cff] mt-0.5">
                  user: <strong>admin</strong> · pass: <strong>admin123</strong>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("animator", "sakuga123")}
                className="text-left p-2.5 rounded-xl border border-[#dcdaf0] hover:border-[#1d1a4a] bg-white transition-all cursor-pointer"
              >
                <div className="text-xs font-extrabold text-[#1d1a4a]">
                  Lead Animator
                </div>
                <div className="text-xs font-mono text-[#7c5cff] mt-0.5">
                  user: <strong>animator</strong> · pass:{" "}
                  <strong>sakuga123</strong>
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
