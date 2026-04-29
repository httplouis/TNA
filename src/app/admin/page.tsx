"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Eye, EyeOff, AlertCircle, Lock, User, ArrowLeft } from "lucide-react";

// Simple hardcoded admin credentials for the mini project
const ADMIN_CREDS = { username: "admin", password: "xplore2025" };

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (form.username === ADMIN_CREDS.username && form.password === ADMIN_CREDS.password) {
      sessionStorage.setItem("tna_admin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      {/* bg glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#8B1A1A]/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logos */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/informatics-logo.png"
              alt="Informatics Holdings Philippines"
              width={110}
              height={30}
              className="h-8 w-auto object-contain"
              priority
            />
            <div className="h-6 w-px bg-white/15" />
              <div className="flex items-center justify-center w-[160px]">
                <Image
                  src="/xplore-logo-white.png"
                  alt="Xplore Philippines"
                  width={200}
                  height={100}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-base)]">Admin Access</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">TNA Portal — Xplore Philippines</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-base)] mb-1.5" htmlFor="admin-username">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-base)] mb-1.5" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/50 focus:border-[#8B1A1A]/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              id="btn-admin-login"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#8B1A1A] hover:bg-[#7B1414] text-[var(--text-base)] shadow-xl shadow-red-900/30 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[var(--border)] text-center">
            <p className="text-xs text-slate-600">
              Demo credentials: <span className="text-[var(--text-muted)]">admin / xplore2025</span>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
