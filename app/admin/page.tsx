"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Inbox, Eye, ArrowRight } from "lucide-react";
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
      desc: "Edit personal info, hero, about, experience, projects, contact & socials.",
      badge: `${counts.sections} sections`,
      accent: "text-primary",
    },
    {
      href: "/admin/submissions",
      icon: Inbox,
      title: "Submissions",
      desc: "Review and manage contact-form messages from visitors.",
      badge: `${counts.submissions} messages`,
      accent: "text-teal",
    },
  ];

  return (
    <div className="min-h-screen lg:pl-64">
      <AdminSidebar active="dashboard" onLogout={logout} />
      <MobileAdminBar active="dashboard" onLogout={logout} />

      <main className="container-px py-10 lg:py-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-pearl">Dashboard</h1>
          <p className="mt-2 text-muted">Select a module to manage your portfolio.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="group glass relative overflow-hidden p-6 transition-all hover:border-white/15">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <c.icon size={20} className={c.accent} />
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted">
                  {c.badge}
                </span>
              </div>
              <h2 className="mb-1 flex items-center gap-1 text-lg font-semibold text-pearl transition-colors group-hover:text-white">
                {c.title}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </h2>
              <p className="text-sm text-muted">{c.desc}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/"
          target="_blank"
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-pearl"
        >
          <Eye size={16} /> Preview live site
        </Link>
      </main>
    </div>
  );
}
