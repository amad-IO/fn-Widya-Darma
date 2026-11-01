import Image from "next/image";
import Link from "next/link";
import SectionLabel from "@/components/shared/SectionLabel";
import Reveal from "@/components/shared/Reveal";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { copy } from "@/lib/constants";
export const revalidate = 3600;
export const metadata = { title: "Informasi SPMB" };

// ─── Static barcode pattern (server/client safe) ───────────────────────────
const barcode = [
  3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 2, 4, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 4, 1, 1,
  2, 1, 3, 2, 1, 4, 1, 2, 1, 1, 3,
];

const passDetails = [
  { label: "Penumpang", value: "Calon Siswa Baru" },
  { label: "Kelas", value: "X (Sepuluh)" },
  { label: "Dari", value: "SMP / MTs" },
  { label: "Tujuan", value: "SMA Widya Darma" },
];

// ─── Section 01: Jadwal ─────────────────────────────────────────────────────
const jadwalGelombang = [
  {
    gelombang: "Gelombang 1",
    date: "01 Jan – 28 Feb 2026",
    status: "Selesai",
    statusColor: "text-slate-400",
    dotColor: "bg-slate-300",
  },
  {
    gelombang: "Gelombang 2",
    date: "01 Mar – 30 Apr 2026",
    status: "Sedang Berjalan",
    statusColor: "text-emerald-600",
    dotColor: "bg-emerald-400",
  },
  {
    gelombang: "Pengumuman",
    date: "15 Mei 2026",
    status: "Akan Datang",
    statusColor: "text-amber-500",
    dotColor: "bg-amber-400",
  },
  {
    gelombang: "Daftar Ulang",
    date: "20 – 31 Mei 2026",
    status: "Akan Datang",
    statusColor: "text-amber-500",
    dotColor: "bg-amber-400",
  },
];

const persyaratan = [
  "Lulusan SMP/MTs atau sederajat",
  "Berusia maksimal 21 tahun saat pendaftaran",
  "Nilai rata-rata rapor minimal 7.00",
  "Berkelakuan baik dan tidak sedang dalam masalah hukum",
  "Berbadan sehat jasmani dan rohani",
  "Mengisi formulir pendaftaran secara lengkap",
];

const dokumen = [
  "Fotokopi ijazah / surat keterangan lulus (dilegalisir)",
  "Fotokopi SKHUN / nilai ujian (dilegalisir)",
  "Fotokopi KK dan KTP orang tua / wali",
  "Fotokopi akta kelahiran",
  "Pas foto terbaru ukuran 3×4 (4 lembar, latar biru)",
  "Fotokopi rapor semester 1–5 (dilegalisir)",
  "Surat keterangan sehat dari dokter / puskesmas",
];

// ─── Section 02: Alur Pendaftaran ───────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Ambil Formulir",
    desc: "Datang ke kantor TU sekolah atau unduh formulir pendaftaran melalui tautan yang tersedia di halaman ini. Isi dengan lengkap dan benar.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M9 12h6M9 16h4M7 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2M9 4h6a1 1 0 010 2H9a1 1 0 010-2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Siapkan Dokumen",
    desc: "Lengkapi seluruh dokumen yang dipersyaratkan. Pastikan semua fotokopi telah dilegalisir dan pas foto sesuai ketentuan.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2M9 11a4 4 0 114 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Serahkan Berkas",
    desc: "Kumpulkan berkas pendaftaran ke kantor TU SMA Widya Darma pada jam kerja (07.00–14.00 WIB). Anda akan menerima bukti penerimaan berkas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Verifikasi & Seleksi",
    desc: "Panitia melakukan verifikasi kelengkapan berkas. Jika diperlukan, calon siswa akan dipanggil untuk mengikuti tes seleksi atau wawancara.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Pengumuman Hasil",
    desc: "Hasil seleksi diumumkan melalui papan pengumuman sekolah dan halaman resmi website. Calon siswa yang diterima wajib melakukan daftar ulang.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Daftar Ulang",
    desc: "Calon siswa yang dinyatakan diterima wajib melakukan daftar ulang sesuai jadwal yang ditentukan dengan membawa dokumen asli.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// ─── Section 03: Biaya Pendidikan ────────────────────────────────────────────
const biayaItems = [
  { label: "Uang Pangkal (sekali bayar)", value: "Rp X.XXX.XXX", note: "Dibayar saat daftar ulang" },
  { label: "SPP per Bulan", value: "Rp XXX.XXX", note: "Dibayar tiap bulan" },
  { label: "Uang Gedung", value: "Rp X.XXX.XXX", note: "Dibayar saat daftar ulang" },
  { label: "Seragam Sekolah", value: "Rp XXX.XXX", note: "Paket lengkap 3 seragam" },
  { label: "Buku & Modul", value: "Rp XXX.XXX", note: "Per tahun ajaran" },
  { label: "Kegiatan Ekskul", value: "Rp XXX.XXX", note: "Per semester" },
];



export default function SpmbPage() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          HERO — SPMB: Konsep "Admission Pass" (tiket masuk masa depan)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f6f7f9] pb-16 pt-6 sm:pb-24 sm:pt-10">
        {/* Teks dekoratif raksasa di latar belakang */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-4 select-none text-[9rem] font-black leading-none tracking-tighter text-primary/[0.04] sm:text-[14rem] lg:text-[18rem]"
        >
          2026
        </p>

        <div className="container-width relative">
          <div className="flex items-center gap-3 text-xs text-muted">
            <Link href="/" className="transition hover:text-primary">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-ink">SPMB</span>
          </div>

          {/* Headline dengan foto inline di tengah kalimat */}
          <h1 className="spmb-rise mt-8 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[4rem]">
            Tiket menuju{" "}
            <span className="relative mx-1 inline-block h-[0.85em] w-[1.9em] -rotate-3 overflow-hidden rounded-full border-[3px] border-white align-middle shadow-lg shadow-blue-950/15">
              <Image
                src="/images/34.webp"
                alt=""
                fill
                sizes="140px"
                className="object-cover object-[60%_30%]"
              />
            </span>{" "}
            masa depanmu{" "}
            <span className="relative whitespace-nowrap text-primary">
              sudah dibuka.
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="spmb-scribble absolute -bottom-2 left-0 h-3 w-full text-sky-400"
              >
                <path
                  d="M2 9 C 60 2, 120 2, 180 6 S 260 10, 298 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Kartu Tiket */}
          <div className="spmb-ticket mt-10 sm:mt-12">
            <div className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_-30px_rgba(7,82,140,0.35)] ring-1 ring-slate-900/5 lg:flex-row">
              {/* Bagian utama tiket: foto */}
              <div className="relative min-h-[280px] flex-1 sm:min-h-[340px] lg:min-h-[400px]">
                <Image
                  src="/images/33.webp"
                  alt="Guru dan siswa SMA Widya Darma belajar bersama di perpustakaan"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover object-[50%_30%]"
                />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                  <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                    Admission Pass
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    Pendaftaran Dibuka
                  </span>
                </div>
              </div>

              {/* Garis sobekan (perforasi) + lubang setengah lingkaran */}
              <div className="relative flex shrink-0 items-center justify-center lg:w-0">
                <span className="absolute -left-4 h-8 w-8 rounded-full bg-[#f6f7f9] lg:-top-4 lg:left-auto" />
                <span className="absolute -right-4 h-8 w-8 rounded-full bg-[#f6f7f9] lg:-bottom-4 lg:right-auto lg:top-auto" />
                <span className="mx-6 w-full border-t-2 border-dashed border-slate-200 lg:mx-0 lg:h-full lg:w-auto lg:border-l-2 lg:border-t-0" />
              </div>

              {/* Potongan tiket (stub) */}
              <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 lg:w-[360px]">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                        Tahun Ajaran
                      </p>
                      <p className="mt-1 text-2xl font-black tracking-tight text-ink">
                        2026<span className="text-primary">/</span>2027
                      </p>
                    </div>
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">
                      Gel. 01
                    </span>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4">
                    {passDetails.map((item) => (
                      <div key={item.label}>
                        <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                          {item.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-ink">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  {/* Barcode dekoratif */}
                  <div
                    aria-hidden="true"
                    className="flex h-12 items-stretch gap-[2px] overflow-hidden"
                  >
                    {barcode.map((w, i) => (
                      <span
                        key={i}
                        className="bg-ink"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-muted">
                    SMAWD-SPMB-2026
                  </p>

                  <a
                    href="#jadwal-syarat"
                    className="group mt-5 flex items-center justify-between rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Lihat syarat &amp; jadwal
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition group-hover:translate-y-0.5">
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
                        <path
                          d="M8 3.5V12.5M8 12.5L12 8.5M8 12.5L4 8.5"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spmbRise {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spmbTicket {
            from { opacity: 0; transform: translateY(48px) rotate(-1.5deg); }
            to { opacity: 1; transform: translateY(0) rotate(0); }
          }
          @keyframes spmbDraw {
            from { stroke-dasharray: 320; stroke-dashoffset: 320; }
            to { stroke-dasharray: 320; stroke-dashoffset: 0; }
          }
          .spmb-rise { animation: spmbRise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .spmb-ticket { animation: spmbTicket 1s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .spmb-scribble path { animation: spmbDraw 1.1s 0.7s ease-out both; }
        `}</style>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 01 — Jadwal & Persyaratan
      ════════════════════════════════════════════════════════════════════ */}
      <section id="jadwal-syarat" className="school-section scroll-mt-24 py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="01">Jadwal &amp; persyaratan SPMB</SectionLabel>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* Jadwal Penerimaan */}
            <Reveal className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary/40">01</p>
              <h2 className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                Jadwal Penerimaan
              </h2>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                Tahun Ajaran 2026/2027
              </h3>
              <p className="mt-2 text-xs text-muted">{copy.short}</p>

              <ul className="mt-6 space-y-3">
                {jadwalGelombang.map((row) => (
                  <li key={row.gelombang} className="flex items-center gap-3">
                    <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${row.dotColor}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">{row.gelombang}</p>
                      <p className="text-xs text-muted">{row.date}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-medium ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-xs text-primary/80">
                <span className="font-semibold">Catatan:</span> {copy.short}
              </div>
            </Reveal>

            {/* Persyaratan Akademis */}
            <Reveal className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary/40">02</p>
              <h2 className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                Persyaratan Calon Siswa
              </h2>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                Akademis &amp; Non-Akademis
              </h3>
              <p className="mt-2 text-xs text-muted">{copy.short}</p>

              <ul className="mt-6 space-y-3">
                {persyaratan.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm text-ink/80">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Dokumen yang diperlukan */}
            <Reveal className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary/40">03</p>
              <h2 className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">
                Dokumen Pendaftaran
              </h2>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
                Berkas yang Harus Disiapkan
              </h3>
              <p className="mt-2 text-xs text-muted">{copy.short}</p>

              <ul className="mt-6 space-y-3">
                {dokumen.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                      <path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-ink/80">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-blue-100"
              >
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
                  <path d="M8 2v8M8 10l-3-3M8 10l3-3M3 14h10" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Unduh Formulir Pendaftaran
              </a>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 02 — Alur Pendaftaran
      ════════════════════════════════════════════════════════════════════ */}
      <section id="alur-pendaftaran" className="school-section scroll-mt-24 bg-white/55 py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="02">Alur pendaftaran</SectionLabel>

          <div className="mt-2 max-w-xl">
            <h2 className="school-heading">Enam langkah menuju kursi impianmu</h2>
            <p className="body-copy mt-4">{copy.body}</p>
          </div>

          {/* Steps grid */}
          <div className="mt-12 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, idx) => (
              <Reveal key={step.num}>
                <div className="relative flex gap-5 border-t border-blue-100 py-8">
                  {/* Nomor besar latar */}
                  <p aria-hidden="true"
                    className="absolute right-0 top-6 select-none text-6xl font-black leading-none tracking-tighter text-slate-100">
                    {step.num}
                  </p>

                  {/* Icon lingkaran */}
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {step.icon}
                  </div>

                  <div className="relative z-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-primary/40">
                      Langkah {step.num}
                    </p>
                    <h3 className="mt-1.5 text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Info box */}
          <Reveal className="mt-8 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-ink/80">
              <span className="font-semibold text-primary">Butuh bantuan?</span>{" "}
              {copy.body} Hubungi kami melalui WhatsApp atau kunjungi langsung kantor TU pada jam kerja.
            </p>
            <WhatsAppButton className="shrink-0" />
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 03 — Biaya Pendidikan
      ════════════════════════════════════════════════════════════════════ */}
      <section id="biaya-pendidikan" className="school-section scroll-mt-24 py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="03">Biaya pendidikan</SectionLabel>

          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            {/* Kiri: teks pengantar + foto */}
            <Reveal className="space-y-6">
              <h2 className="school-heading">Investasi terbaik untuk masa depan</h2>
              <p className="body-copy">{copy.body} {copy.long}</p>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src="/images/32.webp"
                  alt="Suasana kegiatan siswa SMA Widya Darma"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="rounded-xl bg-white/90 px-4 py-2 text-xs font-semibold text-ink shadow">
                    * Biaya dapat berubah. Konfirmasi ke TU untuk info terkini.
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Kanan: tabel biaya */}
            <Reveal className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-ink">Rincian Biaya Masuk</h3>
              <p className="mt-1 text-sm text-muted">Tahun Ajaran 2026/2027 — estimasi, belum termasuk seragam opsional</p>

              <div className="mt-6 divide-y divide-slate-100">
                {biayaItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.label}</p>
                      <p className="text-xs text-muted">{item.note}</p>
                    </div>
                    <span className="shrink-0 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-bold text-primary">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Beasiswa callout */}
              <div className="mt-6 rounded-2xl bg-primary p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                  Program Beasiswa
                </p>
                <p className="mt-2 text-base font-bold leading-snug">
                  Tersedia keringanan biaya &amp; beasiswa prestasi
                </p>
                <p className="mt-2 text-sm opacity-80">{copy.short}</p>
                <a
                  href="#alur-pendaftaran"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold transition hover:bg-white/30"
                >
                  Pelajari selengkapnya
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════════
          SECTION 05 — CTA Daftar Sekarang
      ════════════════════════════════════════════════════════════════════ */}
      <section className="school-section py-16 sm:py-24">
        <div className="container-width">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-14 text-center sm:px-16 sm:py-20">
              {/* Dekorasi latar */}
              <p aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-6 select-none text-[10rem] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[16rem]">
                GO
              </p>
              <p aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 -left-4 select-none text-[10rem] font-black leading-none tracking-tighter text-white/[0.04] sm:text-[16rem]">
                2026
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                Pendaftaran Sedang Dibuka
              </span>

              <h2 className="relative mt-5 text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl">
                Jangan lewatkan kesempatan<br className="hidden sm:block" /> bergabung bersama kami.
              </h2>
              <p className="relative mt-4 text-base text-white/70 sm:text-lg">
                {copy.body}
              </p>

              <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="#jadwal-syarat"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Daftar Sekarang
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <WhatsAppButton className="border border-white/40 bg-white/10 text-white hover:bg-white/20" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

