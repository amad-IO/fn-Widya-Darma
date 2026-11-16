import { GalleryActivity } from "@/types/gallery";

export const initialGalleryActivities: GalleryActivity[] = [
  {
    id: "act-1",
    title: "Pentas Seni & Gelar Karya Siswa 2026",
    slug: "pentas-seni-gelar-karya-siswa-2026",
    date: "08 Oktober 2026",
    authorName: "Budi Santoso, S.Pd.",
    category: "Kreativitas & Seni",
    content:
      "Pentas Seni dan Gelar Karya Siswa SMA Widya Darma menghadirkan beragam karya lukis, pertunjukan musik daerah, dan kreasi teater modern. Kegiatan ini menjadi ajang apresiasi bakat seni serta wadah berekspresi seluruh siswa.",
    photos: [
      {
        id: "p1-1",
        url: "/images/32.webp",
        caption: "Pertunjukan teater dan drama musik siswa",
        order: 1,
      },
      {
        id: "p1-2",
        url: "/images/31.webp",
        caption: "Pameran seni rupa dan lukisan buatan siswa",
        order: 2,
      },
      {
        id: "p1-3",
        url: "/images/14.webp",
        caption: "Suasana kemeriahan panggung utama pensi",
        order: 3,
      },
    ],
    coverPhotoId: "p1-1",
    cropConfig: {
      zoom: 1.15,
      x: 0,
      y: -5,
    },
    status: "Terbit",
    createdAt: "2026-10-08",
  },
  {
    id: "act-2",
    title: "Olimpiade Sains & Teknologi Provinsi",
    slug: "olimpiade-sains-teknologi-provinsi",
    date: "02 Oktober 2026",
    authorName: "Dra. Ratna Lestari",
    category: "Prestasi Akademik",
    content:
      "Tim Olimpiade SMA Widya Darma berhasil membawa pulang 3 medali emas dalam ajang Olimpiade Sains & Teknologi tingkat provinsi. Karya inovasi siswa di bidang robotika otomasi mendapatkan apresiasi tinggi dari dewan juri.",
    photos: [
      {
        id: "p2-1",
        url: "/images/33.webp",
        caption: "Presentasi karya ilmiah tim robotika",
        order: 1,
      },
      {
        id: "p2-2",
        url: "/images/32.webp",
        caption: "Sesi wawancara dan pengujian alat oleh juri",
        order: 2,
      },
    ],
    coverPhotoId: "p2-1",
    cropConfig: {
      zoom: 1.2,
      x: 5,
      y: 0,
    },
    status: "Terbit",
    createdAt: "2026-10-02",
  },
  {
    id: "act-3",
    title: "Bakti Sosial & Donor Darah Widya Darma",
    slug: "bakti-sosial-donor-darah-widya-darma",
    date: "25 September 2026",
    authorName: "Ahmad Rifa'i, M.Pd.",
    category: "Kegiatan Sosial",
    content:
      "PMI bekerja sama dengan PMR SMA Widya Darma menggelar aksi donor darah dan penyaluran paket sembako untuk masyarakat sekitar. Lebih dari 150 kantong darah terkumpul dari guru, staf, alumni, dan siswa.",
    photos: [
      {
        id: "p3-1",
        url: "/images/14.webp",
        caption: "Antrean pendonor darah di aula sekolah",
        order: 1,
      },
      {
        id: "p3-2",
        url: "/images/31.webp",
        caption: "Penyerahan simbolis sembako kepada warga",
        order: 2,
      },
      {
        id: "p3-3",
        url: "/images/32.webp",
        caption: "Panitia PMR bertugas melayani pendonor",
        order: 3,
      },
    ],
    coverPhotoId: "p3-1",
    cropConfig: {
      zoom: 1.0,
      x: 0,
      y: 0,
    },
    status: "Terbit",
    createdAt: "2026-09-25",
  },
];
