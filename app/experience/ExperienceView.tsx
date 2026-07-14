"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";
import type { PersonalInfo, Nav, ExperienceItem, ContactInfo } from "@/lib/types";

export default function ExperienceView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personal");
  const { data: nav } = useJson<Nav>("/api/content/nav");
  const { data: experience } = useJson<ExperienceItem[]>("/api/content/experience");
  const { data: contact } = useJson<ContactInfo>("/api/content/contact");

  if (!personal || !nav || !experience || !contact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />
      <Experience experience={experience} />
      <Footer contact={contact} />
    </main>
  );
}
