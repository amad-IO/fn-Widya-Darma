import type { CropConfig } from "@/types/gallery";

export function cropGeometry(
  iw: number,
  ih: number,
  width: number,
  height: number,
  crop: CropConfig,
) {
  const scale = Math.max(width / iw, height / ih) * Math.max(1, crop.zoom);
  const dw = iw * scale,
    dh = ih * scale;
  return {
    width: dw,
    height: dh,
    x:
      (width - dw) / 2 +
      (((dw - width) / 2) * Math.max(-100, Math.min(100, crop.x))) / 100,
    y:
      (height - dh) / 2 +
      (((dh - height) / 2) * Math.max(-100, Math.min(100, crop.y))) / 100,
  };
}

export async function decodePhoto(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    const image = new window.Image();
    image.src = url;
    await image.decode();
    return image;
  } catch {
    throw new Error(
      "Format foto tidak dapat dibaca. Gunakan JPG, PNG, WebP, atau GIF.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function cropBlob(
  blob: Blob,
  crop: CropConfig,
  aspect: number,
): Promise<Blob> {
  const image = await decodePhoto(blob);
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(1200, image.naturalWidth);
  canvas.height = Math.max(1, Math.round(canvas.width / aspect));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Browser tidak mendukung crop foto.");
  const rect = cropGeometry(
    image.naturalWidth,
    image.naturalHeight,
    canvas.width,
    canvas.height,
    crop,
  );
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (result) =>
        result
          ? resolve(result)
          : reject(new Error("Gagal menyiapkan hasil crop.")),
      "image/png",
    ),
  );
}
