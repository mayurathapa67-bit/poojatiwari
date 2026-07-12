import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "About | Pooja Tiwari",
  description:
    "About Pooja Tiwari — AI Solutions Architect & Full-Stack Developer.",
};

export default function Page() {
  return <AboutView />;
}
