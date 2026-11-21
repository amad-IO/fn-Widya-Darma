"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { GalleryActivity } from "@/types/gallery";
import CollageEditor from "./CollageEditor";
import { normalizeGalleryCategory } from "@/lib/gallery-categories";
import { cn } from "@/lib/utils";

export type GalleryTab =
  "semua" | "jurnal-karya" | "prestasi" | "galeri-kegiatan";

export const galleryTabs: {
  id: GalleryTab;
  label: string;
  category: string;
}[] = [
  { id: "semua", label: "Semua", category: "Galeri Kegiatan" },
  { id: "jurnal-karya", label: "Jurnal Karya", category: "Jurnal Karya" },
  { id: "prestasi", label: "Prestasi", category: "Prestasi" },
  {
    id: "galeri-kegiatan",
    label: "Galeri Kegiatan",
    category: "Galeri Kegiatan",
  },
];

export function galleryTabForCategory(category: string): GalleryTab {
  const normalized = normalizeGalleryCategory(category);
  return galleryTabs.find(
    (tab) => tab.id !== "semua" && tab.category === normalized,
  )!.id;
}

export function galleryCategoryForTab(tab: GalleryTab) {
  return (
    galleryTabs.find((item) => item.id === tab)?.category ?? "Galeri Kegiatan"
  );
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
        (activity) =>
          activeTab === "semua" ||
          galleryTabForCategory(activity.category) === activeTab,
      ),
    [activities, activeTab],
  );

  return (
    <section className="mx-auto max-w-6xl space-y-8 pb-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Publikasi sekolah
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Galeri Kegiatan
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Atur kolase melalui ikon pensil. Klik kartu publikasi untuk mengedit
            detail cerita.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#063b68] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          + Tambah publikasi
        </button>
      </header>

      <CollageEditor />

      <div
        role="group"
        aria-label="Filter kategori galeri kegiatan"
        className="flex flex-wrap gap-2"
      >
        {galleryTabs.map((tab) => {
          const count =
            tab.id === "semua"
              ? activities.length
              : activities.filter(
                  (activity) =>
                    galleryTabForCategory(activity.category) === tab.id,
                ).length;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                activeTab === tab.id
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  activeTab === tab.id ? "bg-white/15" : "bg-slate-100",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Cerita & dokumentasi
          </h3>
          <p aria-live="polite" className="text-sm text-slate-500">
            {visibleActivities.length} publikasi
          </p>
        </div>
        {visibleActivities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h4 className="font-semibold text-slate-900">
              Belum ada publikasi di kategori ini
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Tambahkan cerita pertama untuk ditampilkan di galeri kegiatan.
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="mt-5 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50"
            >
              Tambah publikasi
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleActivities.map((activity) => {
              const cover =
                activity.photos.find(
                  (photo) => photo.id === activity.coverPhotoId,
                ) || activity.photos[0];
              const crop = activity.cropConfig || { zoom: 1, x: 0, y: 0 };
              return (
                <article
                  key={activity.id}
                  className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => onEdit(activity)}
                    aria-label={`Edit ${activity.title}`}
                    className="flex flex-1 flex-col text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-blue-50">
                      <Image
                        src={cover?.url || "/images/32.webp"}
                        alt={activity.title}
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 90vw"
                        className="object-cover"
                        style={{
                          transform: `scale(${crop.zoom}) translate(${crop.x}%, ${crop.y}%)`,
                        }}
                      />
                      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
                        {activity.status}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-950/20 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
                          Edit publikasi
                        </span>
                      </span>
                    </span>
                    <span className="block p-4">
                      <span className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-primary">
                          {normalizeGalleryCategory(activity.category)}
                        </span>
                        <span>{activity.date}</span>
                      </span>
                      <span className="mt-3 block text-lg font-semibold leading-snug text-slate-900 group-hover:text-primary">
                        {activity.title}
                      </span>
                      <span className="mt-2 block line-clamp-3 text-sm leading-6 text-slate-500">
                        {activity.content ||
                          "Tambahkan cerita dan dokumentasi kegiatan sekolah."}
                      </span>
                    </span>
                  </button>
                  <div className="mx-4 flex items-center justify-between gap-3 border-t border-slate-100 py-3 text-xs text-slate-500">
                    <span>{activity.photos.length} foto</span>
                    <button
                      type="button"
                      onClick={() => onView(activity)}
                      className="rounded px-1 py-1 text-sm font-medium text-primary hover:underline"
                    >
                      Lihat detail
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
