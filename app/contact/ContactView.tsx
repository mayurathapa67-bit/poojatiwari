"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import type { PersonalInfo, Contact, Socials } from "@/lib/types";

export const metadata = {
  title: "Contact | Pooja Tiwari",
  description:
    "Get in touch with Pooja Tiwari — AI Solutions Architect & Full-Stack Developer.",
};

export default function ContactView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personalInfo");
  const { data: contact } = useJson<Contact>("/api/content/contact");
  const { data: socials } = useJson<Socials>("/api/content/socials");

  if (!personal || !contact || !socials) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar personal={personal} />
      <ContactSection contact={contact} />
      <Footer socials={socials} />
    </main>
  );
}
