export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: "lorem" | "ipsum" | "dolor";
  date: string;
};
export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  category: "lorem" | "ipsum";
};
