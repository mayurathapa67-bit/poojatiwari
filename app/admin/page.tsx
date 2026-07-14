"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Inbox, Eye, ArrowRight, PenLine } from "lucide-react";
import type { PortfolioData } from "@/lib/types";
import AdminSidebar, { MobileAdminBar } from "@/components/AdminSidebar";
import { useAdminAuth, AdminLogin } from "@/components/admin-auth";

export default function AdminLanding() {
  const { authed, passwordInput, setPasswordInput, error, login, logout } =
    useAdminAuth();
  const [counts, setCounts] = useState<{ sections: number; submissions: number }>({
    sections: 0,
    submissions: 0,
  });

  useEffect(() => {
    if (authed) {
      fetch("/api/content")
        .then((r) => r.json())
        .then((d: PortfolioData) => setCounts((c) => ({ ...c, sections: Object.keys(d).length })))
        .catch(() => {});
      fetch("/api/submissions?password=" + (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024"))
        .then((r) => (r.ok ? r.json() : []))
        .then((s: unknown[]) => setCounts((c) => ({ ...c, submissions: s.length })))
        .catch(() => {});
    }
  }, [authed]);

  if (!authed) {
    return (
      <AdminLogin
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        error={error}
        onLogin={login}
      />
    );
  }

  const cards = [
    {
      href: "/admin/content",
      icon: FileText,
      title: "Content",
      desc: "Edit profile, hero, about, services, writing samples, blog, testimonials & contact.",
      badge: `${counts.sections} sections`,
      accent: "from-teal to-primary",
    },
    {
      href: "/admin/submissions",
      icon: Inbox,
      title: "Submissions",
      desc: "Review and manage contact-form messages from visitors.",
      badge: `${counts.submissions} messages`,
      accent: "from-burgundy to-primary",
    },
  ];

  return (
    <div className="relative min-h-screen bg-obsidian-900 lg:pl-64">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-mesh-1 blur-[120px]" />
      <AdminSidebar active="dashboard" onLogout={logout} />
      <MobileAdminBar active="dashboard" onLogout={logout} />

      <main className="relative z-10 container-px py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-transparent p-8 shadow-card"
        >
          <div className="flex items-center gap-2 text-primary">
            <PenLine size={18} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Welcome back</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl font-bold text-pearl sm:text-5xl">
            Editorial Console
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Shape every word on the site — from the hero headline to the latest journal entry.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={c.href}
                className="group relative block overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all hover:border-white/15 hover:shadow-card-hover"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.accent} text-white`}>
                  <c.icon size={22} />
                </div>
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold text-pearl transition-colors group-hover:text-white">
                    {c.title}
                  </h2>
                  <ArrowRight size={18} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="text-sm leading-relaxed text-muted">{c.desc}</p>
                <span className="mt-4 inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted">
                  {c.badge}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <Link
          href="/"
          target="_blank"
          className="mt-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-pearl"
        >
          <Eye size={16} /> Preview live site
        </Link>
      </main>
    </div>
  );
}
