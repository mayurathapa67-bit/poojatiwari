"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";
import type { PersonalInfo, ExperienceItem, Socials } from "@/lib/types";

export const metadata = {
  title: "Experience | Pooja Tiwari",
  description:
    "Work experience of Pooja Tiwari — AI Solutions Architect & Full-Stack Developer.",
};

export default function ExperienceView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personalInfo");
  const { data: experience } = useJson<ExperienceItem[]>("/api/content/experience");
  const { data: socials } = useJson<Socials>("/api/content/socials");

  if (!personal || !experience || !socials) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar personal={personal} />
      <Experience experience={experience} />
      <Footer socials={socials} />
    </main>
  );
}
