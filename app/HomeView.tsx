"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TypographyShowcase from "@/components/TypographyShowcase";
import AboutSection from "@/components/AboutSection";
import ServicesGrid from "@/components/ServicesGrid";
import WritingSampleCard from "@/components/WritingSampleCard";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BlogPreview from "@/components/BlogPreview";
import SectionHeading from "@/components/SectionHeading";
import type {
  PersonalInfo,
  Nav,
  Hero as HeroType,
  About,
  Service,
  WritingSample,
  BlogPost,
  Testimonial,
  ContactInfo,
} from "@/lib/types";

export default function HomeView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personal");
  const { data: nav } = useJson<Nav>("/api/content/nav");
  const { data: hero } = useJson<HeroType>("/api/content/hero");
  const { data: about } = useJson<About>("/api/content/about");
  const { data: services } = useJson<Service[]>("/api/content/services", []);
  const { data: portfolio } = useJson<WritingSample[]>("/api/content/portfolio", []);
  const { data: blog } = useJson<BlogPost[]>("/api/content/blog", []);
  const { data: testimonials } = useJson<Testimonial[]>("/api/content/testimonials", []);
  const { data: contact } = useJson<ContactInfo>("/api/content/contact");

  if (!personal || !nav || !hero || !about || !services || !portfolio || !blog || !testimonials || !contact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  const featured = portfolio.filter((p) => p.featured).concat(portfolio.filter((p) => !p.featured)).slice(0, 4);

  return (
    <main className="min-h-screen bg-cream">
      <Navbar personal={personal} links={nav.links} />
      <Hero hero={hero} personal={personal} />
      <TypographyShowcase />
      <AboutSection about={about} personal={personal} />

      <section id="writing" className="section-pad bg-surface-strong">
        <div className="container-px">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Selected Writing"
              title={
                <>
                  Words that do the <span className="serif-accent">work</span>
                </>
              }
            />
            <a
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5"
            >
              View all samples <span aria-hidden>→</span>
            </a>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((sample, i) => (
              <WritingSampleCard key={sample.id} sample={sample} idx={i} />
            ))}
          </div>
        </div>
      </section>

      <ServicesGrid services={services} />
      <TestimonialsCarousel testimonials={testimonials} />
      <BlogPreview posts={blog} />

      <section className="section-pad bg-cream">
        <div className="container-px">
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-charcoal px-8 py-16 text-center text-cream shadow-soft-lg sm:px-16">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
              Have a story that deserves to be told well?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/70">
              I&apos;m currently taking on new writing and content strategy projects.
            </p>
            <a
              href="/contact"
              className="btn-primary mt-8 inline-flex bg-white text-charcoal hover:scale-[1.03]"
            >
              Start a conversation
            </a>
          </div>
        </div>
      </section>

      <Footer contact={contact} />
    </main>
  );
}
