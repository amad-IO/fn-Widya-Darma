"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PartnerSymbol } from "@/components/shared/Svg";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    title: "Lorem ipsum dolor",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    attribution: "Lorem Ipsum — Dolor Sit Amet",
  },
  {
    title: "Lorem ipsum dolor sit",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    attribution: "Lorem Ipsum (Consectetur, Adipiscing)",
  },
  {
    title: "Consectetur adipiscing elit",
    quote:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    attribution: "Dolor Sit Amet — Lorem Ipsum",
  },
  {
    title: "Dolor sit amet, consectetur",
    quote:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet.",
    attribution: "Lorem Ipsum — Adipiscing Elit",
  },
  {
    title: "Sed do eiusmod tempor",
    quote:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.",
    attribution: "Consectetur Elit — Lorem Ipsum",
  },
];
const partners = ["Loremipsum", "IPSUM", "LI", "LOREM", "Loremipsum"];

export default function SocialProofSection() {
  const [active, setActive] = useState(1);
  const reduced = useReducedMotion();
  const testimonial = testimonials[active];
  return (
    <section
      aria-label="Lorem ipsum"
      className="relative border-t border-black/[.035] px-5 pb-14 pt-9 text-center sm:px-10 sm:pb-16 sm:pt-10"
    >
      <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-full border-[3px] border-white shadow-sm">
        <Image
          src="/images/34.webp"
          alt="Lorem ipsum"
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="mx-auto mt-4 min-h-28 max-w-lg" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            <h2 className="text-sm font-bold tracking-tight sm:text-base">
              {testimonial.title}
            </h2>
            <blockquote className="mx-auto mt-2 max-w-md text-[11px] leading-5 text-muted">
              “{testimonial.quote}”
            </blockquote>
            <p className="mt-2 text-[9px] text-muted/75">
              — {testimonial.attribution}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        className="mx-auto mt-7 flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:mt-5 sm:flex-nowrap sm:justify-between sm:gap-4"
        role="group"
        aria-label="Pilih testimoni"
      >
        {partners.map((partner, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            aria-label={`Lorem ipsum ${index + 1}`}
            className={cn(
              "partner-button relative flex h-14 items-center justify-center gap-1.5 rounded-2xl px-4 text-muted/75 transition duration-300 hover:text-primary sm:min-w-28",
              active === index && "partner-active text-ink/75",
              index === 1 && "text-lg font-extrabold italic tracking-tighter",
              index === 2 && "text-xl font-black tracking-tighter",
              index === 3 && "text-xl font-extrabold tracking-tighter",
              (index === 0 || index === 4) &&
                "text-sm font-semibold tracking-tight",
            )}
          >
            {(index === 0 || index === 4) && (
              <PartnerSymbol className="h-4 w-4" />
            )}
            {partner}
          </button>
        ))}
      </div>
    </section>
  );
}
