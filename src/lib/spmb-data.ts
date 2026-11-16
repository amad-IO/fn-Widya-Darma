import { SpmbInfo } from "@/types/spmb";

export const initialSpmbInfo: SpmbInfo = {
  academicYear: "2026/2027",
  status: "Buka",
  headline: "Penerimaan Siswa Baru (SPMB)",
  subheadline:
    "Bergabunglah bersama keluarga besar SMA Widya Darma untuk mewujudkan generasi unggul, berkarakter, dan berdaya saing global.",
  registrationFee: "Rp 250.000",
  contactPhone: "+62 812-3456-7890",
  contactEmail: "spmb@widyadarma.sch.id",
  brochureUrl: "/images/spmb-brochure.jpg",
  brochureFileName: "Brosur-Resmi-SPMB-SMA-Widya-Darma-2026.jpg",
  brochureUploadedAt: "2026-10-20",
  waves: [
    {
      id: "wave-1",
      name: "Gelombang 1 (Early Bird)",
      period: "01 Oktober - 31 Desember 2026",
      status: "Aktif",
      quota: "120 Kursi",
      discount: "Diskon Biaya Masuk 20% + Bebas Biaya Formulir",
    },
    {
      id: "wave-2",
      name: "Gelombang 2 (Reguler)",
      period: "01 Januari - 31 Maret 2027",
      status: "Segera Dibuka",
      quota: "90 Kursi",
      discount: "Diskon Biaya Masuk 10%",
    },
    {
      id: "wave-3",
      name: "Gelombang 3 (Sisa Kuota)",
      period: "01 April - 30 Juni 2027",
      status: "Segera Dibuka",
      quota: "50 Kursi",
      discount: "Biaya Normal Tanpa Diskon",
    },
  ],
  requirements: [
    "Mengisi formulir pendaftaran online atau offline di sekretariat sekolah",
    "Salinan Rapor SMP/MTs semester 1 sampai 5 yang telah dilegalisir",
    "Salinan Akta Kelahiran dan Kartu Keluarga (KK) calon siswa",
    "Pas foto formal terbaru berwarna ukuran 3x4 (sebanyak 3 lembar)",
    "Surat Keterangan Lulus (SKL) atau Ijazah SMP (jika sudah terbit)",
    "Salinan piagam atau sertifikat prestasi kejuaraan (jalur prestasi)",
  ],
  steps: [
    {
      step: 1,
      title: "Pendaftaran Online / Offline",
      description:
        "Calon siswa atau orang tua mengisi formulir pendaftaran melalui website resmi atau hadir langsung di ruang sekretariat panitia SPMB.",
    },
    {
      step: 2,
      title: "Pengumpulan Berkas & Verifikasi",
      description:
        "Melengkapi dokumen persyaratan administrasi seperti rapor, KK, dan pas foto untuk ditinjau oleh tim verifikasi data.",
    },
    {
      step: 3,
      title: "Observasi & Tes Peminatan",
      description:
        "Mengikuti tes pemetaan akademik, tes minat bakat, dan sesi wawancara singkat bersama psikolog & guru BK sekolah.",
    },
    {
      step: 4,
      title: "Pengumuman & Daftar Ulang",
      description:
        "Hasil kelulusan diumumkan melalui portal SPMB online, dilanjutkan dengan proses registrasi ulang dan orientasi siswa baru.",
    },
  ],
  faq: [
    {
      question: "Kapan pendaftaran SPMB SMA Widya Darma dibuka?",
      answer:
        "Pendaftaran Gelombang 1 dibuka mulai 01 Oktober hingga 31 Desember 2026. Pendaftaran dapat dilakukan kapan saja melalui website atau sekretariat sekolah.",
    },
    {
      question: "Apakah ada program beasiswa bagi siswa berprestasi?",
      answer:
        "Ya, kami menyediakan beasiswa akademik (peringkat kelas/olimpiade) dan non-akademik (seni/olahraga) dengan potongan biaya pendidikan hingga 100%.",
    },
    {
      question: "Bagaimana jika ijazah SMP belum terbit?",
      answer:
        "Calon siswa dapat menggunakan Surat Keterangan Lulus (SKL) sementara atau surat keterangan dari kepala sekolah asal.",
    },
    {
      question: "Apakah tersedia fasilitas asrama bagi siswa luar kota?",
      answer:
        "SMA Widya Darma bekerja sama dengan penyedia akomodasi mitra terpercaya di sekitar kampus sekolah yang aman, nyaman, dan terjangkau.",
    },
  ],
};

const STORAGE_KEY = "widya_darma_spmb_data";

export function getStoredSpmbInfo(): SpmbInfo {
  if (typeof window === "undefined") {
    return initialSpmbInfo;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSpmbInfo));
      return initialSpmbInfo;
    }
    const parsed = JSON.parse(raw);
    return {
      ...initialSpmbInfo,
      ...parsed,
      // Ensure brochureUrl is set
      brochureUrl: parsed.brochureUrl || initialSpmbInfo.brochureUrl,
      waves: Array.isArray(parsed.waves) && parsed.waves.length > 0 ? parsed.waves : initialSpmbInfo.waves,
      requirements: Array.isArray(parsed.requirements) && parsed.requirements.length > 0 ? parsed.requirements : initialSpmbInfo.requirements,
      steps: Array.isArray(parsed.steps) && parsed.steps.length > 0 ? parsed.steps : initialSpmbInfo.steps,
      faq: Array.isArray(parsed.faq) && parsed.faq.length > 0 ? parsed.faq : initialSpmbInfo.faq,
    };
  } catch (e) {
    console.error("Gagal membaca data SPMB dari localStorage:", e);
    return initialSpmbInfo;
  }
}

export function saveStoredSpmbInfo(info: SpmbInfo): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    window.dispatchEvent(
      new CustomEvent("widya_darma_spmb_updated", { detail: info })
    );
  } catch (e) {
    console.error("Gagal menyimpan data SPMB ke localStorage:", e);
  }
}

export function resetStoredSpmbInfo(): SpmbInfo {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSpmbInfo));
    window.dispatchEvent(
      new CustomEvent("widya_darma_spmb_updated", { detail: initialSpmbInfo })
    );
  }
  return initialSpmbInfo;
}
