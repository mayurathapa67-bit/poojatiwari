"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { PersonalInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import Magnetic from "./Magnetic";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({ personal }: { personal: PersonalInfo }) {
  const [open, setOpen] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(120px circle at ${mx}px ${my}px, rgba(99,102,241,0.25), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={onMove}
        className="group pointer-events-auto relative flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 shadow-card backdrop-blur-xl"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2.5 pl-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gradient text-sm font-bold text-white shadow-glow">
            {personal.name.charAt(0)}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-ink sm:block">
            {personal.name.split(" ")[0]}
          </span>
        </Link>

        <ul className="relative z-10 hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
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

      <div
        className={cn(
          "pointer-events-auto absolute top-[68px] w-[calc(100%-2rem)] max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col p-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
