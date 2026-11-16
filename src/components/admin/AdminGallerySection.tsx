import Image from "next/image";
import type { GalleryActivity } from "@/types/gallery";

interface AdminGallerySectionProps {
  activities: GalleryActivity[];
  onAdd: () => void;
  onEdit: (activity: GalleryActivity) => void;
  onView: (activity: GalleryActivity) => void;
}

export default function AdminGallerySection({
  activities,
  onAdd,
  onEdit,
  onView,
}: AdminGallerySectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Pengelolaan Galeri Kegiatan
            </h2>
            <span className="rounded-full border border-blue-100/70 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              {activities.length} Publikasi
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Kelola kegiatan, foto dokumentasi, dan sampul galeri sekolah.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex self-start items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark active:scale-[0.99] sm:self-auto"
        >
          <span className="text-base font-bold leading-none">+</span>
          <span>Tambah Kegiatan Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {activities.map((activity) => {
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
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
      </div>
    </div>
  );
}
