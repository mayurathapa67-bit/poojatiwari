import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";

export const metadata: Metadata = {
  title: "Experience | Pooja Tiwari",
  description:
    "Work experience of Pooja Tiwari — AI Solutions Architect & Full-Stack Developer.",
};

export default function Page() {
  return <ExperienceView />;
}
