"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, Inbox, LogOut, ExternalLink, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminView = "dashboard" | "content" | "submissions";

const NAV: { key: AdminView; href: string; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { key: "content", href: "/admin/content", label: "Content", icon: FileText },
  { key: "submissions", href: "/admin/submissions", label: "Submissions", icon: Inbox },
];

export default function AdminSidebar({
  active,
  onLogout,
}: {
  active: AdminView;
  onLogout: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-obsidian-900/90 px-4 py-6 backdrop-blur-xl lg:flex">
      <Link href="/admin" className="mb-10 flex items-center gap-3 px-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-gradient font-serif text-base font-bold text-white shadow-glow">
          PT
        </span>
        <div className="leading-tight">
          <p className="font-serif text-sm font-semibold text-pearl">Pooja Studio</p>
          <p className="text-xs text-muted">Editorial Console</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1.5">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = active === n.key;
          return (
            <Link
              key={n.key}
              href={n.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "text-pearl" : "text-muted hover:bg-white/[0.03] hover:text-ink"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 -z-10 rounded-xl border border-white/[0.08] bg-white/[0.05]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-gradient" />
              )}
              <Icon size={18} className={isActive ? "text-primary" : "text-muted group-hover:text-ink"} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/[0.06] pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-white/[0.03] hover:text-ink"
        >
          <ExternalLink size={18} /> View Live Site
        </Link>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

export function MobileAdminBar({ active, onLogout }: { active: AdminView; onLogout: () => void }) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-obsidian-900/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gradient font-serif text-sm font-bold text-white">
            PT
          </span>
          <span className="font-serif text-sm font-semibold text-pearl">Studio</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="rounded-lg border border-white/10 p-2 text-muted">
            <ExternalLink size={16} />
          </Link>
          <button onClick={onLogout} className="rounded-lg border border-white/10 p-2 text-muted">
            <LogOut size={16} />
          </button>
        </div>
      </div>
      <div className="flex gap-1 px-2 pb-2">
        {NAV.map((n) => (
          <Link
            key={n.key}
            href={n.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium",
              active === n.key ? "bg-white/[0.06] text-pearl" : "text-muted"
            )}
          >
            <n.icon size={14} /> {n.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
