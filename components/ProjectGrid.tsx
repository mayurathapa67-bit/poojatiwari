"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/lib/types";
import { imageSrc } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function ProjectGrid({ projects }: { projects: ProjectItem[] }) {
  return (
    <section id="projects" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Work"
          title={
            <>
              Selected <span className="serif-accent">projects</span>
            </>
          }
          subtitle="A selection of products and platforms I've designed and shipped."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, idx }: { project: ProjectItem; idx: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const src = imageSrc(project.image, "medium");
  const hasLink = !!project.link;

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <motion.a
      ref={ref}
      href={hasLink ? project.link : "#"}
      target={hasLink ? "_blank" : undefined}
      rel={hasLink ? "noopener noreferrer" : undefined}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`spotlight-card group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 shadow-card backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1.5 hover:border-white/15 ${
        idx === 0 ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-teal/10">
        {src ? (
          <Image
            src={src}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-sm text-muted">
              {project.title || "Untitled"}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-pearl">
            {project.title || "Untitled Project"}
          </h3>
          {hasLink && (
            <ExternalLink
              size={16}
              className="mt-1 shrink-0 text-muted transition-colors group-hover:text-primary"
            />
          )}
        </div>

        <p className="mb-3 flex-1 text-sm text-muted">
          {project.description || "Details coming soon."}
        </p>

        {project.tech.length > 0 && (
          <div className="marquee-wrap mt-auto flex gap-2 overflow-hidden">
            <div className="marquee-track">
              {[...project.tech, ...project.tech].map((t, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.a>
  );
}
