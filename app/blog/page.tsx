import type { Metadata } from "next";
import BlogView from "./BlogView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal | Pooja Tiwari",
  description:
    "Thought leadership and notes on writing, SEO and the craft of words by Pooja Tiwari.",
};

export default function Page() {
  return <BlogView />;
}
