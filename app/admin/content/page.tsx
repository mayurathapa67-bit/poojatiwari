"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  FileEdit,
  Eye,
  EyeOff,
  X,
  Plus,
  Trash2,
  PenLine,
} from "lucide-react";
import type { PortfolioData, SectionKey } from "@/lib/types";
import AboutSection from "@/components/AboutSection";
import ServicesGrid from "@/components/ServicesGrid";
import Experience from "@/components/Experience";
import WritingSampleCard from "@/components/WritingSampleCard";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BlogPreview from "@/components/BlogPreview";
import ImageUploader from "@/components/ImageUploader";
import AdminSidebar, { MobileAdminBar, type AdminView } from "@/components/AdminSidebar";
import { useAdminAuth, AdminLogin } from "@/components/admin-auth";
import { cn } from "@/lib/utils";

type Toast = { type: "success" | "error"; msg: string } | null;

type FieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "image";
type FieldDef = {
  k: string;
  label: string;
  type?: FieldType;
  options?: string[];
  aspect?: "1:1" | "16:9";
};

const SECTIONS: { key: SectionKey; label: string; group: string }[] = [
  { key: "personal", label: "Profile", group: "Content" },
  { key: "nav", label: "Navigation", group: "Content" },
  { key: "hero", label: "Hero", group: "Content" },
  { key: "about", label: "About", group: "Content" },
  { key: "services", label: "Services", group: "Content" },
  { key: "portfolio", label: "Writing Samples", group: "Content" },
  { key: "blog", label: "Journal", group: "Content" },
  { key: "experience", label: "Experience", group: "Content" },
  { key: "testimonials", label: "Testimonials", group: "Content" },
  { key: "contact", label: "Contact", group: "Content" },
  { key: "socials", label: "Socials", group: "Content" },
];

export default function AdminContentPage() {
  const { authed, passwordInput, setPasswordInput, error, login, logout } =
    useAdminAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [drafts, setDrafts] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<SectionKey>("personal");
  const [toast, setToast] = useState<Toast>(null);
  const [saving, setSaving] = useState<"draft" | "local" | "publish" | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isProduction, setIsProduction] = useState(false);
  const [githubConfigured, setGithubConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    setIsProduction(
      typeof window !== "undefined" && window.location.hostname !== "localhost"
    );
  }, []);

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((res: { isConfigured: boolean }) => setGithubConfigured(res.isConfigured))
      .catch(() => setGithubConfigured(false));
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

  async function save(mode: "draft" | "local" | "publish") {
    if (!data) return;
    setSaving(mode);
    setToast(null);

    try {
      if (mode === "publish") {
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const body = await res.json();
        if (body.success) {
          setDrafts(new Set());
          setToast({
            type: "success",
            msg: "✅ Published! Changes committed to GitHub. Vercel will redeploy in 1-2 minutes.",
          });
        } else {
          setToast({
            type: "error",
            msg: `❌ Publish failed: ${body.error || body.details || "Unknown error"}`,
          });
        }
      } else {
        const res = await fetch(`/api/content/${active}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: apiPassword,
            data: (data as unknown as Record<string, unknown>)[active],
            publishMode: mode,
          }),
        });
        if (res.ok) {
          setDrafts((prev) => {
            const next = new Set(prev);
            if (mode === "draft") next.add(active);
            else next.delete(active);
            return next;
          });
          setToast({
            type: "success",
            msg: mode === "draft" ? "Draft saved locally" : "Saved to local db.json ✅",
          });
        } else {
          setToast({ type: "error", msg: "Save failed: unauthorized" });
        }
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
    <div className="relative min-h-screen bg-obsidian-900 lg:pl-64">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-mesh-1 blur-[120px]" />
      <AdminSidebar active="content" onLogout={logout} />
      <MobileAdminBar active="content" onLogout={logout} />

      <main className="relative z-10 container-px py-8 lg:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <PenLine size={14} /> Studio
            </p>
            <h1 className="font-serif text-3xl font-bold text-pearl">Content Editor</h1>
            <p className="mt-1 text-sm text-muted">
              Editing:{" "}
              <span className="font-medium text-pearl">
                {SECTIONS.find((s) => s.key === active)?.label}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setShowPreview((v) => !v)} className="btn-ghost">
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPreview ? "Hide Preview" : "Live Preview"}
            </button>
            <button onClick={() => save("draft")} disabled={saving !== null} className="btn-ghost">
              {saving === "draft" ? <Loader2 size={16} className="animate-spin" /> : <FileEdit size={16} />}
              Save Draft
            </button>
            <button onClick={() => save("local")} disabled={saving !== null} className="btn-ghost border border-white/10">
              {saving === "local" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Locally
            </button>
            <button
              onClick={() => save("publish")}
              disabled={saving !== null || githubConfigured === false}
              className="btn-primary"
              title={
                githubConfigured === false
                  ? "GitHub not configured — publish unavailable"
                  : "Commit to GitHub → Vercel auto-redeploys"
              }
            >
              {saving === "publish" ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
              Publish to GitHub
            </button>
          </div>
        </div>

        {isProduction && githubConfigured === false && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                ⚠️ GitHub not configured — &ldquo;Publish to GitHub&rdquo; will not update the live site.
              </p>
              <p className="mt-1 text-xs text-amber-400/80">
                Set <code className="rounded bg-amber-500/20 px-1 py-0.5 font-mono">GITHUB_TOKEN</code> and{" "}
                <code className="rounded bg-amber-500/20 px-1 py-0.5 font-mono">GITHUB_REPO</code> in Vercel env vars.
              </p>
            </div>
          </div>
        )}
        {isProduction && githubConfigured === true && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-3">
            <Globe size={20} className="mt-0.5 shrink-0 text-teal-400" />
            <div>
              <p className="text-sm font-semibold text-teal-300">
                🌐 PRODUCTION — GitHub configured. Publish commits changes & Vercel auto-redeploys.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-56 lg:shrink-0">
            <nav className="space-y-4">
              {["Content"].map((group) => (
                <div key={group}>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    {group}
                  </p>
                  <div className="space-y-1.5">
                    {SECTIONS.filter((s) => s.group === group).map((s) => (
                      <button
                        key={s.key}
                        onClick={() => setActive(s.key)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all",
                          active === s.key
                            ? "bg-accent-gradient font-medium text-white shadow-glow"
                            : "text-muted hover:bg-white/[0.04] hover:text-ink"
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

          <section className="min-w-0 flex-1">
            <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-card backdrop-blur-xl">
              <SectionForm active={active} data={data} setField={setField} setData={setData} />
            </div>
          </section>

          {showPreview && (
            <aside className="lg:w-[380px] lg:shrink-0">
              <div className="lg:sticky lg:top-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
                    </span>
                    Live Preview
                  </p>
                  <button onClick={() => setShowPreview(false)} className="text-muted hover:text-ink lg:hidden" aria-label="Close preview">
                    <X size={16} />
                  </button>
                </div>
                <div className="h-[70vh] overflow-y-auto rounded-3xl border border-white/[0.06] bg-obsidian-900">
                  <Preview active={active} data={data} />
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-obsidian-800 px-4 py-3 text-sm shadow-soft-lg backdrop-blur-xl"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${toast.type === "success" ? "bg-teal/15 text-teal" : "bg-danger/15 text-danger"}`}>
              {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </span>
            <span className={toast.type === "success" ? "text-ink" : "text-danger"}>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- Section forms ----------------------------- */

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
  const setSection = (section: SectionKey, value: unknown) => {
    setData((prev) => (prev ? { ...prev, [section]: value } : prev));
  };

  if (active === "personal")
    return (
      <Fields
        title="Profile"
        fields={[
          { k: "name", label: "Name" },
          { k: "profession", label: "Profession" },
          { k: "email", label: "Email" },
          { k: "phone", label: "Phone" },
          { k: "location", label: "Location" },
        ]}
        values={data.personal}
        onChange={(f, v) => setField("personal", f, v)}
      />
    );

  if (active === "nav")
    return (
      <>
        <Fields
          title="Navigation"
          fields={[{ k: "logo", label: "Logo Text" }]}
          values={data.nav}
          onChange={(f, v) => setField("nav", f, v)}
        />
        <div className="mt-4">
          <ArrayEditor
            title="Nav Links"
            items={data.nav.links.map((l, i) => ({ ...l, id: i + 1 }))}
            emptyItem={{ id: 0, label: "", href: "" }}
            fields={[
              { k: "label", label: "Label" },
              { k: "href", label: "Href" },
            ]}
            onChange={(items) =>
              setField(
                "nav",
                "links",
                items.map(({ label, href }) => ({ label, href }))
              )
            }
          />
        </div>
      </>
    );

  if (active === "hero")
    return (
      <>
        <Fields
          title="Hero"
          fields={[
            { k: "title", label: "Title" },
            { k: "role", label: "Role" },
          ]}
          values={data.hero}
          onChange={(f, v) => setField("hero", f, v)}
          textarea={[]}
        />
        <div className="mt-4">
          <label className="field-label">Tagline</label>
          <textarea
            value={data.hero.tagline}
            onChange={(e) => setField("hero", "tagline", e.target.value)}
            rows={3}
            className="field-input resize-y"
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SubFields
            title="Primary CTA"
            object={data.hero.cta_primary}
            defs={[
              { k: "label", label: "Label" },
              { k: "href", label: "Href" },
            ]}
            onChange={(obj) => setField("hero", "cta_primary", obj)}
          />
          <SubFields
            title="Secondary CTA"
            object={data.hero.cta_secondary}
            defs={[
              { k: "label", label: "Label" },
              { k: "href", label: "Href" },
            ]}
            onChange={(obj) => setField("hero", "cta_secondary", obj)}
          />
        </div>
        <div className="mt-4">
          <ImageUploader
            label="Hero Image"
            value={data.hero.image}
            onUploaded={(url) => setField("hero", "image", url)}
            maxSizeMB={5}
            aspect="16:9"
          />
        </div>
      </>
    );

  if (active === "about")
    return (
      <>
        <Fields
          title="About"
          fields={[
            { k: "headline", label: "Headline" },
          ]}
          values={data.about}
          onChange={(f, v) => setField("about", f, v)}
        />
        <div className="mt-4 space-y-4">
          <div>
            <label className="field-label">Bio</label>
            <textarea
              value={data.about.bio}
              onChange={(e) => setField("about", "bio", e.target.value)}
              rows={4}
              className="field-input resize-y"
            />
          </div>
          <div>
            <label className="field-label">Philosophy</label>
            <textarea
              value={data.about.philosophy}
              onChange={(e) => setField("about", "philosophy", e.target.value)}
              rows={3}
              className="field-input resize-y"
            />
          </div>
        </div>
        <div className="mt-4">
          <ImageUploader
            label="About Image"
            value={data.about.image}
            onUploaded={(url) => setField("about", "image", url)}
            maxSizeMB={5}
            aspect="1:1"
          />
        </div>
        <div className="mt-4">
          <ArrayEditor
            title="Expertise Areas"
            items={data.about.expertise}
            emptyItem={{ id: 0, title: "", description: "" }}
            fields={[
              { k: "title", label: "Title" },
              { k: "description", label: "Description", type: "textarea" },
            ]}
            textarea={["description"]}
            onChange={(items) => setField("about", "expertise", items)}
          />
        </div>
        <div className="mt-4">
          <ArrayEditor
            title="Experience (About)"
            items={data.about.experience}
            emptyItem={{ id: 0, company: "", position: "", duration: "", description: "" }}
            fields={[
              { k: "company", label: "Company" },
              { k: "position", label: "Position" },
              { k: "duration", label: "Duration" },
              { k: "description", label: "Description", type: "textarea" },
            ]}
            textarea={["description"]}
            onChange={(items) => setField("about", "experience", items)}
          />
        </div>
        <div className="mt-4">
          <label className="field-label">Certifications (comma separated)</label>
          <input
            value={data.about.certifications.join(", ")}
            onChange={(e) =>
              setField(
                "about",
                "certifications",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="field-input"
          />
        </div>
      </>
    );

  if (active === "services")
    return (
      <ArrayEditor
        title="Services"
        items={data.services}
        emptyItem={{ id: 0, title: "", description: "", icon: "PenLine", price: "", features: [] }}
        fields={[
          { k: "title", label: "Title" },
          { k: "description", label: "Description", type: "textarea" },
          { k: "icon", label: "Icon", type: "select", options: ["Compass", "Search", "PenLine", "Megaphone", "Mail"] },
          { k: "price", label: "Price (optional)" },
        ]}
        textarea={["description"]}
        arrayFields={["features"]}
        onChange={(items) => setSection("services", items)}
      />
    );

  if (active === "portfolio")
    return (
      <ArrayEditor
        title="Writing Samples"
        items={data.portfolio}
        emptyItem={{
          id: 0,
          title: "",
          category: "Blog Posts",
          excerpt: "",
          content: "",
          client: "",
          published_date: "",
          read_time: 5,
          featured_image: "",
          featured: false,
        }}
        fields={[
          { k: "title", label: "Title" },
          { k: "category", label: "Category", type: "select", options: ["Blog Posts", "SEO Content", "Website Copy", "Technical Writing", "Creative Writing"] },
          { k: "excerpt", label: "Excerpt", type: "textarea" },
          { k: "content", label: "Content", type: "textarea" },
          { k: "client", label: "Client (optional)" },
          { k: "published_date", label: "Published Date (YYYY-MM-DD)" },
          { k: "read_time", label: "Read Time (min)", type: "number" },
          { k: "featured_image", label: "Featured Image", type: "image", aspect: "16:9" },
          { k: "featured", label: "Featured", type: "checkbox" },
        ]}
        textarea={["excerpt", "content"]}

        onChange={(items) => setSection("portfolio", items)}
      />
    );

  if (active === "blog")
    return (
      <ArrayEditor
        title="Journal Posts"
        items={data.blog}
        emptyItem={{ id: 0, title: "", excerpt: "", content: "", published_date: "", read_time: 5, category: "", featured_image: "" }}
        fields={[
          { k: "title", label: "Title" },
          { k: "category", label: "Category" },
          { k: "excerpt", label: "Excerpt", type: "textarea" },
          { k: "content", label: "Content", type: "textarea" },
          { k: "published_date", label: "Published Date (YYYY-MM-DD)" },
          { k: "read_time", label: "Read Time (min)", type: "number" },
          { k: "featured_image", label: "Featured Image", type: "image", aspect: "16:9" },
        ]}
        textarea={["excerpt", "content"]}

        onChange={(items) => setSection("blog", items)}
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
          { k: "description", label: "Description", type: "textarea" },
        ]}
        textarea={["description"]}
        onChange={(items) => setSection("experience", items)}
      />
    );

  if (active === "testimonials")
    return (
      <ArrayEditor
        title="Testimonials"
        items={data.testimonials}
        emptyItem={{ id: 0, quote: "", name: "", role: "", company: "", avatar: "" }}
        fields={[
          { k: "quote", label: "Quote", type: "textarea" },
          { k: "name", label: "Name" },
          { k: "role", label: "Role" },
          { k: "company", label: "Company" },
          { k: "avatar", label: "Avatar", type: "image", aspect: "1:1" },
        ]}
        textarea={["quote"]}

        onChange={(items) => setSection("testimonials", items)}
      />
    );

  if (active === "contact")
    return (
      <>
        <Fields
          title="Contact"
          fields={[
            { k: "heading", label: "Heading" },
            { k: "email", label: "Email" },
            { k: "phone", label: "Phone" },
            { k: "location", label: "Location" },
          ]}
          values={data.contact}
          onChange={(f, v) => setField("contact", f, v)}
        />
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Socials</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["github", "linkedin", "twitter", "instagram"] as const).map((k) => (
              <div key={k}>
                <label className="field-label">{k}</label>
                <input
                  value={data.contact.socials[k]}
                  onChange={(e) =>
                    setField("contact", "socials", { ...data.contact.socials, [k]: e.target.value })
                  }
                  className="field-input"
                />
              </div>
            ))}
          </div>
        </div>
      </>
    );

  if (active === "socials")
    return (
      <Fields
        title="Socials"
        fields={[
          { k: "github", label: "GitHub" },
          { k: "linkedin", label: "LinkedIn" },
          { k: "twitter", label: "Twitter" },
          { k: "instagram", label: "Instagram" },
        ]}
        values={data.socials}
        onChange={(f, v) => setField("socials", f, v)}
      />
    );

  return null;
}

/* ------------------------------- Previews -------------------------------- */

function Preview({ active, data }: { active: SectionKey; data: PortfolioData }) {
  if (active === "about") return <AboutSection about={data.about} personal={data.personal} />;
  if (active === "services") return <ServicesGrid services={data.services} />;
  if (active === "experience") return <Experience experience={data.experience} />;
  if (active === "portfolio")
    return (
      <div className="grid gap-4 p-4">
        {data.portfolio.slice(0, 3).map((s, i) => (
          <WritingSampleCard key={s.id} sample={s} idx={i} />
        ))}
      </div>
    );
  if (active === "blog") return <BlogPreview posts={data.blog} />;
  if (active === "testimonials") return <TestimonialsCarousel testimonials={data.testimonials} />;
  if (active === "contact")
    return (
      <div className="space-y-2 p-4">
        <p className="text-sm font-semibold text-ink">{data.contact.heading}</p>
        <p className="text-sm text-muted">{data.contact.email}</p>
        <p className="text-sm text-muted">{data.contact.phone}</p>
        <p className="text-sm text-muted">{data.contact.location}</p>
      </div>
    );
  if (active === "hero")
    return (
      <div className="space-y-2 p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">{data.personal.profession}</p>
        <p className="text-2xl font-bold text-ink">{data.hero.title}</p>
        <p className="text-sm text-muted">{data.hero.role}</p>
        <p className="text-sm text-muted">{data.hero.tagline}</p>
        <p className="text-xs text-muted">
          CTAs: {data.hero.cta_primary.label} / {data.hero.cta_secondary.label}
        </p>
      </div>
    );
  if (active === "personal")
    return (
      <div className="space-y-1 p-6">
        <p className="text-xl font-bold text-ink">{data.personal.name}</p>
        <p className="text-sm text-primary">{data.personal.profession}</p>
        <p className="text-sm text-muted">{data.personal.email}</p>
        <p className="text-sm text-muted">{data.personal.phone}</p>
      </div>
    );
  if (active === "nav")
    return (
      <div className="space-y-1 p-6">
        <p className="text-sm font-semibold text-ink">{data.nav.logo}</p>
        {data.nav.links.map((l) => (
          <p key={l.href} className="text-sm text-muted">
            {l.label} → {l.href}
          </p>
        ))}
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

/* ----------------------------- Field helpers ----------------------------- */

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
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
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

function SubFields<T extends object>({
  title,
  object,
  defs,
  onChange,
}: {
  title: string;
  object: T;
  defs: { k: string; label: string }[];
  onChange: (obj: T) => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{title}</p>
      <div className="space-y-3">
        {defs.map((d) => (
          <div key={d.k}>
            <label className="mb-1 block text-xs font-medium text-muted">{d.label}</label>
            <input
              value={String((object as Record<string, unknown>)[d.k] ?? "")}
              onChange={(e) => onChange({ ...object, [d.k]: e.target.value })}
              className="field-input"
            />
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
  onChange,
}: {
  title: string;
  items: T[];
  emptyItem: T;
  fields: FieldDef[];
  textarea?: string[];
  arrayFields?: string[];
  onChange: (items: T[]) => void;
}) {
  const update = (id: number, field: string, value: unknown) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)) as T[]);
  };
  const add = () => {
    const maxId = items.length ? Math.max(...items.map((i) => i.id)) : 0;
    onChange([...items, { ...emptyItem, id: maxId + 1 }] as T[]);
  };
  const remove = (id: number) => onChange(items.filter((i) => i.id !== id) as T[]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">{title}</h3>
        <button
          onClick={add}
          className="rounded-lg border border-primary/40 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-white"
        >
          <Plus size={14} className="mr-1 inline" /> Add
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs text-muted">[{item.id}]</span>
              <button onClick={() => remove(item.id)} className="text-muted hover:text-danger" aria-label="Remove">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fields.map((f) => {
                const val = (item as Record<string, unknown>)[f.k];
                if (f.type === "textarea" || textarea.includes(f.k))
                  return (
                    <div key={f.k} className="sm:col-span-2">
                      <FieldLabel label={f.label} />
                      <textarea
                        value={String(val ?? "")}
                        onChange={(e) => update(item.id, f.k, e.target.value)}
                        rows={3}
                        className="field-input resize-y"
                      />
                    </div>
                  );
                if (f.type === "number")
                  return (
                    <div key={f.k}>
                      <FieldLabel label={f.label} />
                      <input
                        type="number"
                        value={Number(val ?? 0)}
                        onChange={(e) => update(item.id, f.k, Number(e.target.value))}
                        className="field-input"
                      />
                    </div>
                  );
                if (f.type === "select")
                  return (
                    <div key={f.k}>
                      <FieldLabel label={f.label} />
                      <select
                        value={String(val ?? "")}
                        onChange={(e) => update(item.id, f.k, e.target.value)}
                        className="field-input"
                      >
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                if (f.type === "checkbox")
                  return (
                    <div key={f.k} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) => update(item.id, f.k, e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      <FieldLabel label={f.label} />
                    </div>
                  );
                if (f.type === "image")
                  return (
                    <div key={f.k} className="sm:col-span-2">
                      <ImageUploader
                        label={f.label}
                        value={String(val ?? "")}
                        onUploaded={(url) => update(item.id, f.k, url)}
                        maxSizeMB={5}
                        aspect={f.aspect ?? "16:9"}
                      />
                    </div>
                  );
                return (
                  <div key={f.k}>
                    <FieldLabel label={f.label} />
                    <input
                      value={String(val ?? "")}
                      onChange={(e) => update(item.id, f.k, e.target.value)}
                      className="field-input"
                    />
                  </div>
                );
              })}
              {arrayFields.map((f) => (
                <div key={f} className="sm:col-span-2">
                  <FieldLabel label={`${f} (comma separated)`} />
                  <input
                    value={((item as Record<string, unknown>)[f] as string[])?.join(", ") ?? ""}
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
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No items. Click “Add”.</p>}
      </div>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <label className="mb-1 block text-xs font-medium text-muted">{label}</label>;
}
