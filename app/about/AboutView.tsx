"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BentoAbout from "@/components/BentoAbout";
import type { PersonalInfo, About, Socials } from "@/lib/types";

export const metadata = {
  title: "About | Pooja Tiwari",
  description:
    "About Pooja Tiwari — AI Solutions Architect & Full-Stack Developer.",
};

export default function AboutView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personalInfo");
  const { data: about } = useJson<About>("/api/content/about");
  const { data: socials } = useJson<Socials>("/api/content/socials");

  if (!personal || !about || !socials) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar personal={personal} />
      <BentoAbout about={about} personal={personal} />
      <Footer socials={socials} />
    </main>
  );
}
