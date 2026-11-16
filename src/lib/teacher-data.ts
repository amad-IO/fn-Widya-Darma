import { Teacher } from "@/types/teacher";

export const initialTeachers: Teacher[] = [
  {
    id: "guru-1",
    name: "Karina Fitriwulandari Ilham, S.Kom., M.Kom.",
    code: "KFI",
    role: "NJFA",
    category: "MIPA",
    subject: "Informatika & Rekayasa Komputer",
    nip: "19910412 201801 2 004",
    nuptk: "9234768123456789",
    expertise: [
      "Algoritma & Pemrograman",
      "Struktur Data",
      "Web Development",
      "Kecerdasan Buatan Dasar",
    ],
    email: "karinafitriwulandari@telkomuniversity.ac.id",
    phone: "+62 812-3456-7890",
    image: "/images/teachers/teacher-1.jpg",
    education: [
      "S1 Teknik Informatika - Institut Teknologi Bandung",
      "S2 Magister Ilmu Komputer - Universitas Indonesia",
    ],
    bio: "Berdedikasi dalam membangun literasi teknologi peserta didik dengan pendekatan praktis berbasis proyek serta memotivasi siswa untuk berinovasi di dunia digital.",
    status: "Guru Tetap",
    order: 1,
    address: "Jl. Melati No. 14, Jakarta Timur",
  },
  {
    id: "guru-2",
    name: "Erita Cicilia Febrianti, S.Tr.T., M.Tr.Kom",
    code: "CCL",
    role: "NJFA",
    category: "MIPA",
    subject: "Sistem Jaringan Komputer & Telekomunikasi",
    nip: "19930825 201902 2 006",
    nuptk: "8472910384729102",
    expertise: [
      "Network Security",
      "Cloud Computing",
      "Machine Learning",
      "Network Architecture",
    ],
    email: "eritacicilia@telkomuniversity.ac.id",
    phone: "+62 813-8901-2345",
    image: "/images/teachers/teacher-2.jpg",
    education: [
      "D4 / S.Tr.T Teknik Telekomunikasi - PENS",
      "S2 Magister Terapan Komputer - Politeknik Elektronika Negeri Surabaya",
    ],
    bio: "Praktisi dan akademisi di bidang infrastruktur jaringan dan komputasi awan. Berpengalaman sebagai pembina tim olimpiade sains bidang informatika dan jaringan.",
    status: "Guru Tetap",
    order: 2,
    address: "Jl. Surya Kencana No. 28, Jakarta Selatan",
  },
  {
    id: "guru-3",
    name: "Drs. Budi Santoso, M.Pd.",
    code: "BST",
    role: "NJFA",
    category: "MIPA",
    subject: "Matematika Peminatan & Terapan",
    nip: "19780514 200212 1 003",
    nuptk: "7382910485729183",
    expertise: [
      "Kalkulus Lanjut",
      "Aljabar Linier",
      "Statistika Terapan",
      "Logika Matematika",
    ],
    email: "budisantoso@widyadarma.sch.id",
    phone: "+62 811-2345-6789",
    image: "/images/teachers/teacher-3.jpg",
    education: [
      "S1 Pendidikan Matematika - Universitas Negeri Yogyakarta",
      "S2 Magister Pendidikan Sains Matematika - UPI Bandung",
    ],
    bio: "Lebih dari 18 tahun mendedikasikan diri membina generasi muda dalam berpikir kritis matematis dan meraih berbagai medali Olimpiade Sains Nasional.",
    status: "Guru Tetap",
    order: 3,
    address: "Jl. Anggrek Indah No. 5, Bekasi Barat",
  },
  {
    id: "guru-4",
    name: "Affifah Mutiara Pertiwi, S.Kom., M.Cs.",
    code: "FFM",
    role: "NJFA",
    category: "MIPA",
    subject: "Rekayasa Perangkat Lunak & Desain UI/UX",
    nip: "19941103 202003 2 008",
    nuptk: "6574839201948572",
    expertise: [
      "Human-Computer Interaction",
      "UI/UX Design",
      "Mobile App Development",
      "Database Systems",
    ],
    email: "affifahmutiara@telkomuniversity.ac.id",
    phone: "+62 812-9876-5432",
    image: "/images/teachers/teacher-4.jpg",
    education: [
      "S1 Ilmu Komputer - Universitas Gadjah Mada",
      "S2 Master of Computer Science - Universitas Gadjah Mada",
    ],
    bio: "Fokus pada pengembangan antarmuka ramah pengguna serta pembelajaran interaktif yang mendorong siswa menciptakan aplikasi bernilai sosial tinggi.",
    status: "Guru Tetap",
    order: 4,
    address: "Jl. Mawar Asri Blok C-12, Depok",
  },
  {
    id: "guru-5",
    name: "Yasinta Romadhona, S.Kom., M.Kom.",
    code: "YSO",
    role: "NJFA",
    category: "MIPA",
    subject: "Kecerdasan Buatan & Pemrosesan Data",
    nip: "19920719 201903 2 005",
    nuptk: "5483920184759203",
    expertise: [
      "Data Science",
      "Machine Learning",
      "Information Systems",
      "Computer Vision",
    ],
    email: "yasintaromadhona@telkomuniversity.ac.id",
    phone: "+62 815-6789-0123",
    image: "/images/teachers/teacher-1.jpg",
    education: [
      "S1 Teknik Informatika - Institut Teknologi Sepuluh Nopember",
      "S2 Magister Teknik Informatika - ITS Surabaya",
    ],
    bio: "Pengajar inovatif yang mengintegrasikan pemodelan kecerdasan buatan dalam pembelajaran sains, aktif dalam penulisan modul ajar kurikulum digital.",
    status: "Guru Tetap",
    order: 5,
    address: "Jl. Cempaka Putih Tengah No. 8, Jakarta Pusat",
  },
  {
    id: "guru-6",
    name: "Dra. Ratna Lestari, M.Si.",
    code: "RLS",
    role: "NJFA",
    category: "Sosial & Humaniora",
    subject: "Sosiologi & Antropologi Budaya",
    nip: "19750918 199903 2 002",
    nuptk: "4382910485920194",
    expertise: [
      "Sosiologi Kontemporer",
      "Metodologi Penelitian Sosial",
      "Antropologi Budaya Nusantara",
      "Pendidikan Karakter Siswa",
    ],
    email: "ratnalestari@widyadarma.sch.id",
    phone: "+62 817-4567-8901",
    image: "/images/teachers/teacher-2.jpg",
    education: [
      "S1 Sosiologi - Universitas Airlangga",
      "S2 Magister Sains Sosiologi - Universitas Airlangga",
    ],
    bio: "Mendorong kepedulian sosial, kepekaan budaya, dan keterampilan riset ilmiah bagi generasi muda penerus bangsa.",
    status: "Guru Tetap",
    order: 6,
    address: "Jl. Gatot Subroto No. 45, Jakarta Selatan",
  },
];

const DEFAULT_ADDRESSES: { [id: string]: string } = {
  "guru-1": "Jl. Melati No. 14, Jakarta Timur",
  "guru-2": "Jl. Surya Kencana No. 28, Jakarta Selatan",
  "guru-3": "Jl. Anggrek Indah No. 5, Bekasi Barat",
  "guru-4": "Jl. Mawar Asri Blok C-12, Depok",
  "guru-5": "Jl. Cempaka Putih Tengah No. 8, Jakarta Pusat",
  "guru-6": "Jl. Gatot Subroto No. 45, Jakarta Selatan",
};

const STORAGE_KEY = "widya_darma_teachers_data";

export function getStoredTeachers(): Teacher[] {
  if (typeof window === "undefined") {
    return initialTeachers;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTeachers));
      return initialTeachers;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: Teacher, idx: number) => ({
        ...item,
        address:
          item.address ||
          DEFAULT_ADDRESSES[item.id] ||
          `Jl. Pendidikan No. ${idx + 1}, Jakarta`,
      }));
    }
    return initialTeachers;
  } catch (e) {
    console.error("Gagal membaca data guru dari localStorage:", e);
    return initialTeachers;
  }
}

export function saveStoredTeachers(teachers: Teacher[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    // Dispatch custom event so other components or tabs update immediately
    window.dispatchEvent(
      new CustomEvent("widya_darma_teachers_updated", { detail: teachers })
    );
  } catch (e) {
    console.error("Gagal menyimpan data guru ke localStorage:", e);
  }
}

export function resetStoredTeachers(): Teacher[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTeachers));
    window.dispatchEvent(
      new CustomEvent("widya_darma_teachers_updated", { detail: initialTeachers })
    );
  }
  return initialTeachers;
}
