import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pooja-tiwari.vercel.app"),
  title: {
    default: "Pooja Tiwari | AI Solutions Architect & Full-Stack Developer",
    template: "%s | Pooja Tiwari",
  },
  description:
    "Portfolio of Pooja Tiwari — AI Solutions Architect & Full-Stack Developer building intelligent, scalable solutions.",
  openGraph: {
    title: "Pooja Tiwari | AI Solutions Architect & Full-Stack Developer",
    description:
      "AI Solutions Architect & Full-Stack Developer crafting intelligent, scalable products.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pooja Tiwari",
    description: "AI Solutions Architect & Full-Stack Developer.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`} suppressHydrationWarning={true}>
      <body className="bg-background text-ink antialiased" suppressHydrationWarning={true}>
        <div className="mesh-bg" aria-hidden="true">
          <div className="mesh-blob b1" />
          <div className="mesh-blob b2" />
          <div className="mesh-blob b3" />
        </div>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
