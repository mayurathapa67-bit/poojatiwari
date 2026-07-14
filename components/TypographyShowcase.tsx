"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "Clarity is a courtesy. Every sentence should respect the reader's time.",
    kind: "serif",
  },
  {
    text: "A brand is a conversation. Copy is how you listen out loud.",
    kind: "display",
  },
  {
    text: "Search engines reward what humans already love: useful, honest writing.",
    kind: "italic",
  },
];

export default function TypographyShowcase() {
  return (
    <section className="section-pad bg-charcoal text-cream">
      <div className="container-px">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-xs font-medium uppercase tracking-[0.3em] text-cream/50"
        >
          A command of language
        </motion.p>

        <div className="grid gap-10 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-3xl border border-cream/10 bg-cream/[0.03] p-8"
            >
              <Quote size={26} className="mb-4 text-burgundy" />
              {q.kind === "serif" && (
                <p className="font-serif text-2xl font-medium leading-snug text-cream">
                  {q.text}
                </p>
              )}
              {q.kind === "display" && (
                <p className="font-serif text-3xl font-bold leading-tight text-cream">
                  {q.text}
                </p>
              )}
              {q.kind === "italic" && (
                <p className="font-serif text-xl italic leading-relaxed text-cream/90">
                  {q.text}
                </p>
              )}
            </motion.blockquote>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-14 max-w-3xl text-center font-serif text-2xl italic leading-relaxed text-cream/80 sm:text-3xl"
        >
          “The difference between the almost-right word and the right word is really a
          large matter — &apos;tis the difference between the lightning-bug and the
          lightning.”
        </motion.p>
        <p className="mt-4 text-center text-sm uppercase tracking-[0.2em] text-cream/40">
          — Mark Twain
        </p>
      </div>
    </section>
  );
}
