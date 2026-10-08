"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  publications,
  publicationCategories,
  type PublicationCategory,
} from "@/lib/school";
import { ArrowUpRight } from "./Svg";
import { cn } from "@/lib/utils";

export default function PublicationGrid({
  preview = false,
}: {
  preview?: boolean;
}) {
  const [category, setCategory] = useState<PublicationCategory | "Semua">(
    "Semua",
  );
  const filtered = publications.filter(
    (item) => category === "Semua" || item.category === category,
  );
  const visible = preview ? filtered.slice(0, 3) : filtered;
  return (
    <div>
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
      <p className="sr-only" aria-live="polite">
        {visible.length} konten ditampilkan untuk kategori {category}.
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
