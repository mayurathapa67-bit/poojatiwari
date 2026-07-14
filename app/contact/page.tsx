import type { Metadata } from "next";
import ContactView from "./ContactView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact | Pooja Tiwari",
  description:
    "Get in touch with Pooja Tiwari — Content Writer & Copywriter based in Nepal and Australia.",
};

export default function Page() {
  return <ContactView />;
}
