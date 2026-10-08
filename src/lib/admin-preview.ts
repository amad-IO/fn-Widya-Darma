import type { AdminIconName } from "@/components/admin/AdminIcon";

export type AdminSection =
  "dashboard" | "profil" | "guru" | "spmb" | "publikasi" | "galeri" | "kontak";
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
    id: "profil",
    label: "Profil & Organisasi",
    icon: "school",
    caption: "Profil, visi-misi, dan struktur organisasi sekolah.",
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
    id: "publikasi",
    label: "Publikasi",
    icon: "article",
    caption: "Berita, jurnal, karya, dan informasi kegiatan sekolah.",
  },
  {
    id: "galeri",
    label: "Galeri Sekolah",
    icon: "gallery",
    caption: "Dokumentasi prestasi dan kegiatan ekstrakurikuler.",
  },
  {
    id: "kontak",
    label: "Kontak Sekolah",
    icon: "contact",
    caption: "Informasi kontak dan kanal komunikasi resmi sekolah.",
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
    image: "/images/classroom.jpg",
    content: lorem,
  },
  {
    id: 2,
    title: "Consectetur adipiscing elit",
    category: "Jurnal",
    status: "Dalam tinjauan",
    date: "05 Okt 2026",
    image: "/images/library.jpg",
    content: lorem,
  },
  {
    id: 3,
    title: "Sed do eiusmod tempor",
    category: "Karya",
    status: "Draf",
    date: "05 Okt 2026",
    image: "/images/students.jpg",
    content: lorem,
  },
  {
    id: 4,
    title: "Ut labore et dolore magna",
    category: "Prestasi",
    status: "Terbit",
    date: "04 Okt 2026",
    image: "/images/campus.jpg",
    content: lorem,
  },
  {
    id: 5,
    title: "Ut enim ad minim veniam",
    category: "Ekstrakurikuler",
    status: "Terbit",
    date: "03 Okt 2026",
    image: "/images/students.jpg",
    content: lorem,
  },
  {
    id: 6,
    title: "Quis nostrud exercitation",
    category: "Berita",
    status: "Draf",
    date: "02 Okt 2026",
    image: "/images/library.jpg",
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
