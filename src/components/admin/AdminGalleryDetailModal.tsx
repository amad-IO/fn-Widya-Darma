"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryActivity } from "@/types/gallery";

interface AdminGalleryDetailModalProps {
  activity: GalleryActivity | null;
  onClose: () => void;
  onEdit: (activity: GalleryActivity) => void;
}

export default function AdminGalleryDetailModal({
  activity,
  onClose,
  onEdit,
}: AdminGalleryDetailModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!activity) return null;

  const photos = [...(activity.photos || [])].sort((a, b) => a.order - b.order);
  const currentPhoto = photos[activePhotoIndex] || photos[0];

  const handleNext = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/70 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <span className="text-[11px] font-semibold text-primary">
              {activity.category}
            </span>
            <h2 className="mt-0.5 text-base font-bold text-slate-900">
              {activity.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(activity);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Edit Kegiatan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Metadata: Date & Author — plain, no card */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{activity.date}</span>
            <span>•</span>
            <span>Oleh {activity.authorName}</span>
            <span>•</span>
            <span>{photos.length} foto</span>
            <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
              {activity.status || "Terbit"}
            </span>
          </div>

          {/* Slider Foto Asli (Original Photos Slider for Detail Page) */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-[16/10] sm:aspect-[16/9] shadow-inner group">
            {currentPhoto && (
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption || activity.title}
                fill
                unoptimized={currentPhoto.url.startsWith("data:")}
                className="object-contain"
              />
            )}

            {/* Slider Controls */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                  title="Foto Sebelumnya"
                >
                  ❮
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                  title="Foto Berikutnya"
                >
                  ❯
                </button>
              </>
            )}

            {/* Photo Caption Badge */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between rounded-lg bg-slate-900/80 px-3.5 py-2 text-xs text-white backdrop-blur-xs">
              <span className="truncate">
                {currentPhoto?.caption || `Foto #${activePhotoIndex + 1}`}
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                {activePhotoIndex + 1} / {photos.length}
              </span>
            </div>
          </div>

          {/* Photo Thumbnail Strip */}
          {photos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    idx === activePhotoIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-slate-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    unoptimized={photo.url.startsWith("data:")}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Article Text Content */}
          {activity.content && (
            <div>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {activity.content}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-900 transition"
          >
            Tutup Preview Detail
          </button>
        </div>
      </div>
    </div>
  );
}
