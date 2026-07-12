import { Github, Linkedin, Twitter } from "lucide-react";
import type { Socials } from "@/lib/types";

export default function Footer({ socials }: { socials: Socials }) {
  const year = new Date().getFullYear();

  const items = [
    { icon: Github, href: socials.github, label: "GitHub" },
    { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: socials.twitter, label: "Twitter" },
  ];

  return (
    <footer className="relative mt-10 border-t border-white/[0.06]">
      <div className="container-px flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="text-sm text-muted">
          © {year} Pooja Tiwari. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {items.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-muted transition-all hover:border-white/20 hover:text-pearl hover:shadow-glow"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
