export type CollageText = {
  label: string;
  title: string;
  accent: string;
  description: string;
};
export type CollageSlot = {
  id: number;
  image: string;
  aspect: number;
  backendId?: number;
  newsId?: number;
  isCover?: boolean;
  caption?: string;
};
export const defaultCollageText: CollageText = {
  label: "Publikasi & Galeri",
  title: "Momen belajar, berkarya,",
  accent: "dan berprestasi",
  description: "Cerita dari keluarga SMA Widya Darma.",
};
export const collageSlotAspects = [
  7 / 10,
  7 / 10,
  1,
  1,
  1,
  3 / 5,
  3 / 5,
  3 / 5,
  3 / 5,
  1,
  1,
  1,
  7 / 10,
  7 / 10,
];
export const collageTextKey = "widya-darma-collage-text-v1";

export function parseCollageText(raw: string | null): CollageText {
  try {
    const data = JSON.parse(raw || "null");
    if (
      data &&
      Object.keys(defaultCollageText).every(
        (key) => typeof data[key] === "string" && data[key].length <= 300,
      )
    )
      return data;
  } catch {
    /* Use the default copy when stored settings are invalid. */
  }
  return defaultCollageText;
}
