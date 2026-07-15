"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { imageSrc } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll the marquee track.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    let x = 0;
    const width = track.scrollWidth / 2;

    function step() {
      const el = trackRef.current;
      if (el && !paused && width > 0) {
        x -= 0.5;
        if (Math.abs(x) >= width) x = 0;
        el.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, safeTestimonials.length]);

  const loop = [...safeTestimonials, ...safeTestimonials];

  return (
    <section className="section-pad bg-surface-strong">
      <div className="container-px">
        <SectionHeading
          eyebrow="Kind Words"
          title={
            <>
              What clients <span className="serif-accent">say</span>
            </>
          }
        />
      </div>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div ref={trackRef} className="flex w-max gap-6 px-5">
          {loop.map((t, i) => (
            <figure
              key={`${t.id}-${i}`}
              className="flex w-[340px] shrink-0 flex-col justify-between rounded-3xl border border-line bg-white/80 p-7 shadow-card sm:w-[420px]"
            >
              <Quote size={28} className="mb-4 text-burgundy" />
              <blockquote className="pull-quote text-lg leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="relative h-11 w-11 overflow-hidden rounded-full border border-line">
                  {imageSrc(t.avatar) && (
                    <Image src={imageSrc(t.avatar)} alt={t.name} fill sizes="44px" className="object-cover" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{t.name}</span>
                  <span className="block text-xs text-muted">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-strong to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-strong to-transparent" />
      </div>
    </section>
  );
}
