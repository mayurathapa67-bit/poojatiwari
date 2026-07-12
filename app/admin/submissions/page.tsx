"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Archive,
  ArchiveRestore,
  Download,
  CheckCircle2,
  Eye,
  X,
} from "lucide-react";
import type { Submission } from "@/lib/submission-types";
import AdminSidebar, { MobileAdminBar, type AdminView } from "@/components/AdminSidebar";
import { useAdminAuth, AdminLogin } from "@/components/admin-auth";

type SortKey = "timestamp" | "name" | "subject";
type SortDir = "asc" | "desc";

function toCsv(rows: Submission[]): string {
  const headers = ["id", "name", "email", "subject", "message", "timestamp"];
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.id, r.name, r.email, r.subject, r.message, r.timestamp].map(esc).join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function SubmissionsPage() {
  const { authed, passwordInput, setPasswordInput, error, login, logout } =
    useAdminAuth();
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [archiving, setArchiving] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Submission | null>(null);

  const apiPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

  async function load() {
    if (!authed) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions?password=${apiPassword}`);
      if (res.ok) setSubs(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  async function toggleArchive(s: Submission) {
    setArchiving(s.id);
    try {
      const res = await fetch(`/api/submissions/${s.id}?password=${apiPassword}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !s.archived }),
      });
      if (res.ok) {
        setSubs((prev) =>
          prev.map((x) => (x.id === s.id ? { ...x, archived: !x.archived } : x))
        );
        setToast(s.archived ? "Submission restored" : "Submission archived");
      }
    } finally {
      setArchiving(null);
    }
  }

  function exportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return subs
      .filter((s) => (showArchived ? true : !s.archived))
      .filter((s) => (q ? [s.name, s.email, s.subject, s.message].some((v) => v.toLowerCase().includes(q)) : true))
      .filter((s) => {
        const t = new Date(s.timestamp).getTime();
        if (from && t < new Date(from).getTime()) return false;
        if (to && t > new Date(to).getTime() + 86399999) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === "timestamp") cmp = a.timestamp.localeCompare(b.timestamp);
        else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [subs, query, from, to, showArchived, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? (
      <ArrowUpDown size={14} className="text-muted" />
    ) : sortDir === "asc" ? (
      <ArrowUp size={14} className="text-primary" />
    ) : (
      <ArrowDown size={14} className="text-primary" />
    );

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

  const visibleCount = subs.filter((s) => !s.archived).length;

  return (
    <div className="min-h-screen lg:pl-64">
      <AdminSidebar active="submissions" onLogout={logout} />
      <MobileAdminBar active="submissions" onLogout={logout} />

      <main className="container-px py-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-pearl">
              <Inbox size={22} className="text-primary" /> Submissions
            </h1>
            <p className="mt-1 text-sm text-muted">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-xs text-muted">
                {visibleCount} active
              </span>
            </p>
          </div>
          <button onClick={exportCsv} className="btn-ghost">
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-40 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>From</span>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-sm text-ink outline-none"
              />
              <span>To</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-sm text-ink outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Show archived
            </label>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-white/20 hover:text-ink"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-card backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-ink">
                      Name <SortIcon col="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("subject")} className="flex items-center gap-1 hover:text-ink">
                      Subject <SortIcon col="subject" />
                    </button>
                  </th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("timestamp")} className="flex items-center gap-1 hover:text-ink">
                      Date <SortIcon col="timestamp" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.05] ${
                      i % 2 === 1 ? "bg-white/[0.02]" : "bg-transparent"
                    } ${s.archived ? "opacity-50" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium text-ink">{s.name}</td>
                    <td className="px-4 py-3 text-muted">
                      <a href={`mailto:${s.email}`} className="hover:text-primary">
                        {s.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-ink">{s.subject || "—"}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted" title={s.message}>
                      {s.message}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {new Date(s.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(s)}
                          aria-label="View"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-white/20 hover:text-pearl"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => toggleArchive(s)}
                          disabled={archiving === s.id}
                          aria-label={s.archived ? "Restore" : "Archive"}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-white/20 hover:text-pearl disabled:opacity-50"
                        >
                          {s.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-muted">
              <Inbox size={36} />
              <p className="text-sm">No submissions found.</p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center py-16 text-primary">
              <RefreshCw className="animate-spin" />
            </div>
          )}
        </div>
      </main>

      {/* View modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-pearl">{selected.name}</h3>
                <p className="text-sm text-muted">
                  <a href={`mailto:${selected.email}`} className="hover:text-primary">
                    {selected.email}
                  </a>
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-muted hover:text-ink"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {selected.subject && (
              <p className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-ink">
                {selected.subject}
              </p>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {selected.message}
            </p>
            <p className="mt-4 text-xs text-muted">
              {new Date(selected.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-xl border border-white/10 bg-obsidian-800 px-4 py-3 text-sm text-ink shadow-card backdrop-blur-xl">
          <CheckCircle2 size={16} className="text-teal" />
          {toast}
        </div>
      )}
    </div>
  );
}
