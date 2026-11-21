import { publications } from "@/lib/school";

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
};
export const defaultCollageText: CollageText = {
  label: "Publikasi & Galeri",
  title: "Momen belajar, berkarya,",
  accent: "dan berprestasi",
  description: "Cerita dari keluarga SMA Widya Darma.",
};
export const defaultCollageSlots: CollageSlot[] = Array.from(
  { length: 14 },
  (_, id) => ({
    id,
    image: publications[id].coverImage || publications[id].image,
    aspect: [
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
    ][id],
  }),
);
export const collageSlotTitle = (id: number) =>
  `Kolase Galeri ${String(id + 1).padStart(2, "0")}`;
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
