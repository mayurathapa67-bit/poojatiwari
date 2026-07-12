"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { About, PersonalInfo } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function AboutSection({
  about,
  personal,
}: {
  about: About;
  personal: PersonalInfo;
}) {
  return (
    <section id="about" className="section-pad bg-background">
      <div className="container-px">
        <SectionHeading eyebrow="About" title={about.heading} />

        <div className="grid gap-10 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <p className="text-lg leading-relaxed text-muted">
              {about.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-2">
                <User size={16} className="text-primary" />
                {personal.email}
              </span>
              <span>{personal.phone}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
              Skills
            </h3>
            <ul className="space-y-3">
              {about.skills.map((skill) => (
                <li key={skill}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{skill}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
