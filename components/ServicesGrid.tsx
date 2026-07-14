"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Search,
  PenLine,
  Megaphone,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@/lib/types";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  Compass,
  Search,
  PenLine,
  Megaphone,
  Mail,
};

export default function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <section id="services" className="section-pad bg-cream">
      <div className="container-px">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              What I can <span className="serif-accent">write</span> for you
            </>
          }
          subtitle="From strategy to the final full stop — flexible engagements built around your goals."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = ICONS[service.icon] ?? PenLine;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card group flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-card-hover"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white/70 text-primary transition-colors group-hover:bg-accent-gradient group-hover:text-white">
                  <Icon size={22} />
                </span>
                <h3 className="font-serif text-xl font-semibold text-ink">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>

                {service.features.length > 0 && (
                  <ul className="mt-5 space-y-1.5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink/80">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {service.price && (
                  <p className="mt-5 border-t border-line pt-4 text-sm font-semibold text-burgundy">
                    {service.price}
                  </p>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
