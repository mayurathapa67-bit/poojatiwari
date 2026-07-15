"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import Experience from "@/components/Experience";
import SectionBoundary from "@/components/SectionBoundary";
import type {
  PersonalInfo,
  Nav,
  About,
  ExperienceItem,
  ContactInfo,
} from "@/lib/types";

export default function AboutView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personal");
  const { data: nav } = useJson<Nav>("/api/content/nav");
  const { data: about } = useJson<About>("/api/content/about");
  const { data: experience } = useJson<ExperienceItem[]>("/api/content/experience");
  const { data: contact } = useJson<ContactInfo>("/api/content/contact");

  if (!personal || !nav || !about || !experience || !contact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />
      <SectionBoundary name="About">
        <AboutSection about={about} personal={personal} />
      </SectionBoundary>
      <SectionBoundary name="Experience">
        <Experience experience={experience} />
      </SectionBoundary>
      <Footer contact={contact} />
    </main>
  );
}
