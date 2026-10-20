"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  publications,
  publicationCategories,
  type Publication,
  type PublicationCategory,
} from "@/lib/school";
import { ArrowUpRight } from "./Svg";
import { cn } from "@/lib/utils";

export default function PublicationGrid({
  preview = false,
  showFilters = true,
}: {
  preview?: boolean;
  showFilters?: boolean;
}) {
  const [category, setCategory] = useState<PublicationCategory | "Semua">(
    "Semua",
  );
  const filtered = publications.filter(
    (item) =>
      !showFilters || category === "Semua" || item.category === category,
  );
  const visible = preview ? filtered.slice(0, 3) : filtered;
  if (!showFilters)
    return (
      <PublicationMosaic publications={visible} />
    );
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
        {visible.map((item) => (
          <Link
            key={item.slug}
            href={`/publikasi/${item.slug}`}
            className="group rounded-3xl border border-white bg-white/65 p-3 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/5"
          >
            <div className="relative aspect-[1.5] overflow-hidden rounded-2xl">
              <Image
                src={item.image}
                alt={`Foto contoh untuk kategori ${item.category}`}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-primary">
                {item.category}
              </p>
              <h3 className="text-xl font-semibold leading-7 tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-xs leading-6 text-muted">
                {item.excerpt}
              </p>
              <span className="mt-5 flex items-center justify-between text-xs font-medium">
                Lihat selengkapnya
                <ArrowUpRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
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

function PublicationMosaic({
  publications: items,
}: {
  publications: Publication[];
}) {
  const mobileShapes = [
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/4]",
    "aspect-[5/4]",
    "aspect-[2/3]",
  ];

  return (
    <div className="relative mx-auto min-h-[620px] max-w-[1480px] lg:min-h-[650px]">
      <header className="col-span-2 mb-8 text-center lg:absolute lg:left-1/4 lg:top-[390px] lg:z-10 lg:mb-0 lg:w-1/2 lg:px-8">
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
      </header>

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

              return (
                <Link
                  key={`${laneIndex}-${photoIndex}-${item.slug}`}
                  href={`/publikasi/${item.slug}`}
                  aria-label={`Buka publikasi: ${item.title}`}
                  className={cn(
                    "group relative block overflow-hidden rounded-[1.35rem] bg-blue-50 outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary",
                    mobileShapes[(laneIndex + photoIndex) % mobileShapes.length],
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
                      "object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none",
                      cropClass,
                    )}
                  />
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
