"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import type { Hero as HeroType, PersonalInfo } from "@/lib/types";
import { imageSrc } from "@/lib/utils";
import Magnetic from "./Magnetic";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const word = {
  hidden: { y: "115%", opacity: 0, filter: "blur(8px)" },
  show: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({
  hero,
  personal,
}: {
  hero: HeroType;
  personal: PersonalInfo;
}) {
  const image = imageSrc(hero.image) || imageSrc(personal.avatar);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const words = hero.title.split(" ");
  const accentIdx = Math.floor(words.length / 2);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-20 h-[28rem] w-[28rem] rounded-full bg-mesh-1 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[24rem] w-[24rem] rounded-full bg-mesh-2 blur-[100px]"
      />

      <motion.div style={{ y, opacity: fade }} className="container-px relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {hero.role}
            </motion.div>

            <motion.h1
              variants={container}
              initial="hidden"
              animate="show"
              className="font-serif text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-ink"
            >
              {words.map((w, i) => (
                <span key={i} className="mr-[0.2em] inline-block overflow-hidden align-bottom">
                  <motion.span variants={word} className="inline-block">
                    {i === accentIdx ? <span className="serif-accent">{w}</span> : w}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
            >
              {hero.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.4}>
                <a href={hero.cta_primary.href} className="btn-primary group">
                  {hero.cta_primary.label}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a href={hero.cta_secondary.href} className="btn-ghost">
                  <Sparkles size={16} /> {hero.cta_secondary.label}
                </a>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-medium text-ink">Available for projects</span>
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-burgundy" />
                6+ years writing
              </span>
            </motion.div>
          </div>

          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative lg:col-span-5"
            >
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-line shadow-soft-lg">
                <Image
                  src={image}
                  alt={personal.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
              </div>
              <span className="absolute -bottom-4 -left-4 rotate-[-4deg] rounded-2xl border border-line bg-white/80 px-4 py-2 font-serif text-sm italic text-ink shadow-card backdrop-blur-xl">
                “Every word earns its place.”
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
