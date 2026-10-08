"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { copy } from "@/lib/constants";
import { Plus } from "./Svg";
export default function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  return (
    <div className="divide-y divide-blue-100">
      {[
        "Lorem ipsum dolor sit amet?",
        "Consectetur adipiscing elit?",
        "Sed do eiusmod tempor?",
        "Ut enim ad minim veniam?",
      ].map((title, index) => (
        <div key={title}>
          <h3>
            <button
              onClick={() => setOpen(open === index ? null : index)}
              aria-expanded={open === index}
              aria-controls={`faq-panel-${index}`}
              id={`faq-trigger-${index}`}
              className="flex w-full items-center justify-between gap-6 py-6 text-left text-base font-medium sm:text-lg"
            >
              <span>{title}</span>
              <Plus
                className={`h-5 w-5 shrink-0 text-primary transition duration-300 ${open === index ? "rotate-45" : ""}`}
              />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === index && (
              <motion.div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
                className="overflow-hidden"
              >
                <p className="body-copy max-w-2xl pb-6">
                  {copy.body} {copy.long}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
