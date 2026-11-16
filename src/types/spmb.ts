export interface SpmbWave {
  id: string;
  name: string; // e.g. "Gelombang 1"
  period: string; // e.g. "01 Oktober - 31 Desember 2026"
  status: "Aktif" | "Segera Dibuka" | "Ditutup";
  quota: string; // e.g. "120 Siswa"
  discount?: string; // e.g. "Potongan Biaya Gedung 20%"
}

export interface SpmbStep {
  step: number;
  title: string;
  description: string;
}

export interface SpmbFaq {
  question: string;
  answer: string;
}

export interface SpmbInfo {
  academicYear: string; // e.g. "2026/2027"
  status: "Buka" | "Segera Dibuka" | "Ditutup";
  headline: string;
  subheadline: string;
  registrationFee: string; // e.g. "Rp 250.000"
  contactPhone: string; // e.g. "0812-3456-7890"
  contactEmail: string; // e.g. "spmb@widyadarma.sch.id"
  brochureUrl: string; // Path or base64 data
  brochureFileName?: string;
  brochureUploadedAt?: string;
  waves: SpmbWave[];
  requirements: string[];
  steps: SpmbStep[];
  faq: SpmbFaq[];
}
