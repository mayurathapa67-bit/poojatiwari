"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, User, ArrowUpRight } from "lucide-react";
import type { WritingSample } from "@/lib/types";
import { imageSrc, formatDate } from "@/lib/utils";

export default function WritingSampleCard({
  sample,
  idx = 0,
}: {
  sample: WritingSample;
  idx?: number;
}) {
  const src = imageSrc(sample.featured_image);
  const isFeatured = sample.featured === true;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`card group flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-card-hover ${
        isFeatured ? "sm:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-strong">
        {src ? (
          <Image
            src={src}
            alt={sample.title}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-serif text-lg italic text-muted">{sample.category}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary backdrop-blur">
          {sample.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-burgundy" /> {sample.read_time} min read
          </span>
          <span>{formatDate(sample.published_date)}</span>
        </div>

        <h3 className="font-serif text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
          {sample.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{sample.excerpt}</p>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          {sample.client ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
              <User size={13} className="text-primary" /> {sample.client}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Read <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
