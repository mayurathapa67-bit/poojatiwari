"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { imageSrc, formatDate } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  const latest = safePosts.slice(0, 3);

  return (
    <section id="blog" className="section-pad bg-cream">
      <div className="container-px">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Journal"
            title={
              <>
                Thoughts on <span className="serif-accent">writing</span>
              </>
            }
          />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5"
          >
            All articles <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((post, idx) => {
            const src = imageSrc(post.featured_image);
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card group flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-strong">
                  {src && (
                    <Image
                      src={src}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute left-3 top-3 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-burgundy backdrop-blur">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary" /> {post.read_time} min
                    </span>
                    <span>{formatDate(post.published_date)}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <Link
                    href="/blog"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    Read article <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
