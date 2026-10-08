"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gallery } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Arrow, Close, Plus } from "./Svg";
import { cn } from "@/lib/utils";
export default function GalleryGrid() {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const filtered = gallery.filter(
    (image) => category === "all" || image.category === category,
  );
  const index = filtered.findIndex((image) => image.id === selected);
  const active = filtered[index];
  useEffect(() => {
    if (selected) {
      if (!dialog.current?.open) dialog.current?.showModal();
      document.body.classList.add("overflow-hidden");
    } else {
      dialog.current?.close();
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [selected]);
  function move(direction: number) {
    setSelected(
      filtered[(index + direction + filtered.length) % filtered.length].id,
    );
  }
  return (
    <>
      <div
        className="mb-10 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter galeri"
      >
        {[
          { id: "all", label: "Lorem ipsum" },
          { id: "lorem", label: "Lorem" },
          { id: "ipsum", label: "Ipsum" },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant="outline"
            className={cn(
              "h-10 text-xs",
              category === tab.id &&
                "border-primary bg-primary text-white hover:bg-primary-dark",
            )}
            onClick={() => setCategory(tab.id)}
            aria-pressed={category === tab.id}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((image, i) => (
          <button
            key={image.id}
            onClick={() => setSelected(image.id)}
            aria-label={`Perbesar: ${image.alt}`}
            className={cn(
              "group relative overflow-hidden rounded-3xl bg-mist text-left",
              i % 3 === 0 ? "aspect-[1.25]" : "aspect-[1.25] sm:aspect-[1.4]",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 90vw, 560px"
              className="image-zoom object-cover"
            />
            <span className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 text-sm text-white">
              {image.alt}
            </span>
            <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary transition group-hover:rotate-90">
              <Plus />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog m-auto"
        aria-label="Galeri foto"
        onClose={() => setSelected(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") move(1);
          if (event.key === "ArrowLeft") move(-1);
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-6">
          <p className="text-sm" aria-live="polite">
            {active?.alt}
          </p>
          <button
            onClick={() => setSelected(null)}
            aria-label="Tutup foto"
            className="round-link"
          >
            <Close />
          </button>
        </div>
        {active && (
          <Image
            src={active.src}
            alt={active.alt}
            width={1400}
            height={1000}
            loading="eager"
            className="h-auto max-h-[65dvh] w-full rounded-3xl object-contain"
            sizes="90vw"
          />
        )}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => move(-1)}
            aria-label="Foto sebelumnya"
            className="round-link"
          >
            <Arrow className="h-5 w-5 rotate-180" />
          </button>
          <span className="text-xs">
            {index + 1} / {filtered.length}
          </span>
          <button
            onClick={() => move(1)}
            aria-label="Foto berikutnya"
            className="round-link"
          >
            <Arrow />
          </button>
        </div>
      </dialog>
    </>
  );
}
