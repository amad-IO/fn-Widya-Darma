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
  const tilePosition = (tileIndex: number) => {
    if (filtered.length <= 2) {
      return tileIndex === 0
        ? "lg:col-start-1 lg:row-start-1 lg:row-span-2"
        : "lg:col-start-8 lg:row-start-1 lg:row-span-2";
    }
    return [
      "lg:col-start-1 lg:row-start-1 lg:row-span-2",
      "lg:col-start-3 lg:row-start-1",
      "lg:col-start-6 lg:row-start-1 lg:row-span-2",
      "lg:col-start-8 lg:row-start-1",
    ][tileIndex % 4];
  };
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
      <header className="mx-auto mb-10 max-w-2xl text-center md:hidden">
        <p className="eyebrow justify-center text-primary">Galeri sekolah</p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Momen belajar, berkarya, dan berprestasi
        </h1>
        <p className="body-copy mx-auto mt-4 max-w-lg">
          Cerita keseharian dan kegiatan siswa SMA Widya Darma.
        </p>
      </header>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-8 lg:auto-rows-[125px] lg:gap-4 xl:auto-rows-[145px]">
        <div className="col-span-2 mb-2 text-center lg:col-span-4 lg:col-start-3 lg:row-span-2 lg:row-start-3 lg:flex lg:flex-col lg:items-center lg:justify-center lg:px-8">
          <p className="eyebrow justify-center text-primary">Galeri sekolah</p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]">
            Momen belajar, berkarya, dan berprestasi
          </h1>
          <p className="body-copy mt-4 max-w-md">
            Cerita keseharian dan kegiatan siswa SMA Widya Darma.
          </p>
        </div>
        {filtered.map((image, i) => (
          <button
            key={image.id}
            onClick={() => setSelected(image.id)}
            aria-label={`Perbesar: ${image.alt}`}
            className={cn(
              "group relative w-full overflow-hidden rounded-3xl bg-mist text-left shadow-sm shadow-blue-950/10 md:aspect-auto",
              ["aspect-[4/5]", "aspect-square", "aspect-[5/4]", "aspect-[2/3]"][
                i % 4
              ],
              tilePosition(i),
              i % 2 === 1 && "lg:translate-y-4",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 44vw, (max-width: 1024px) 20vw, 220px"
              className="image-zoom object-cover"
            />
            <span className="absolute inset-0 bg-linear-to-t from-ink/55 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 text-xs leading-5 text-white sm:bottom-5 sm:left-5 sm:right-5 sm:text-sm">
              {image.alt}
            </span>
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary transition group-hover:rotate-90 sm:right-4 sm:top-4 sm:h-10 sm:w-10">
              <Plus />
            </span>
          </button>
        ))}
      </div>
      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
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
