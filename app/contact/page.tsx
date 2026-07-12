import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact | Pooja Tiwari",
  description:
    "Get in touch with Pooja Tiwari — AI Solutions Architect & Full-Stack Developer.",
};

export default function Page() {
  return <ContactView />;
}
