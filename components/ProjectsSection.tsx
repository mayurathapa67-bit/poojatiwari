import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/lib/types";
import { imageSrc } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  return (
    <section id="projects" className="section-pad bg-surface">
      <div className="container-px">
        <SectionHeading
          eyebrow="Work"
          title="Selected Projects"
          subtitle="A selection of products and platforms I've designed and shipped."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => {
            const src = imageSrc(project.image, "medium");
            return (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="card group flex flex-col transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover"
              >
                <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-teal/10">
                  {src ? (
                    <Image
                      src={src}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="font-mono text-sm text-primary/40">
                      {project.tech[0] ?? "project"}
                    </span>
                  )}
                </div>

                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  <ExternalLink
                    size={16}
                    className="mt-1 shrink-0 text-muted transition-colors group-hover:text-primary"
                  />
                </div>

                <p className="mb-4 flex-1 text-sm text-muted">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
