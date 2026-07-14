import { Linkedin, Twitter, Instagram, Github, Mail, Phone, MapPin } from "lucide-react";
import type { ContactInfo } from "@/lib/types";

export default function Footer({ contact }: { contact: ContactInfo }) {
  const year = new Date().getFullYear();
  const socials = contact.socials;

  const items = [
    { icon: Github, href: socials.github, label: "GitHub" },
    { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: socials.twitter, label: "Twitter" },
    { icon: Instagram, href: socials.instagram, label: "Instagram" },
  ];

  return (
    <footer className="relative mt-10 border-t border-line bg-cream">
      <div className="container-px grid gap-10 py-16 md:grid-cols-3">
        {/* Brand */}
        <div>
          <p className="font-serif text-2xl font-bold text-ink">Pooja Tiwari</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Content Writer &amp; Copywriter. Words that convert, stories that stick.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {items.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/60 text-muted transition-all hover:border-primary/40 hover:text-primary"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Navigate
          </p>
          <ul className="space-y-2.5 text-sm">
            <li><a href="/about" className="text-ink transition-colors hover:text-primary">About</a></li>
            <li><a href="/portfolio" className="text-ink transition-colors hover:text-primary">Writing Samples</a></li>
            <li><a href="/services" className="text-ink transition-colors hover:text-primary">Services</a></li>
            <li><a href="/blog" className="text-ink transition-colors hover:text-primary">Journal</a></li>
            <li><a href="/contact" className="text-ink transition-colors hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Get in touch
          </p>
          <ul className="space-y-3 text-sm text-ink">
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-primary" />
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-primary">
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-primary" />
              <a href={`tel:${contact.phone}`} className="transition-colors hover:text-primary">
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin size={16} className="text-primary" />
              <span>{contact.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© {year} Pooja Tiwari. All rights reserved.</p>
          <p>Crafted with care in Nepal &amp; Australia.</p>
        </div>
      </div>
    </footer>
  );
}
