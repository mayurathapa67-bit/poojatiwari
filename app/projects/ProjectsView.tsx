"use client";

import { useJson } from "@/lib/hooks";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectGrid from "@/components/ProjectGrid";
import type { PersonalInfo, ProjectItem, Socials } from "@/lib/types";

export const metadata = {
  title: "Projects | Pooja Tiwari",
  description: "Selected projects by Pooja Tiwari — AI & full-stack engineering.",
};

export default function ProjectsView() {
  const { data: personal } = useJson<PersonalInfo>("/api/content/personalInfo");
  const { data: projects } = useJson<ProjectItem[]>("/api/content/projects");
  const { data: socials } = useJson<Socials>("/api/content/socials");

  if (!personal || !projects || !socials) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <Navbar personal={personal} />
      <ProjectGrid projects={projects} />
      <Footer socials={socials} />
    </main>
  );
}
