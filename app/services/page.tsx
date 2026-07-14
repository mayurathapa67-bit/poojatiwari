import type { Metadata } from "next";
import ServicesView from "./ServicesView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | Pooja Tiwari",
  description:
    "Content strategy, SEO writing, brand copywriting, social media content and email marketing by Pooja Tiwari.",
};

export default function Page() {
  return <ServicesView />;
}
