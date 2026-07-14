"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import type { PersonalInfo, Nav, ContactInfo } from "@/lib/types";

export default function ContactView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personal");
  const { data: nav } = useJson<Nav>("/api/content/nav");
  const { data: contact } = useJson<ContactInfo>("/api/content/contact");

  if (!personal || !nav || !contact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-24">
      <Navbar personal={personal} links={nav.links} />
      <ContactSection contact={contact} />
      <Footer contact={contact} />
    </main>
  );
}
