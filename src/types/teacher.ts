export type TeacherCategory =
  | "MIPA"
  | "Bahasa"
  | "Sosial & Humaniora"
  | "Seni & Olahraga"
  | "Bimbingan Konseling"
  | "Lainnya";

export type TeacherStatus = "Aktif" | "Guru Tetap" | "Guru Honorer" | "Cuti";

export type Teacher = {
  id: string;
  name: string; // e.g. "Karina Fitriwulandari Ilham, S.Kom., M.Kom."
  code?: string; // e.g. "KFI" (displayed in parentheses: (KFI))
  role: string; // e.g. "NJFA", "Guru Mata Pelajaran", "Wali Kelas XII"
  category: TeacherCategory;
  subject: string; // e.g. "Informatika & Ilmu Komputer"
  nip?: string; // e.g. "19880415 201402 2 003"
  nuptk?: string; // e.g. "9456789123456789"
  expertise?: string[]; // e.g. ["Network Security", "Cloud Computing", "Machine Learning", "Network Architecture"]
  email: string; // e.g. "karinafitriwulandari@widyadarma.sch.id"
  phone?: string; // e.g. "+62 812-3456-7890"
  image: string; // URL / path / base64
  education?: string[]; // e.g. ["S1 Pendidikan Ilmu Komputer - UNJ", "S2 Magister Komputer - UI"]
  bio?: string;
  status: TeacherStatus;
  order?: number;
  address?: string; // e.g. "Jl. Melati No. 14, Jakarta Timur"
};
