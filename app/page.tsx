import type { Metadata } from "next";
import HomeView from "./HomeView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home | Pooja Tiwari",
  description:
    "Pooja Tiwari — Content Writer & Copywriter. Words that convert, stories that stick.",
};

export default function Page() {
  return <HomeView />;
}
