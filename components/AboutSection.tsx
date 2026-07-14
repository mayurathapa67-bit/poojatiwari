"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Award } from "lucide-react";
import type { About, PersonalInfo } from "@/lib/types";
import { imageSrc } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function AboutSection({
  about,
  personal,
}: {
  about: About;
  personal: PersonalInfo;
}) {
  const image = imageSrc(about.image) || imageSrc(personal.avatar);

  return (
    <section id="about" className="section-pad bg-cream">
      <div className="container-px">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              Writing is the shortest distance between a brand and a{" "}
              <span className="serif-accent">believer</span>.
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            {image && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-soft-lg">
                <Image
                  src={image}
                  alt={personal.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover"
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <p className="text-lg leading-relaxed text-ink/90">{about.bio}</p>

            <div className="my-8 flex gap-4 rounded-2xl border border-line bg-white/60 p-6 shadow-card">
              <Quote size={28} className="shrink-0 text-burgundy" />
              <p className="pull-quote text-lg leading-relaxed">{about.philosophy}</p>
            </div>

            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
              Areas of Expertise
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {about.expertise.map((area) => (
                <div
                  key={area.id}
                  className="rounded-2xl border border-line bg-white/60 p-5 shadow-sm transition-all hover:border-line-strong hover:shadow-card"
                >
                  <p className="font-serif text-lg font-semibold text-ink">{area.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{area.description}</p>
                </div>
              ))}
            </div>

            {about.certifications.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
                  <Award size={16} className="text-primary" /> Certifications
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {about.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
