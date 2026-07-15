"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";

const AUTH_KEY = "portfolio_admin_session";

/** Client-side copy of the admin password (from NEXT_PUBLIC_ADMIN_PASSWORD). */
export const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith(`${AUTH_KEY}=`));
    if (localStorage.getItem(AUTH_KEY) || hasCookie) {
      setAuthed(true);
    }
  }, []);

  const login = useCallback((pw: string) => {
    console.log("[admin-auth] Password check:", {
      inputLength: pw.length,
      expectedLength: ADMIN_PASSWORD.length,
      hasEnvVar: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    });
    if (pw.trim() === ADMIN_PASSWORD.trim()) {
      localStorage.setItem(AUTH_KEY, "1");
      document.cookie = `${AUTH_KEY}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`;
      setAuthed(true);
      setError("");
      return true;
    }
    setError("Incorrect password");
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    document.cookie = `${AUTH_KEY}=; path=/; max-age=0`;
    setAuthed(false);
    setPasswordInput("");
  }, []);

  return { authed, passwordInput, setPasswordInput, error, login, logout };
}

export function AdminLogin({
  passwordInput,
  setPasswordInput,
  error,
  onLogin,
}: {
  passwordInput: string;
  setPasswordInput: (v: string) => void;
  error: string;
  onLogin: (pw: string) => void;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian-900 px-4">
      {/* Ambient gradient mesh */}
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-mesh-1 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-mesh-2 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(13,115,119,0.12),transparent_60%)]" />

      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(passwordInput);
        }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-soft-lg backdrop-blur-2xl"
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
            className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-gradient font-serif text-2xl font-bold text-white shadow-glow"
          >
            PT
          </motion.span>
          <div className="flex items-center gap-2 text-pearl">
            <Lock size={18} className="text-primary" />
            <span className="font-serif text-2xl font-semibold">Studio Access</span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Sparkles size={14} className="text-burgundy" />
            Editorial console for Pooja Tiwari
          </p>
        </div>

        <label htmlFor="pw" className="field-label">
          Password
        </label>
        <div className="relative">
          <input
            id="pw"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="field-input pr-10"
            placeholder="••••••••"
            autoFocus
          />
          <ShieldCheck size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary mt-6 w-full"
        >
          <ShieldCheck size={16} /> Unlock Console
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-danger"
            >
              <AlertCircle size={15} /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
