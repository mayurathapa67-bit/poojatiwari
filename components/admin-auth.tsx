"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock, AlertCircle, ShieldCheck } from "lucide-react";

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
    if (pw === ADMIN_PASSWORD) {
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(passwordInput);
        }}
        className="glass w-full max-w-sm p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gradient text-lg font-bold text-white shadow-glow">
            PT
          </span>
          <div className="flex items-center gap-2 text-pearl">
            <Lock size={18} className="text-primary" />
            <span className="text-lg font-semibold">Admin Access</span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Enter your password to manage the portfolio.
          </p>
        </div>

        <label htmlFor="pw" className="field-label">
          Password
        </label>
        <input
          id="pw"
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="field-input"
          placeholder="••••••••"
          autoFocus
        />

        <button type="submit" className="btn-primary mt-5 w-full">
          <ShieldCheck size={16} /> Unlock
        </button>

        {error && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-danger">
            <AlertCircle size={15} /> {error}
          </p>
        )}
      </form>
    </div>
  );
}
