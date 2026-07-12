"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Contact } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";

export default function ContactSection({ contact }: { contact: Contact }) {
  const cards = [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone}` },
    { icon: MapPin, label: "Melbourne, AU", value: contact.locationAU, href: null },
    { icon: MapPin, label: "Jhapa, NP", value: contact.locationNP, href: null },
  ];

  return (
    <section id="contact" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build <span className="serif-accent">together</span>
            </>
          }
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {cards.map((card) => {
              const content = (
                <div className="glass group flex items-start gap-4 p-5 transition-colors hover:border-white/15">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-teal transition-colors group-hover:text-primary">
                    <card.icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {card.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-ink">{card.value}</p>
                  </div>
                </div>
              );
              return card.href ? (
                <a key={card.label} href={card.href}>
                  {content}
                </a>
              ) : (
                <div key={card.label}>{content}</div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
