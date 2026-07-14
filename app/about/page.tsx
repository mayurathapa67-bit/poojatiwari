import type { Metadata } from "next";
import AboutView from "./AboutView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | Pooja Tiwari",
  description:
    "About Pooja Tiwari — Content Writer & Copywriter based in Nepal and Australia.",
};

export default function Page() {
  return <AboutView />;
}
