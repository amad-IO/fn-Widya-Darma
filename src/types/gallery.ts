export type GalleryPhoto = {
  cropConfig?: CropConfig;
  id: string;
  url: string;
  caption?: string;
  order: number;
};

export type CropConfig = {
  zoom: number; // Range e.g. 1.0 - 3.0
  x: number; // Offset X percentage (-50 to 50)
  y: number; // Offset Y percentage (-50 to 50)
};

export type GalleryActivity = {
  backendId?: number;
  id: string;
  title: string;
  slug: string;
  date: string;
  authorName: string; // MANDATORY: Penulis / Penanggung Jawab Artikel
  category: string;
  content: string;
  photos: GalleryPhoto[];
  coverPhotoId: string;
  cropConfig: CropConfig;
  status: "Terbit" | "Draf";
  createdAt?: string;
};
