import { copy } from "./constants";
import { imageAsset } from "./media";

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
  coverImage?: string;
  coverPosition?: string;
  photos?: { src: string; alt: string }[];
  authorName?: string;
  activityDate?: string;
  article?: string[];
};
const publicationImageIds = [
  3, 5, 9, 31, 33, 41, 34, 35, 11, 12, 50, 39, 40, 47, 48,
];

export const publications: Publication[] = publicationCategories
  .flatMap((category, index) =>
    [0, 1, 2].map((item) => ({
      slug: `${category.toLowerCase()}-${item + 1}`,
      category,
      title: [
        "Lorem ipsum dolor sit amet.",
        "Consectetur adipiscing elit.",
        "Sed do eiusmod tempor.",
      ][item],
      excerpt: copy.body,
      image: imageAsset(publicationImageIds[index * 3 + item]),
    })),
  )
  .map((item) => ({
    ...item,
    coverPosition: "50% 50%",
    authorName: "Tim Dokumentasi Sekolah (contoh)",
    activityDate: "2026-10-01",
    article: [copy.body, copy.long],
    photos: [
      { src: item.image, alt: item.title },
      {
        src: imageAsset(32),
        alt: "Siswa bekerja sama dalam kegiatan belajar",
      },
      { src: imageAsset(14), alt: "Gedung dan halaman SMA Widya Darma" },
    ],
  }));

export type Staff = { id: string; name: string; role: string; image: string };
export const teachers: Staff[] = Array.from({ length: 6 }, (_, index) => ({
  id: `guru-${index + 1}`,
  name: ["Lorem Ipsum", "Dolor Sit Amet", "Consectetur Elit"][index % 3],
  role: ["Lorem ipsum", "Dolor sit amet", "Consectetur elit"][index % 3],
  image: imageAsset(34),
}));
export const leadership: Staff[] = [
  {
    id: "kepala",
    name: "Lorem Ipsum",
    role: "Kepala sekolah",
    image: imageAsset(2),
  },
  {
    id: "kurikulum",
    name: "Dolor Sit Amet",
    role: "Wakil kepala sekolah · Kurikulum",
    image: imageAsset(50),
  },
  {
    id: "kesiswaan",
    name: "Consectetur Elit",
    role: "Wakil kepala sekolah · Kesiswaan",
    image: imageAsset(34),
  },
  {
    id: "sarana",
    name: "Lorem Ipsum",
    role: "Wakil kepala sekolah · Sarana dan prasarana",
    image: imageAsset(11),
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
