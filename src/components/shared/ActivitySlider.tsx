"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function ActivitySlider({
  photos,
}: {
  photos: { src: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const move = (step: number) =>
    setActive((current) => (current + step + photos.length) % photos.length);
  if (!photos.length) return null;
  return (
    <section
      aria-label="Foto kegiatan"
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          move(e.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div
        className="relative overflow-hidden rounded-3xl bg-blue-50"
        onTouchStart={(e) => {
          start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          const point = start.current;
          start.current = null;
          if (!point) return;
          const dx = e.changedTouches[0].clientX - point.x;
          const dy = e.changedTouches[0].clientY - point.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
            move(dx < 0 ? 1 : -1);
        }}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10]">
          <Image
            src={photos[active].src}
            alt={photos[active].alt}
            fill
            sizes="(max-width: 1024px) 90vw, 960px"
            className="object-contain"
          />
        </div>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto sebelumnya"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Foto berikutnya"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <span
          aria-live="polite"
          aria-atomic="true"
          className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1.5 text-xs text-white"
        >
          {active + 1} / {photos.length}
        </span>
      </div>
      {photos.length > 1 && (
        <div
          className="mt-4 flex gap-3 overflow-x-auto pb-2"
          aria-label="Pilih foto"
        >
          {photos.map((photo, index) => (
            <button
              type="button"
              key={`${photo.src}-${index}`}
              aria-label={`Lihat foto ${index + 1}: ${photo.alt}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${active === index ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
