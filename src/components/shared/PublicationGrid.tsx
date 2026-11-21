"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { usePublicGallery } from "@/hooks/usePublicGallery";
import { useCollage, useCollageText } from "@/hooks/useCollage";
import type { CollageSlot, CollageText } from "@/lib/collage-settings";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { publicationCategories, type PublicationCategory } from "@/lib/school";
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
  const { items, loading, error, reload } = usePublicGallery();
  const ordered =
    category === "Semua"
      ? items
      : items.filter((item) => item.category === category);
  const count = limit ?? (preview ? 3 : showFilters ? ordered.length : 6);
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
              type="button"
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
      {loading && (
        <p role="status" className="py-10 text-center text-sm text-muted">
          Memuat publikasi…
        </p>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-muted"
        >
          <p>Publikasi belum dapat dimuat.</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 font-semibold text-primary"
          >
            Coba lagi
          </button>
        </div>
      )}
      {!loading && !error && !visible.length && (
        <p className="py-10 text-center text-sm text-muted">
          Belum ada publikasi untuk kategori ini.
        </p>
      )}
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
  slots: suppliedSlots,
  text: suppliedText,
  compact = false,
  onEditPhoto,
  onEditText,
}: {
  slots?: CollageSlot[];
  text?: CollageText;
  compact?: boolean;
  onEditPhoto?: (slot: CollageSlot) => void;
  onEditText?: () => void;
}) {
  const { slots: remoteSlots } = useCollage(!suppliedSlots);
  const { text: localText } = useCollageText();
  const slots = suppliedSlots || remoteSlots;
  const text = suppliedText || localText;
  const reduced = useReducedMotion();
  const mobileShapes = [
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/4]",
    "aspect-[5/4]",
    "aspect-[2/3]",
  ];

  return (
    <div
      className={cn(
        "relative mx-auto max-w-[1480px]",
        compact ? "lg:min-h-[360px]" : "min-h-[620px] lg:min-h-[650px]",
      )}
    >
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
        className={cn(
          "relative col-span-2 mb-8 text-center lg:absolute lg:left-1/4 lg:z-10 lg:mb-0 lg:w-1/2 lg:px-5",
          compact ? "lg:top-[220px]" : "lg:top-[390px]",
        )}
      >
        {onEditText && (
          <button
            type="button"
            onClick={onEditText}
            aria-label="Edit teks kolase"
            className="absolute -right-1 -top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-white text-primary shadow-sm hover:bg-blue-50"
          >
            <Pencil size={16} />
          </button>
        )}
        <p className="mx-auto inline-flex rounded-full border border-slate-300 bg-white/90 px-5 py-2 text-xs font-medium text-ink shadow-sm">
          {text.label}
        </p>
        <h2
          className={cn(
            "mt-5 font-semibold leading-tight tracking-tight",
            compact
              ? "text-xl sm:text-2xl"
              : "text-3xl sm:text-4xl lg:text-[2.5rem]",
          )}
        >
          {text.title}
          <span className="block text-slate-400">{text.accent}</span>
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{text.description}</p>
      </motion.header>

      <div
        className={cn(
          "grid lg:grid-cols-8",
          compact ? "grid-cols-4 gap-2 lg:gap-3" : "grid-cols-2 gap-4 lg:gap-5",
        )}
      >
        {mosaicLanes.map((lane, laneIndex) => (
          <div
            key={laneIndex}
            className={cn("contents lg:flex lg:flex-col lg:gap-4", lane.offset)}
          >
            {lane.items.map((itemIndex, photoIndex) => {
              const slot = slots[itemIndex];
              if (!slot) return null;
              const cropClass = [
                "object-[50%_50%]",
                "object-[35%_50%]",
                "object-[65%_45%]",
              ][(laneIndex + photoIndex) % 3];
              const centerOffset = Math.abs(laneIndex - 3.5) - 0.5;
              const delay = centerOffset * 0.12 + photoIndex * 0.14;

              return (
                <motion.div
                  key={`${laneIndex}-${photoIndex}-${slot.id}`}
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
                  <div
                    className={cn(
                      "group relative block w-full overflow-hidden rounded-[1.35rem] bg-blue-50 outline-offset-4 transition-transform duration-500 ease-out hover:scale-[0.97] focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none",
                      mobileShapes[
                        (laneIndex + photoIndex) % mobileShapes.length
                      ],
                      lane.shape,
                    )}
                  >
                    <Image
                      src={slot.image}
                      alt={`Foto kolase sekolah ${slot.id + 1}`}
                      unoptimized={slot.image.startsWith("/api/media")}
                      fill
                      sizes={
                        compact
                          ? "(max-width: 1023px) 22vw, 12vw"
                          : "(max-width: 1023px) 44vw, 12vw"
                      }
                      quality={85}
                      className={cn(
                        "scale-[1.05] object-cover transition-transform duration-500 ease-out group-hover:scale-100 motion-reduce:transition-none",
                        cropClass,
                      )}
                    />
                    {onEditPhoto && (
                      <button
                        type="button"
                        onClick={() => onEditPhoto(slot)}
                        aria-label={`Edit foto kolase ${slot.id + 1}`}
                        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-md hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
