"use client";

import { motion } from "framer-motion";
import { Globe, MapPin, Code2, Cpu, Layers } from "lucide-react";
import type { About, PersonalInfo } from "@/lib/types";
import SectionHeading from "./SectionHeading";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const SNIPPET = [
  { t: "interface", c: "text-teal" },
  { t: "Architecture", c: "text-ink" },
  { t: " {", c: "text-muted" },
  { t: "\n  ingest:", c: "text-primary" },
  { t: " Pipeline;", c: "text-ink" },
  { t: "\n  model:", c: "text-primary" },
  { t: " Serving<GPU>;", c: "text-ink" },
  { t: "\n  ui:", c: "text-primary" },
  { t: " React + ", c: "text-ink" },
  { t: "Next", c: "text-ink" },
  { t: ".tsx;", c: "text-ink" },
  { t: "\n}", c: "text-muted" },
];

export default function BentoAbout({
  about,
  personal,
}: {
  about: About;
  personal: PersonalInfo;
}) {
  return (
    <section id="about" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              Architecting <span className="serif-accent">intelligent</span> systems
            </>
          }
          subtitle={about.heading}
        />

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Box 1 — Bio with animated gradient border */}
          <motion.div
            variants={item}
            className="gradient-border glass lg:col-span-2 lg:row-span-2 lg:p-10"
          >
            <div className="flex h-full flex-col justify-between gap-6 p-6 lg:p-2">
              <div>
                <span className="eyebrow">Bio</span>
                <p className="max-w-2xl text-lg leading-relaxed text-ink/90">
                  {about.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Cpu size={16} className="text-teal" /> {personal.email}
                </span>
                <span className="flex items-center gap-2">
                  <Layers size={16} className="text-primary" /> {personal.phone}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Box 2 — Tech stack, floating pills */}
          <motion.div variants={item} className="glass p-6">
            <span className="eyebrow">Stack</span>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {about.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-ink shadow-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Box 3 — Location with animated globe */}
          <motion.div variants={item} className="glass flex flex-col p-6">
            <span className="eyebrow">Based in</span>
            <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-4">
              <div className="relative">
                <Globe size={64} className="animate-spin-slow text-primary/80" />
                <span className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-teal shadow-glow" />
              </div>
              <div className="text-center text-sm text-muted">
                <p className="flex items-center justify-center gap-1.5 text-ink">
                  <MapPin size={14} className="text-teal" /> {personal.locationAU}, AU
                </p>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-ink">
                  <MapPin size={14} className="text-primary" /> {personal.locationNP}, NP
                </p>
              </div>
            </div>
          </motion.div>

          {/* Box 4 — Stylized code snippet */}
          <motion.div
            variants={item}
            className="glass overflow-hidden p-0 lg:col-span-3"
          >
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-danger/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-teal/70" />
              <span className="ml-2 flex items-center gap-1.5 text-xs text-muted">
                <Code2 size={13} /> architecture.ts
              </span>
            </div>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-sm leading-relaxed">
              <code>
                {SNIPPET.map((s, i) => (
                  <span key={i} className={s.c}>
                    {s.t}
                  </span>
                ))}
              </code>
            </pre>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
