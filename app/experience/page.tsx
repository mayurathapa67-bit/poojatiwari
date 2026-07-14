import type { Metadata } from "next";
import ExperienceView from "./ExperienceView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience | Pooja Tiwari",
  description:
    "Writing and content career of Pooja Tiwari — Content Writer & Copywriter.",
};

export default function Page() {
  return <ExperienceView />;
}
