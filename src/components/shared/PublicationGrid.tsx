"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  publications,
  publicationCategories,
  type Publication,
  type PublicationCategory,
} from "@/lib/school";
import { cn } from "@/lib/utils";

export default function PublicationGrid({
  preview = false,
  showFilters = false,
  limit,
}: {
  preview?: boolean;
  showFilters?: boolean;
  limit?: number;
}) {
  const [category, setCategory] = useState<PublicationCategory | "Semua">(
    "Semua",
  );
  const reduced = useReducedMotion();
  const ordered =
    category === "Semua"
      ? [0, 4, 8, 9, 13, 2, 1, 3, 5, 6, 7, 10, 11, 12, 14]
          .map((i) => publications[i])
          .filter(Boolean)
      : publications.filter((item) => item.category === category);
  const count = limit ?? (preview ? 3 : 6);
  const visible = ordered.slice(0, count);

  return (
    <div>
      {showFilters && (
        <div
          role="group"
          aria-label="Filter kategori publikasi"
          className="mb-8 flex flex-wrap gap-2"
        >
          {["Semua", ...publicationCategories].map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item as typeof category)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition duration-300",
                category === item
                  ? "border-primary bg-primary text-white"
                  : "border-blue-100 bg-white/70 text-muted hover:border-primary hover:text-primary",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {visible.length} konten ditampilkan
        {showFilters ? ` untuk kategori ${category}` : ""}.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, index) => (
          <motion.div
            key={`${category}-${item.slug}`}
            initial={reduced ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={{
              hidden: {
                opacity: 0,
                y: 36,
                scale: 0.94,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 1.0,
                  delay: (index % 3) * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            <Link
              href={`/publikasi/${item.slug}`}
              aria-label={`${item.category}: ${item.title}`}
              className="group flex h-full flex-col rounded-3xl bg-white p-3.5 shadow-sm shadow-blue-950/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-950/10"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-blue-50">
                <Image
                  src={item.image}
                  alt={`${item.title} — kategori ${item.category}`}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className="scale-[1.04] object-cover transition-transform duration-500 ease-out group-hover:scale-100"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="mb-2.5 flex items-center justify-between gap-2 text-[11px] text-muted">
                    <span className="font-semibold uppercase tracking-wider text-primary">
                      {item.category}
                    </span>
                    {item.activityDate && <span>{item.activityDate}</span>}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-primary sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-xs leading-6 text-muted sm:text-sm">
                    {item.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const mosaicLanes = [
  { items: [0, 1], offset: "lg:mt-[54px]", shape: "lg:aspect-[7/10]" },
  { items: [2, 3, 4], offset: "lg:mt-[28px]", shape: "lg:aspect-square" },
  { items: [5], offset: "lg:mt-[54px]", shape: "lg:aspect-[3/5]" },
  { items: [6], offset: "lg:mt-0", shape: "lg:aspect-[3/5]" },
  { items: [7], offset: "lg:mt-0", shape: "lg:aspect-[3/5]" },
  { items: [8], offset: "lg:mt-[54px]", shape: "lg:aspect-[3/5]" },
  { items: [9, 10, 11], offset: "lg:mt-[28px]", shape: "lg:aspect-square" },
  { items: [12, 13], offset: "lg:mt-[54px]", shape: "lg:aspect-[7/10]" },
] as const;

export function PublicationMosaic({
  publications: items = publications,
}: {
  publications?: Publication[];
}) {
  const reduced = useReducedMotion();
  const mobileShapes = [
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/4]",
    "aspect-[5/4]",
    "aspect-[2/3]",
  ];

  return (
    <div className="relative mx-auto min-h-[620px] max-w-[1480px] lg:min-h-[650px]">
      <motion.header
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: {
            opacity: 0,
            y: 28,
            transition: { duration: 0.25 },
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 1.05,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            },
          },
        }}
        className="col-span-2 mb-8 text-center lg:absolute lg:left-1/4 lg:top-[390px] lg:z-10 lg:mb-0 lg:w-1/2 lg:px-8"
      >
        <p className="mx-auto inline-flex rounded-full border border-slate-300 bg-white/90 px-5 py-2 text-xs font-medium text-ink shadow-sm">
          Publikasi & Galeri
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem]">
          Momen belajar, berkarya,
          <span className="block text-slate-400">dan berprestasi</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Cerita dari keluarga SMA Widya Darma.
        </p>
      </motion.header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-8 lg:gap-5">
        {mosaicLanes.map((lane, laneIndex) => (
          <div
            key={laneIndex}
            className={cn("contents lg:flex lg:flex-col lg:gap-4", lane.offset)}
          >
            {lane.items.map((itemIndex, photoIndex) => {
              const item = items[itemIndex % items.length];
              if (!item) return null;
              const cropClass = [
                "object-[50%_50%]",
                "object-[35%_50%]",
                "object-[65%_45%]",
              ][
                (laneIndex + photoIndex) % 3
              ];
              const centerOffset = Math.abs(laneIndex - 3.5) - 0.5;
              const delay = centerOffset * 0.12 + photoIndex * 0.14;

              return (
                <motion.div
                  key={`${laneIndex}-${photoIndex}-${item.slug}`}
                  initial={reduced ? false : "hidden"}
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.12 }}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                      scale: 0.9,
                      transition: { duration: 0.25 },
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 1.1,
                        delay,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                >
                  <Link
                    href={`/publikasi/${item.slug}`}
                    aria-label={`Buka publikasi: ${item.title}`}
                    className={cn(
                      "group relative block w-full overflow-hidden rounded-[1.35rem] bg-blue-50 outline-offset-4 transition-transform duration-500 ease-out hover:scale-[0.97] focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none",
                      mobileShapes[
                        (laneIndex + photoIndex) % mobileShapes.length
                      ],
                      lane.shape,
                    )}
                  >
                    <Image
                      src={item.coverImage || item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1023px) 88vw, 28vw"
                      quality={85}
                      className={cn(
                        "scale-[1.05] object-cover transition-transform duration-500 ease-out group-hover:scale-100 motion-reduce:transition-none",
                        cropClass,
                      )}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

