import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pooja-tiwari.vercel.app"),
  title: {
    default: "Pooja Tiwari | Content Writer & Copywriter",
    template: "%s | Pooja Tiwari",
  },
  description:
    "Pooja Tiwari — Content Writer & Copywriter crafting words that convert and stories that stick. SEO writing, brand copy, and content strategy.",
  keywords: [
    "Content Writer",
    "Copywriter",
    "SEO Writing",
    "Brand Copy",
    "Content Strategy",
    "Nepal",
    "Australia",
  ],
  authors: [{ name: "Pooja Tiwari" }],
  openGraph: {
    title: "Pooja Tiwari | Content Writer & Copywriter",
    description:
      "Words that convert, stories that stick. Editorial content, SEO copy and brand storytelling by Pooja Tiwari.",
    type: "website",
    locale: "en_US",
    siteName: "Pooja Tiwari",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pooja Tiwari | Content Writer & Copywriter",
    description: "Words that convert, stories that stick.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning={true}
    >
      <body className="bg-background text-ink antialiased" suppressHydrationWarning={true}>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
