"use client";

import { motion } from "framer-motion";
import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesGrid from "@/components/ServicesGrid";
import SectionHeading from "@/components/SectionHeading";
import type { PersonalInfo, Nav, Service, ContactInfo } from "@/lib/types";

const PROCESS = [
  { step: "01", title: "Discovery", description: "We unpack your goals, audience and brand voice in a short kickoff." },
  { step: "02", title: "Strategy", description: "I map topics, keywords and a publishing plan built to convert." },
  { step: "03", title: "Craft", description: "Research-led drafts, written clean and edited to a professional standard." },
  { step: "04", title: "Refine", description: "One round of revisions, then polished copy delivered ready to publish." },
];

export default function ServicesView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personal");
  const { data: nav } = useJson<Nav>("/api/content/nav");
  const { data: services } = useJson<Service[]>("/api/content/services");
  const { data: contact } = useJson<ContactInfo>("/api/content/contact");

  if (!personal || !nav || !services || !contact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />

      <section className="section-pad bg-cream">
        <div className="container-px">
          <SectionHeading
            eyebrow="Services"
            title={
              <>
                How we can <span className="serif-accent">work together</span>
              </>
            }
            subtitle="Flexible engagements for brands that care about the words."
          />
          <ServicesGrid services={services} />
        </div>
      </section>

      <section className="section-pad bg-surface-strong">
        <div className="container-px">
          <SectionHeading eyebrow="Process" title="A calm, considered process" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card"
              >
                <span className="font-serif text-3xl font-bold text-primary">{p.step}</span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-px">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-charcoal px-8 py-16 text-center text-cream shadow-soft-lg sm:px-16">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
              Not sure which package fits?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              Tell me about your project and I&apos;ll recommend the right starting point.
            </p>
            <a href="/contact" className="btn-primary mt-8 inline-flex bg-white text-charcoal hover:scale-[1.03]">
              Request a quote
            </a>
          </div>
        </div>
      </section>

      <Footer contact={contact} />
    </main>
  );
}
