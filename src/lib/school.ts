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
  "Jurnal Karya",
  "Galeri Kegiatan",
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
      slug: `${category.toLowerCase().replace(/\s+/g, "-")}-${item + 1}`,
      category,
      title: [
        "Lorem ipsum dolor sit amet.",
        "Consectetur adipiscing elit.",
        "Sed do eiusmod tempor.",
      ][item],
      excerpt: copy.body,
      image: imageAsset(
        publicationImageIds[(index * 3 + item) % publicationImageIds.length],
      ),
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
  code?: number;
  name: string;
  role: string;
  image: string;
  badge?: string;
  department?: string;
  alumni?: string;
  experience?: string;
};

const teacherNames = [
  "Suharni, S.Pd.",
  "Drs. Sumarno, S.E., M.M.",
  "Tri Hastutik, S.Pd.",
  "Tri Indarwati, S.Pd.",
  "Naning Tri Rahayu, S.E., M.Ak.",
  "Moya Arfiana, S.Pd.",
  "Sharvina Yudatika, S.Pd.",
  "Anisa Nur Vitria, S.Pd.",
  "Dwi Nona Ayu Kharisma, S.Pd.",
  "Ernasari, S.Pd.",
  "Aldika Perdani, S.Pd.",
  "Vahemas Aditya P. Putra, S.Si., M.Pd.",
  "Dwi Savitri Vidyawati, S.Si.",
  "M. Husni Hamdani, S.Hum., M.Pd.",
  "Aji Restu Septian Arwanto, S.Pd.",
  "Redy Dwi Kristiyanto, S.Sosio.",
  "Lilik Aisyah, S.Pd.",
  "Aprilia Dyah Wulandari, S.Pd.",
  "Dina Adelia Waluyo, S.Pd.",
  "Better Boy Nainggolan, S.Pd.K.",
];

export const teachers: Staff[] = teacherNames.map((name, index) => ({
  id: `guru-${index + 1}`,
  code: index + 1,
  name,
  role: "Guru",
  image: "/images/staff-placeholder.svg",
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

const configuredNumber = process.env.NEXT_PUBLIC_SCHOOL_WHATSAPP?.replace(
  /\D/g,
  "",
);
const whatsappNumber =
  configuredNumber && /^62\d{8,13}$/.test(configuredNumber)
    ? configuredNumber
    : "6285921095353";

export const schoolContact = {
  address: "Jl. Ketintang No. 147-151, Surabaya",
  email: "smawdsby@gmail.com",
  whatsappDisplay:
    whatsappNumber === "6285921095353" ? "085921095353" : `+${whatsappNumber}`,
  whatsappUrl: `https://wa.me/${whatsappNumber}`,
  socialMedia: [
    {
      label: "TikTok",
      account: "smadya.official",
      url: "https://www.tiktok.com/@smadyaofficial?_r=1&_t=ZS-9B5QiKiteBs",
    },
    {
      label: "Instagram",
      account: "smadya_official",
      url: "https://www.instagram.com/smadya_official?dlrf=b3l6MTVvdmJveGYw",
    },
    {
      label: "YouTube",
      account: "SMA WIDYA DARMA SURABAYA",
      url: "https://youtube.com/@smadyajaya?si=1nzEfnm1IHo61q1W",
    },
  ],
};
