"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Hero as HeroType, PersonalInfo } from "@/lib/types";
import { imageSrc } from "@/lib/utils";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
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
  const avatar = imageSrc(personal.avatar, "medium");
  const ref = useRef<HTMLElement>(null);

  // Mouse-reactive orb
  const ox = useMotionValue(0);
  const oy = useMotionValue(0);
  const orbX = useSpring(ox, { stiffness: 60, damping: 20 });
  const orbY = useSpring(oy, { stiffness: 60, damping: 20 });

  function onMouse(e: React.MouseEvent) {
    if (typeof window === 'undefined') return;
    const { innerWidth: w, innerHeight: h } = window;
    ox.set((e.clientX - w / 2) / w * 60);
    oy.set((e.clientY - h / 2) / h * 60);
  }

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const words = hero.title.split(" ");
  const foundIdx = words.findIndex((w) =>
    /intelligent|architect|ai|solutions/i.test(w)
  );
  const accentIdx = foundIdx === -1 ? Math.floor(words.length / 2) : foundIdx;

  return (
    <section
      ref={ref}
      onMouseMove={onMouse}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28"
    >
      {/* Interactive glowing orb */}
      <motion.div
        aria-hidden
        style={{ x: orbX, y: orbY }}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-0 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-70 blur-[120px]"
      >
        <div className="h-full w-full rounded-full bg-accent-gradient" />
      </motion.div>

      {/* Radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, transparent, rgba(5,5,5,0.65) 100%)",
        }}
      />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="container-px relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-muted backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
          </span>
          {personal.profession}
        </motion.div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl text-[clamp(2.75rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight text-pearl"
        >
          {words.map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
              <motion.span variants={word} className="inline-block">
                {i === accentIdx ? (
                  <span className="serif-accent">{w}</span>
                ) : (
                  w
                )}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-7 max-w-xl text-lg text-muted"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="/projects" className="btn-primary group">
            {hero.ctaText}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href="/contact" className="btn-ghost">
            <Sparkles size={16} /> Get in touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            <span className="font-medium text-ink">{personal.locationAU}</span>, Australia
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-medium text-ink">{personal.locationNP}</span>, Nepal
          </span>
          <a href={`mailto:${personal.email}`} className="transition-colors hover:text-ink">
            {personal.email}
          </a>
        </motion.div>
      </motion.div>

      {/* Floating avatar chip */}
      {avatar && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute right-8 top-28 z-10 hidden animate-float lg:block"
        >
          <div className="glass flex items-center gap-3 rounded-2xl px-3 py-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10">
              <Image
                src={avatar}
                alt={personal.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="pr-2">
              <p className="text-sm font-semibold text-ink">{personal.name}</p>
              <p className="text-xs text-muted">Available for work</p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
