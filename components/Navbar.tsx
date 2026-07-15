"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PersonalInfo, NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";
import Magnetic from "./Magnetic";

export default function Navbar({
  personal,
  links,
}: {
  personal: PersonalInfo;
  links: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const safeLinks =
    Array.isArray(links) && links.length > 0
      ? links
      : [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Services", href: "/services" },
          { label: "Writing", href: "/portfolio" },
          { label: "Contact", href: "/contact" },
        ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto relative flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-line bg-white/70 px-4 py-2.5 shadow-card backdrop-blur-xl"
      >
        <Link href="/" className="relative z-10 flex items-center gap-2.5 pl-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gradient font-serif text-sm font-bold text-white">
            {personal.name.charAt(0)}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-ink sm:block">
            {personal.name}
          </span>
        </Link>

        <ul className="relative z-10 hidden items-center gap-1 md:flex">
          {safeLinks.map((item) => (
            <li key={item.href}>
              <Magnetic strength={0.3}>
                <Link
                  href={item.href}
                  className="group relative block px-3.5 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent-gradient transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </Magnetic>
            </li>
          ))}
        </ul>

        <Magnetic strength={0.35} className="relative z-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent-gradient px-4 py-2 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
          >
            Hire Me <ArrowUpRight size={14} />
          </Link>
        </Magnetic>

        <button
          className="relative z-10 text-ink md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute top-[68px] w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-2xl border border-line bg-white/90 shadow-soft-lg backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col p-2">
              {safeLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
