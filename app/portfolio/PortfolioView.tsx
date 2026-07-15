"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WritingSampleCard from "@/components/WritingSampleCard";
import SectionHeading from "@/components/SectionHeading";
import type {
  PersonalInfo,
  Nav,
  WritingSample,
  WritingCategory,
  ContactInfo,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: ("All" | WritingCategory)[] = [
  "All",
  "Blog Posts",
  "SEO Content",
  "Website Copy",
  "Technical Writing",
  "Creative Writing",
];

export default function PortfolioView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personal");
  const { data: nav } = useJson<Nav>("/api/content/nav");
  const { data: portfolio } = useJson<WritingSample[]>("/api/content/portfolio", []);
  const { data: contact } = useJson<ContactInfo>("/api/content/contact");

  const [category, setCategory] = useState<"All" | WritingCategory>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!portfolio) return [];
    const q = query.toLowerCase().trim();
    return portfolio.filter((s) => {
      const matchCat = category === "All" || s.category === category;
      const matchQuery =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        (s.client ?? "").toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [portfolio, category, query]);

  if (!personal || !nav || !portfolio || !contact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />

      <section className="section-pad bg-cream">
        <div className="container-px">
          <SectionHeading
            eyebrow="Portfolio"
            title={
              <>
                The <span className="serif-accent">writing</span> portfolio
              </>
            }
            subtitle="Browse by category or search — every piece is built to inform, persuade or delight."
          />

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    category === c
                      ? "border-transparent bg-accent-gradient text-white shadow-glow"
                      : "border-line bg-white/60 text-ink hover:border-line-strong"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2.5">
              <Search size={16} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search samples..."
                className="w-44 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={15} className="text-muted hover:text-ink" />
                </button>
              )}
            </div>
          </div>

          {filtered.length > 0 ? (
            <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((sample, i) => (
                <WritingSampleCard key={sample.id} sample={sample} idx={i} />
              ))}
            </motion.div>
          ) : (
            <p className="py-20 text-center text-muted">
              No writing samples match your filters.
            </p>
          )}
        </div>
      </section>

      <Footer contact={contact} />
    </main>
  );
}
