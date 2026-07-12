"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Minus } from "lucide-react";
import type { ExperienceItem } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function Experience({
  experience,
}: {
  experience: ExperienceItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section id="experience" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Career"
          title={
            <>
              The <span className="serif-accent">journey</span>
            </>
          }
        />

        <div ref={ref} className="relative mx-auto max-w-3xl pl-10 sm:pl-14">
          {/* Drawn line */}
          <div className="absolute bottom-2 left-[14px] top-2 w-px bg-white/10 sm:left-[22px]" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-2 left-[14px] top-2 w-px origin-top bg-accent-gradient sm:left-[22px]"
          />

          <div className="space-y-10">
            {experience.map((item, idx) => (
              <TimelineNode key={item.id} item={item} idx={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ item, idx }: { item: ExperienceItem; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Node */}
      <motion.span
        initial={{ scale: 0, boxShadow: "0 0 0px rgba(99,102,241,0)" }}
        whileInView={{ scale: 1, boxShadow: "0 0 22px 2px rgba(99,102,241,0.55)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute -left-[34px] top-3 flex h-6 w-6 items-center justify-center rounded-full border border-primary/50 bg-obsidian text-primary sm:-left-[42px]"
      >
        <Briefcase size={12} />
      </motion.span>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="glass group w-full rounded-2xl p-6 text-left transition-colors hover:border-white/15"
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-pearl transition-colors group-hover:text-white">
              {item.position}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-muted">{item.company}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-teal">
              {item.duration}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-muted transition-colors group-hover:text-ink">
              {open ? <Minus size={14} /> : <Plus size={14} />}
            </span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pt-4 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
