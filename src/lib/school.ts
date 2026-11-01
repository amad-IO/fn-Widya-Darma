import { copy } from "./constants";
import { imageAsset } from "./media";

export const profileLinks = [
  { label: "Profil sekolah", href: "/profil" },
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
  3, 5, 9, 31, 33, 41, 34, 35, 11, 36, 50, 39, 40, 47, 48,
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

export type Staff = {
  id: string;
  name: string;
  role: string;
  image: string;
  badge?: string;
  department?: string;
  alumni?: string;
  experience?: string;
};

const teacherImages = [50, 34, 22, 23, 25, 18];

export const teachers: Staff[] = Array.from({ length: 6 }, (_, index) => ({
  id: `guru-${index + 1}`,
  name: [
    "Lorem Ipsum, M.Pd.",
    "Dolor Sit Amet, S.Pd.",
    "Consectetur Elit, S.Si.",
  ][index % 3],
  role: [
    "Wakil Kepala Sekolah",
    "Guru Matematika",
    "Guru Bahasa Indonesia",
    "Guru Biologi",
    "Guru Fisika",
    "Guru Ekonomi",
  ][index],
  badge: [
    "Wakasek Kurikulum",
    "Guru Produktif",
    "Guru Mapel",
    "Guru Sains",
    "Guru Sains",
    "Tenaga Kependidikan",
  ][index],
  department: [
    "Manajemen & Kurikulum",
    "Bidang Studi Matematika",
    "Bidang Studi Bahasa & Sastra",
    "Bidang Studi Biologi",
    "Bidang Studi Fisika",
    "Bidang Studi Ekonomi & Administrasi",
  ][index],
  alumni: [
    "Alumni S2 Universitas Lorem Ipsum",
    "Alumni S1 Universitas Dolor Sit Amet",
    "Alumni S1 Institut Consectetur Elit",
  ][index % 3],
  experience:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua dalam dunia pendidikan.",
  image: imageAsset(teacherImages[index % teacherImages.length]),
}));

export const leadership: Staff[] = [
  {
    id: "kepala",
    name: "Lorem Ipsum, M.Pd.",
    role: "Kepala sekolah",
    badge: "Kepala Sekolah",
    department: "Pimpinan & Manajemen Sekolah",
    alumni: "Alumni S2 Universitas Lorem Ipsum",
    experience:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Berpengalaman memimpin pengembangan akademik dan karakter siswa.",
    image: imageAsset(2),
  },
  {
    id: "kurikulum",
    name: "Dolor Sit Amet, M.Pd.",
    role: "Wakil kepala sekolah · Kurikulum",
    badge: "Wakasek Kurikulum",
    department: "Bidang Studi Matematika",
    alumni: "Alumni S2 Universitas Dolor Sit Amet",
    experience:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: imageAsset(50),
  },
  {
    id: "kesiswaan",
    name: "Consectetur Elit, S.Pd.",
    role: "Wakil kepala sekolah · Kesiswaan",
    badge: "Wakasek Kesiswaan",
    department: "Pembinaan Karakter & Ekstrakurikuler",
    alumni: "Alumni S1 Universitas Consectetur Elit",
    experience:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    image: imageAsset(34),
  },
  {
    id: "sarana",
    name: "Lorem Ipsum, S.AP.",
    role: "Wakil kepala sekolah · Sarana dan prasarana",
    badge: "Tenaga Kependidikan",
    department: "Administrasi & Sarana Prasarana",
    alumni: "Alumni S1 Institut Lorem Ipsum",
    experience:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
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
