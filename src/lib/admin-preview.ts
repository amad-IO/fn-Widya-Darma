import type { AdminIconName } from "@/components/admin/AdminIcon";

export type AdminSection =
  | "dashboard"
  | "guru"
  | "spmb"
  | "galeri"
  | "kelas"
  | "pengaturan";
export type PublicationCategory =
  "Berita" | "Jurnal" | "Karya" | "Prestasi" | "Ekstrakurikuler";
export type PublicationStatus = "Terbit" | "Draf" | "Dalam tinjauan";
export type PreviewPublication = {
  id: number;
  title: string;
  category: PublicationCategory;
  status: PublicationStatus;
  date: string;
  image: string;
  content: string;
};

export const adminNavigation: {
  id: AdminSection;
  label: string;
  icon: AdminIconName;
  caption: string;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "dashboard",
    caption: "Ringkasan pengelolaan website sekolah.",
  },
  {
    id: "guru",
    label: "Data Guru",
    icon: "people",
    caption: "Direktori profil tenaga pendidik sekolah.",
  },
  {
    id: "spmb",
    label: "Informasi SPMB",
    icon: "calendar",
    caption: "Jadwal, persyaratan, dan alur penerimaan siswa baru.",
  },
  {
    id: "galeri",
    label: "Kegiatan",
    icon: "gallery",
    caption: "Dokumentasi foto dan artikel kegiatan sekolah.",
  },
  {
    id: "kelas",
    label: "Kelas",
    icon: "book",
    caption: "Pengelolaan data kelas dan rombongan belajar.",
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: "settings",
    caption: "Pengaturan akun dan informasi administrasi.",
  },
];

export const publicationCategories: PublicationCategory[] = [
  "Berita",
  "Jurnal",
  "Karya",
  "Prestasi",
  "Ekstrakurikuler",
];

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const previewPublications: PreviewPublication[] = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    category: "Berita",
    status: "Terbit",
    date: "06 Okt 2026",
    image: "/images/31.webp",
    content: lorem,
  },
  {
    id: 2,
    title: "Consectetur adipiscing elit",
    category: "Jurnal",
    status: "Dalam tinjauan",
    date: "05 Okt 2026",
    image: "/images/33.webp",
    content: lorem,
  },
  {
    id: 3,
    title: "Sed do eiusmod tempor",
    category: "Karya",
    status: "Draf",
    date: "05 Okt 2026",
    image: "/images/32.webp",
    content: lorem,
  },
  {
    id: 4,
    title: "Ut labore et dolore magna",
    category: "Prestasi",
    status: "Terbit",
    date: "04 Okt 2026",
    image: "/images/14.webp",
    content: lorem,
  },
  {
    id: 5,
    title: "Ut enim ad minim veniam",
    category: "Ekstrakurikuler",
    status: "Terbit",
    date: "03 Okt 2026",
    image: "/images/34.webp",
    content: lorem,
  },
  {
    id: 6,
    title: "Quis nostrud exercitation",
    category: "Berita",
    status: "Draf",
    date: "02 Okt 2026",
    image: "/images/35.webp",
    content: lorem,
  },
];

export const previewStaff = [
  {
    name: "Lorem Ipsum, S.Pd.",
    subject: "Lorem ipsum",
    role: "Kepala Sekolah",
  },
  {
    name: "Dolor Sit Amet, S.Pd.",
    subject: "Dolor sit amet",
    role: "Wakil Kepala Sekolah",
  },
  { name: "Consectetur, S.Pd.", subject: "Consectetur elit", role: "Guru" },
  { name: "Adipiscing Elit, S.Pd.", subject: "Adipiscing elit", role: "Guru" },
];
