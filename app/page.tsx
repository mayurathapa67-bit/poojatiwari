"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import type { PersonalInfo, Hero as HeroType, Socials } from "@/lib/types";

export default function Home() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personalInfo");
  const { data: hero } = useJson<HeroType>("/api/content/hero");
  const { data: socials } = useJson<Socials>("/api/content/socials");

  if (!personal || !hero || !socials) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar personal={personal} />
      <Hero hero={hero} personal={personal} />
      <Footer socials={socials} />
    </main>
  );
}
