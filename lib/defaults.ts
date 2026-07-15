import type { PortfolioData, SectionKey } from "./types";

// Default content shapes. These guarantee every section always returns a
// correctly-typed object/array even when the database is empty (e.g. on Vercel
// where `readDB` returns `{}`), preventing client-side crashes from accessing
// undefined nested properties like `personal.name` or `nav.links`.
export const SECTION_DEFAULTS: Record<SectionKey, unknown> = {
  personal: {
    name: "Pooja Tiwari",
    profession: "Content Writer & Copywriter",
    email: "",
    phone: "",
    location: "",
    avatar: "",
  },
  nav: {
    logo: "Pooja Tiwari",
    links: [],
  },
  hero: {
    title: "Words that do the work",
    role: "Content Writer & Copywriter",
    tagline: "",
    cta_primary: { label: "Hire Me", href: "/contact" },
    cta_secondary: { label: "View Work", href: "/portfolio" },
    image: "",
  },
  about: {
    headline: "",
    bio: "",
    philosophy: "",
    expertise: [],
    experience: [],
    certifications: [],
    image: "",
  },
  services: [],
  portfolio: [],
  blog: [],
  experience: [],
  testimonials: [],
  contact: {
    heading: "Let's work together",
    email: "",
    phone: "",
    location: "",
    socials: { github: "", linkedin: "", twitter: "", instagram: "" },
  },
  socials: {
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  },
};

export function sectionToArray(section: SectionKey): boolean {
  return ["services", "portfolio", "blog", "experience", "testimonials"].includes(section);
}

/**
 * Resolve a section's content: fallback to defaults, then layer any stored
 * data on top so real content always wins while missing fields stay safe.
 */
export function resolveSection(
  section: SectionKey,
  db: Partial<PortfolioData>
): unknown {
  const stored = (db as Record<string, unknown>)[section];

  if (sectionToArray(section)) {
    return Array.isArray(stored) ? stored : [];
  }

  const def = SECTION_DEFAULTS[section] as Record<string, unknown>;
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    // One-level merge so nested defaults (e.g. contact.socials) survive.
    const merged: Record<string, unknown> = { ...def, ...(stored as Record<string, unknown>) };
    for (const key of Object.keys(def)) {
      const dv = def[key];
      const sv = (stored as Record<string, unknown>)[key];
      if (
        dv &&
        typeof dv === "object" &&
        !Array.isArray(dv) &&
        sv &&
        typeof sv === "object" &&
        !Array.isArray(sv)
      ) {
        merged[key] = { ...dv, ...(sv as Record<string, unknown>) };
      }
    }
    return merged;
  }
  return def;
}
