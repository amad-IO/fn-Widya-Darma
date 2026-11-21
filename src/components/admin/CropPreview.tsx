"use client";

import { useEffect, useRef, useState } from "react";
import type { CropConfig } from "@/types/gallery";
import { cropGeometry, decodePhoto } from "@/lib/image-crop";

export default function CropPreview({
  source,
  crop,
}: {
  source: string;
  crop: CropConfig;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setError("");
    setImage(null);
    fetch(source)
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.blob();
      })
      .then(decodePhoto)
      .then((image) => {
        if (active) setImage(image);
      })
      .catch(() => {
        if (active) setError("Foto tidak dapat dimuat. Pilih ulang foto ini.");
      });
    return () => {
      active = false;
    };
  }, [source]);
  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    const context = target.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, target.width, target.height);
    if (!image) return;
    const rect = cropGeometry(
      image.naturalWidth,
      image.naturalHeight,
      target.width,
      target.height,
      crop,
    );
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  }, [image, crop]);
  return (
    <>
      <canvas
        ref={canvas}
        width={480}
        height={300}
        aria-label="Pratinjau hasil crop foto"
        className="h-full w-full pointer-events-none"
      />
      {error && (
        <p
          role="alert"
          className="absolute inset-x-2 bottom-2 rounded bg-rose-50 p-2 text-xs text-rose-700"
        >
          {error}
        </p>
      )}
      {!image && !error && (
        <p
          role="status"
          className="absolute inset-x-2 top-1/2 text-center text-sm text-white"
        >
          Memuat foto…
        </p>
      )}
    </>
  );
}
