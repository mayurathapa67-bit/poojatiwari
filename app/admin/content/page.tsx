"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import type { PortfolioData, SectionKey } from "@/lib/types";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import Experience from "@/components/Experience";
import ImageUploader from "@/components/ImageUploader";
import AdminSidebar, { MobileAdminBar, type AdminView } from "@/components/AdminSidebar";
import { useAdminAuth, AdminLogin } from "@/components/admin-auth";
import { cn } from "@/lib/utils";

type Toast = { type: "success" | "error"; msg: string } | null;

const SECTIONS: { key: SectionKey; label: string; group: string }[] = [
  { key: "personalInfo", label: "Personal Info", group: "Profile" },
  { key: "hero", label: "Hero", group: "Profile" },
  { key: "about", label: "About", group: "Content" },
  { key: "experience", label: "Experience", group: "Content" },
  { key: "projects", label: "Projects", group: "Content" },
  { key: "contact", label: "Contact", group: "Content" },
  { key: "socials", label: "Socials", group: "Content" },
];

export default function AdminContentPage() {
  const { authed, passwordInput, setPasswordInput, error, login, logout } =
    useAdminAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [drafts, setDrafts] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<SectionKey>("personalInfo");
  const [toast, setToast] = useState<Toast>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    setIsProduction(
      typeof window !== "undefined" && window.location.hostname !== "localhost"
    );
  }, []);

  const apiPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin2024";

  useEffect(() => {
    if (!authed || data) return;
    Promise.all([
      fetch("/api/content").then((r) => r.json()),
      fetch("/api/content/drafts")
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    ]).then(([published, draftData]: [PortfolioData, Partial<PortfolioData>]) => {
      const merged = { ...published } as PortfolioData;
      for (const key of Object.keys(draftData) as SectionKey[]) {
        if (draftData[key])
          (merged as unknown as Record<string, unknown>)[key] = draftData[key];
      }
      setData(merged);
      setDrafts(new Set(Object.keys(draftData)));
    });
  }, [authed, data]);

  async function save(mode: "draft" | "publish") {
    if (!data) return;
    setSaving(mode);
    setToast(null);
    try {
      const res = await fetch(`/api/content/${active}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: apiPassword,
          data: (data as unknown as Record<string, unknown>)[active],
          draft: mode === "draft",
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setDrafts((prev) => {
          const next = new Set(prev);
          if (mode === "draft") next.add(active);
          else next.delete(active);
          return next;
        });
        if (mode === "publish") {
          const parts: string[] = [];
          if (body.edge) parts.push("Published to Edge Config");
          if (body.github) parts.push("Committed to GitHub — redeploying...");
          if (!body.edge && !body.github) parts.push("Saved locally (file-based DB)");
          setToast({
            type: "success",
            msg: parts.join(" · "),
          });
        } else {
          setToast({
            type: "success",
            msg: "Draft saved locally",
          });
        }
      } else {
        setToast({ type: "error", msg: "Save failed: unauthorized" });
      }
    } catch {
      setToast({ type: "error", msg: "Network error" });
    } finally {
      setSaving(null);
    }
  }

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

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-primary">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const setField = <K extends keyof PortfolioData>(
    section: K,
    field: string,
    value: unknown
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: { ...(prev[section] as object), [field]: value },
      };
    });
  };

  return (
    <div className="min-h-screen lg:pl-64">
      <AdminSidebar active="content" onLogout={logout} />
      <MobileAdminBar active="content" onLogout={logout} />

      <main className="container-px py-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-pearl">Content Editor</h1>
            <p className="mt-1 text-sm text-muted">
              Editing: <span className="text-ink">{SECTIONS.find((s) => s.key === active)?.label}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="btn-ghost"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? "Hide Preview" : "Live Preview"}
            </button>
            <button onClick={() => save("draft")} disabled={saving !== null} className="btn-ghost">
              {saving === "draft" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Draft
            </button>
            <button onClick={() => save("publish")} disabled={saving !== null} className="btn-primary">
              {saving === "publish" ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Publish
            </button>
          </div>
        </div>

        {/* Production warning banner */}
        {isProduction && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                ⚠️ You are on PRODUCTION. Admin changes work locally only.
              </p>
              <p className="mt-1 text-xs text-amber-400/80">
                To update the live site: Edit <code className="rounded bg-amber-500/20 px-1 py-0.5 font-mono">data/seed.json</code> locally → Commit → Push to GitHub
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Section nav */}
          <aside className="lg:w-52 lg:shrink-0">
            <nav className="space-y-4">
              {["Profile", "Content"].map((group) => (
                <div key={group}>
                  <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {group}
                  </p>
                  <div className="space-y-0.5">
                    {SECTIONS.filter((s) => s.group === group).map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setActive(s.key)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          active === s.key
                            ? "bg-white/[0.06] font-medium text-pearl"
                            : "text-muted hover:bg-white/[0.03] hover:text-ink"
                        )}
                      >
                        {s.label}
                        {drafts.has(s.key) && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" title="Draft saved" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Editor */}
          <section className="min-w-0 flex-1">
            <div className="glass p-6">
              <SectionForm active={active} data={data} setField={setField} setData={setData} />
            </div>
          </section>

          {/* Live preview */}
          {showPreview && (
            <aside className="lg:w-[360px] lg:shrink-0">
              <div className="lg:sticky lg:top-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Live Preview
                  </p>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-muted hover:text-ink lg:hidden"
                    aria-label="Close preview"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="h-[70vh] overflow-y-auto rounded-2xl border border-white/[0.06] bg-obsidian-900">
                  <Preview active={active} data={data} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-xl border border-white/10 bg-obsidian-800 px-4 py-3 text-sm shadow-card backdrop-blur-xl">
          {toast.type === "success" ? (
            <CheckCircle2 size={16} className="text-teal" />
          ) : (
            <AlertCircle size={16} className="text-danger" />
          )}
          <span className={toast.type === "success" ? "text-ink" : "text-danger"}>
            {toast.msg}
          </span>
        </div>
      )}
    </div>
  );
}

function SectionForm({
  active,
  data,
  setField,
  setData,
}: {
  active: SectionKey;
  data: PortfolioData;
  setField: <K extends keyof PortfolioData>(s: K, f: string, v: unknown) => void;
  setData: React.Dispatch<React.SetStateAction<PortfolioData | null>>;
}) {
  if (active === "personalInfo")
    return (
      <>
        <Fields
          title="Personal Info"
          fields={[
            { k: "name", label: "Name" },
            { k: "profession", label: "Profession" },
            { k: "phone", label: "Phone" },
            { k: "email", label: "Email" },
            { k: "locationAU", label: "Location (AU)" },
            { k: "locationNP", label: "Location (NP)" },
          ]}
          values={data.personalInfo}
          onChange={(f, v) => setField("personalInfo", f, v)}
        />
        <div className="mt-4">
          <ImageUploader
            label="Profile Photo"
            kind="profile"
            value={data.personalInfo.avatar}
            onUploaded={(img) => setField("personalInfo", "avatar", img)}
            maxSizeMB={5}
            aspect="1:1"
          />
        </div>
      </>
    );
  if (active === "hero")
    return (
      <Fields
        title="Hero"
        fields={[
          { k: "title", label: "Title" },
          { k: "subtitle", label: "Subtitle" },
          { k: "ctaText", label: "CTA Text" },
        ]}
        values={data.hero}
        onChange={(f, v) => setField("hero", f, v)}
      />
    );
  if (active === "about")
    return (
      <>
        <Fields
          title="About"
          fields={[
            { k: "heading", label: "Heading" },
            { k: "description", label: "Description" },
          ]}
          values={data.about}
          onChange={(f, v) => setField("about", f, v)}
          textarea={["description"]}
        />
        <div className="mt-4">
          <label className="field-label">Skills (comma separated)</label>
          <input
            value={data.about.skills.join(", ")}
            onChange={(e) =>
              setField(
                "about",
                "skills",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="field-input"
          />
        </div>
      </>
    );
  if (active === "contact")
    return (
      <Fields
        title="Contact"
        fields={[
          { k: "heading", label: "Heading" },
          { k: "email", label: "Email" },
          { k: "phone", label: "Phone" },
          { k: "locationAU", label: "Location (AU)" },
          { k: "locationNP", label: "Location (NP)" },
        ]}
        values={data.contact}
        onChange={(f, v) => setField("contact", f, v)}
      />
    );
  if (active === "socials")
    return (
      <Fields
        title="Socials"
        fields={[
          { k: "github", label: "GitHub" },
          { k: "linkedin", label: "LinkedIn" },
          { k: "twitter", label: "Twitter" },
        ]}
        values={data.socials}
        onChange={(f, v) => setField("socials", f, v)}
      />
    );
  if (active === "experience")
    return (
      <ArrayEditor
        title="Experience"
        items={data.experience}
        emptyItem={{ id: 0, company: "", position: "", duration: "", description: "" }}
        fields={[
          { k: "company", label: "Company" },
          { k: "position", label: "Position" },
          { k: "duration", label: "Duration" },
          { k: "description", label: "Description" },
        ]}
        textarea={["description"]}
        onChange={(items) => setData((d) => (d ? { ...d, experience: items } : d))}
      />
    );
  if (active === "projects")
    return (
      <ArrayEditor
        title="Projects"
        items={data.projects}
        emptyItem={{ id: 0, title: "", description: "", tech: [], link: "", image: { original: "" } }}
        fields={[
          { k: "title", label: "Title" },
          { k: "description", label: "Description" },
          { k: "link", label: "Link" },
        ]}
        textarea={["description"]}
        arrayFields={["tech"]}
        imageField="image"
        imageKind="project"
        onChange={(items) => setData((d) => (d ? { ...d, projects: items } : d))}
      />
    );
  return null;
}

function Preview({ active, data }: { active: SectionKey; data: PortfolioData }) {
  if (active === "about") return <AboutSection about={data.about} personal={data.personalInfo} />;
  if (active === "projects") return <ProjectsSection projects={data.projects} />;
  if (active === "experience") return <Experience experience={data.experience} />;
  if (active === "contact")
    return (
      <div className="space-y-2 p-4">
        <p className="text-sm font-semibold text-ink">{data.contact.heading}</p>
        <p className="text-sm text-muted">{data.contact.email}</p>
        <p className="text-sm text-muted">{data.contact.phone}</p>
        <p className="text-sm text-muted">{data.contact.locationAU}</p>
        <p className="text-sm text-muted">{data.contact.locationNP}</p>
      </div>
    );
  if (active === "hero")
    return (
      <div className="space-y-2 p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {data.personalInfo.profession}
        </p>
        <p className="text-2xl font-bold text-ink">{data.hero.title}</p>
        <p className="text-sm text-muted">{data.hero.subtitle}</p>
      </div>
    );
  if (active === "personalInfo")
    return (
      <div className="space-y-1 p-6">
        <p className="text-xl font-bold text-ink">{data.personalInfo.name}</p>
        <p className="text-sm text-primary">{data.personalInfo.profession}</p>
        <p className="text-sm text-muted">{data.personalInfo.email}</p>
        <p className="text-sm text-muted">{data.personalInfo.phone}</p>
      </div>
    );
  if (active === "socials")
    return (
      <div className="space-y-1 p-6">
        {Object.entries(data.socials).map(([k, v]) => (
          <p key={k} className="truncate text-sm text-muted">
            <span className="font-medium text-ink">{k}:</span> {v}
          </p>
        ))}
      </div>
    );
  return null;
}

function Fields<T extends object>({
  title,
  fields,
  values,
  onChange,
  textarea = [],
}: {
  title: string;
  fields: { k: string; label: string }[];
  values: T;
  onChange: (field: string, value: string) => void;
  textarea?: string[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.k} className={textarea.includes(f.k) ? "sm:col-span-2" : ""}>
            <label className="field-label">{f.label}</label>
            {textarea.includes(f.k) ? (
              <textarea
                value={String((values as Record<string, unknown>)[f.k] ?? "")}
                onChange={(e) => onChange(f.k, e.target.value)}
                rows={4}
                className="field-input resize-y"
              />
            ) : (
              <input
                value={String((values as Record<string, unknown>)[f.k] ?? "")}
                onChange={(e) => onChange(f.k, e.target.value)}
                className="field-input"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrayEditor<T extends { id: number }>({
  title,
  items,
  emptyItem,
  fields,
  textarea = [],
  arrayFields = [],
  imageField,
  imageKind = "project",
  onChange,
}: {
  title: string;
  items: T[];
  emptyItem: T;
  fields: { k: string; label: string }[];
  textarea?: string[];
  arrayFields?: string[];
  imageField?: string;
  imageKind?: "profile" | "project";
  onChange: (items: T[]) => void;
}) {
  const update = (id: number, field: string, value: unknown) => {
    onChange(
      items.map((it) => (it.id === id ? { ...it, [field]: value } : it)) as T[]
    );
  };
  const add = () => {
    const maxId = items.length ? Math.max(...items.map((i) => i.id)) : 0;
    onChange([...items, { ...emptyItem, id: maxId + 1 }] as T[]);
  };
  const remove = (id: number) => onChange(items.filter((i) => i.id !== id) as T[]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {title}
        </h3>
        <button
          onClick={add}
          className="rounded-lg border border-primary/40 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-white"
        >
          Add
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">[{item.id}]</span>
              <button onClick={() => remove(item.id)} className="text-muted hover:text-danger">
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.k} className={textarea.includes(f.k) ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-medium text-muted">{f.label}</label>
                  {textarea.includes(f.k) ? (
                    <textarea
                      value={String((item as Record<string, unknown>)[f.k] ?? "")}
                      onChange={(e) => update(item.id, f.k, e.target.value)}
                      rows={3}
                      className="field-input resize-y"
                    />
                  ) : (
                    <input
                      value={String((item as Record<string, unknown>)[f.k] ?? "")}
                      onChange={(e) => update(item.id, f.k, e.target.value)}
                      className="field-input"
                    />
                  )}
                </div>
              ))}
              {arrayFields.map((f) => (
                <div key={f} className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-muted">
                    {f} (comma separated)
                  </label>
                  <input
                    value={
                      ((item as Record<string, unknown>)[f] as string[])?.join(", ") ?? ""
                    }
                    onChange={(e) =>
                      update(
                        item.id,
                        f,
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className="field-input"
                  />
                </div>
              ))}
              {imageField && (
                <div className="sm:col-span-2">
                  <ImageUploader
                    label="Project Image"
                    kind={imageKind}
                    value={(item as Record<string, unknown>)[imageField] as never}
                    onUploaded={(img) => update(item.id, imageField, img)}
                    maxSizeMB={3}
                    aspect="16:9"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No items. Click “Add”.</p>}
      </div>
    </div>
  );
}
