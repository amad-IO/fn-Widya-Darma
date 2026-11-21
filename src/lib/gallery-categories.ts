export const galleryCategories = [
  "Jurnal Karya",
  "Prestasi",
  "Galeri Kegiatan",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export function normalizeGalleryCategory(category: string): GalleryCategory {
  if (["Jurnal", "Karya", "Jurnal Karya"].includes(category))
    return "Jurnal Karya";
  if (["Prestasi", "Prestasi Akademik"].includes(category)) return "Prestasi";
  return "Galeri Kegiatan";
}
