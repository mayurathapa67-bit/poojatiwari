"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import type { ContactInfo } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";

export default function ContactSection({ contact }: { contact: ContactInfo }) {
  const cards = [
    { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone}` },
    { icon: MapPin, label: "Based in", value: contact.location, href: null },
  ];

  return (
    <section id="contact" className="section-pad bg-cream">
      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s write something{" "}
              <span className="serif-accent">worth reading</span>
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
                <div className="glass group flex items-start gap-4 p-5 transition-colors hover:border-line-strong">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white/70 text-primary transition-colors group-hover:text-burgundy">
                    <card.icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                      {card.label}
                    </p>
                    <p className="mt-0.5 break-words text-sm font-medium text-ink">{card.value}</p>
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
