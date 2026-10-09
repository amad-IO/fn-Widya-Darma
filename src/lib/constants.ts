import type { Article, GalleryImage } from "@/types";
export const copy = {
  short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  long: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
};
export const navigation = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "SPMB", href: "/spmb" },
  { label: "Publikasi & Galeri", href: "/publikasi" },
  { label: "Tanya-AI", href: "/tanya-ai" },
];
export const articles: Article[] = [
  {
    slug: "lorem-ipsum",
    title: "Lorem ipsum dolor sit amet, consectetur.",
    excerpt: copy.body,
    image: "/images/students.jpg",
    category: "lorem",
    date: "01 / 10 / 2026",
  },
  {
    slug: "dolor-sit-amet",
    title: "Sed do eiusmod tempor incididunt.",
    excerpt: copy.body,
    image: "/images/classroom.jpg",
    category: "ipsum",
    date: "24 / 09 / 2026",
  },
  {
    slug: "consectetur-adipiscing",
    title: "Ut enim ad minim veniam, quis nostrud.",
    excerpt: copy.body,
    image: "/images/library.jpg",
    category: "dolor",
    date: "18 / 09 / 2026",
  },
];
export const gallery: GalleryImage[] = [
  {
    id: "1",
    src: "/images/students.jpg",
    alt: "Lorem ipsum dolor sit amet",
    category: "lorem",
  },
  {
    id: "2",
    src: "/images/library.jpg",
    alt: "Consectetur adipiscing elit",
    category: "ipsum",
  },
  {
    id: "3",
    src: "/images/classroom.jpg",
    alt: "Sed do eiusmod tempor",
    category: "lorem",
  },
  {
    id: "4",
    src: "/images/campus.jpg",
    alt: "Ut enim ad minim veniam",
    category: "ipsum",
  },
];
