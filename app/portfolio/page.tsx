import type { Metadata } from "next";
import PortfolioView from "./PortfolioView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing Samples | Pooja Tiwari",
  description:
    "A filterable portfolio of writing samples — blog posts, SEO content, website copy, technical writing and creative work by Pooja Tiwari.",
};

export default function Page() {
  return <PortfolioView />;
}
