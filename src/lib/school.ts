import { copy } from "./constants";

export const profileLinks = [
  { label: "Profil sekolah", href: "/profil" },
  { label: "Struktur organisasi", href: "/struktur-organisasi" },
  { label: "Profil guru", href: "/guru" },
];

export const publicationCategories = [
  "Berita",
  "Jurnal",
  "Karya",
  "Prestasi",
  "Ekstrakurikuler",
] as const;
export type PublicationCategory = (typeof publicationCategories)[number];
export type Publication = {
  slug: string;
  category: PublicationCategory;
  title: string;
  excerpt: string;
  image: string;
};
export const publications: Publication[] = publicationCategories
  .flatMap((category, index) =>
    [0, 1].map((item) => ({
      slug: `${category.toLowerCase()}-${item + 1}`,
      category,
      title:
        item === 0
          ? "Lorem ipsum dolor sit amet."
          : "Consectetur adipiscing elit.",
      excerpt: copy.body,
      image:
        ["students", "library", "classroom", "campus", "students"][
          (index + item) % 5
        ] + ".jpg",
    })),
  )
  .map((item) => ({ ...item, image: `/images/${item.image}` }));

export type Staff = { id: string; name: string; role: string; image: string };
export const teachers: Staff[] = Array.from({ length: 6 }, (_, index) => ({
  id: `guru-${index + 1}`,
  name: ["Lorem Ipsum", "Dolor Sit Amet", "Consectetur Elit"][index % 3],
  role: ["Lorem ipsum", "Dolor sit amet", "Consectetur elit"][index % 3],
  image: "/images/portrait.jpg",
}));
export const leadership: Staff[] = [
  {
    id: "kepala",
    name: "Lorem Ipsum",
    role: "Kepala sekolah",
    image: "/images/portrait.jpg",
  },
  {
    id: "kurikulum",
    name: "Dolor Sit Amet",
    role: "Wakil kepala sekolah · Kurikulum",
    image: "/images/portrait.jpg",
  },
  {
    id: "kesiswaan",
    name: "Consectetur Elit",
    role: "Wakil kepala sekolah · Kesiswaan",
    image: "/images/portrait.jpg",
  },
  {
    id: "sarana",
    name: "Lorem Ipsum",
    role: "Wakil kepala sekolah · Sarana dan prasarana",
    image: "/images/portrait.jpg",
  },
];

// Leave unset until a verified school contact replaces the displayed demo number.
const configuredNumber = process.env.NEXT_PUBLIC_SCHOOL_WHATSAPP?.replace(
  /\D/g,
  "",
);
export const schoolContact = {
  whatsappDisplay: configuredNumber ? `+${configuredNumber}` : "0812 0000 0000",
  whatsappUrl:
    configuredNumber && /^62\d{8,13}$/.test(configuredNumber)
      ? `https://wa.me/${configuredNumber}`
      : null,
};
