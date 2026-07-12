import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";

export const metadata: Metadata = {
  title: "Projects | Pooja Tiwari",
  description: "Selected projects by Pooja Tiwari — AI & full-stack engineering.",
};

export default function Page() {
  return <ProjectsView />;
}
