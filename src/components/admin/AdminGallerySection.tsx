"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { GalleryActivity } from "@/types/gallery";
import { cn } from "@/lib/utils";

export type GalleryTab =
  | "kreativitas-seni"
  | "jurnal-karya"
  | "prestasi-akademik"
  | "kegiatan-sosial"
  | "ekstrakurikuler"
  | "pramuka-olahraga";

export const galleryTabs: { id: GalleryTab; label: string; category: string }[] = [
  {
    id: "kreativitas-seni",
    label: "Kreativitas & Seni",
    category: "Kreativitas & Seni",
  },
  {
    id: "jurnal-karya",
    label: "Jurnal Karya",
    category: "Jurnal Karya",
  },
  {
    id: "prestasi-akademik",
    label: "Prestasi Akademik",
    category: "Prestasi Akademik",
  },
  {
    id: "kegiatan-sosial",
    label: "Kegiatan Sosial",
    category: "Kegiatan Sosial",
  },
  {
    id: "ekstrakurikuler",
    label: "Ekstrakurikuler",
    category: "Ekstrakurikuler",
  },
  {
    id: "pramuka-olahraga",
    label: "Pramuka & Olahraga",
    category: "Pramuka & Olahraga",
  },
];

export function galleryTabForCategory(category: string): GalleryTab {
  if (category === "Kreativitas & Seni") return "kreativitas-seni";
  if (category === "Jurnal Karya") return "jurnal-karya";
  if (category === "Prestasi Akademik") return "prestasi-akademik";
  if (category === "Kegiatan Sosial") return "kegiatan-sosial";
  if (category === "Ekstrakurikuler") return "ekstrakurikuler";
  if (category === "Pramuka & Olahraga") return "pramuka-olahraga";
  return "kreativitas-seni";
}

export function galleryCategoryForTab(tab: GalleryTab) {
  return galleryTabs.find((item) => item.id === tab)?.category ?? "Kreativitas & Seni";
}

interface AdminGallerySectionProps {
  activities: GalleryActivity[];
  onAdd: () => void;
  onEdit: (activity: GalleryActivity) => void;
  onView: (activity: GalleryActivity) => void;
  activeTab: GalleryTab;
  onTabChange: (tab: GalleryTab) => void;
}

export default function AdminGallerySection({
  activities,
  onAdd,
  onEdit,
  onView,
  activeTab,
  onTabChange,
}: AdminGallerySectionProps) {
  const visibleActivities = useMemo(
    () =>
      activities.filter(
        (activity) => galleryTabForCategory(activity.category) === activeTab,
      ),
    [activities, activeTab],
  );
  const activeLabel =
    galleryTabs.find((tab) => tab.id === activeTab)?.label ?? "Kreativitas & Seni";

  return (
    <section className="space-y-5">
      <nav
        aria-label="Kategori galeri kegiatan"
        className="grid grid-cols-2 gap-1.5 rounded-2xl bg-gradient-to-r from-[#07528c] via-[#0b639f] to-[#07528c] p-1.5 shadow-sm sm:grid-cols-3 xl:grid-cols-6"
      >
        {galleryTabs.map((tab) => {
          const count = activities.filter(
            (activity) => galleryTabForCategory(activity.category) === tab.id,
          ).length;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:px-3 sm:text-sm",
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-white/80 hover:bg-white/12 hover:text-white",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "bg-white/15 text-white/90",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleActivities.map((activity) => {
          const coverPhoto =
            activity.photos.find(
              (photo) => photo.id === activity.coverPhotoId,
            ) || activity.photos[0];
          const coverUrl = coverPhoto?.url || "/images/32.webp";
          const crop = activity.cropConfig || { zoom: 1, x: 0, y: 0 };

          return (
            <article
              key={activity.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => onView(activity)}
                className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-slate-950 text-left"
                aria-label={`Lihat detail ${activity.title}`}
              >
                <Image
                  src={coverUrl}
                  alt={activity.title}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  style={{
                    transform: `scale(${crop.zoom}) translate(${crop.x}%, ${crop.y}%)`,
                  }}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-medium text-slate-300">
                    {activity.date}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-snug text-white transition group-hover:text-amber-300">
                    {activity.title}
                  </span>
                </span>
              </button>

              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-white p-3">
                <button
                  type="button"
                  onClick={() => onView(activity)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Lihat Foto →
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(activity)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Edit
                </button>
              </div>
            </article>
          );
        })}

        <article className="group flex flex-col overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-white transition duration-200 hover:border-primary hover:bg-primary/[0.025]">
          <button
            type="button"
            onClick={onAdd}
            className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 text-primary outline-none transition hover:bg-primary/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            aria-label={`Tambah ${activeLabel}`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-3xl font-light leading-none transition group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
              +
            </span>
            <span className="text-sm font-semibold">Tambah {activeLabel}</span>
          </button>
          <div className="border-t border-dashed border-primary/20 px-3 py-3 text-center text-xs text-slate-500">
            Buat publikasi baru
          </div>
        </article>
      </div>
    </section>
  );
}
