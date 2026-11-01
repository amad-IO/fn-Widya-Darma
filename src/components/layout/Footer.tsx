import Link from "next/link";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { ArrowUpRight, Ticket } from "@/components/shared/Svg";
import { schoolContact } from "@/lib/school";

const navigationLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil Sekolah" },
  { href: "/guru", label: "Profil Guru" },
  { href: "/spmb", label: "Informasi SPMB" },
  { href: "/publikasi", label: "Galeri Kegiatan" },
  { href: "/tanya-ai", label: "Tanya AI" },
];

export default function Footer() {
  return (
    <footer
      id="kontak"
      aria-label="Kontak dan informasi sekolah"
      className="relative w-full border-t border-slate-200/80 bg-gradient-to-b from-[#083359] to-[#041d33] text-white"
    >
      <div className="container-width py-12 sm:py-14">
        {/* Grid Konten Utama */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Kolom 1: Identitas Sekolah (4 Kolom) */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-sky-300">
                <Ticket className="h-4 w-4" />
              </span>
              SMA Widya Darma
            </Link>
            <p className="mt-3.5 max-w-sm text-xs leading-relaxed text-blue-100/75">
              Mewujudkan generasi berkarakter unggul, berwawasan luas, dan siap
              menghadapi tantangan masa depan melalui pendidikan berkualitas.
            </p>

          </div>

          {/* Kolom 2: Navigasi (2 Kolom) */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              Navigasi
            </p>
            <ul className="mt-4 space-y-2.5 text-xs">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1 text-blue-100/80 transition hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Alamat (3 Kolom) */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              Kontak Sekolah
            </p>
            <dl className="mt-4 space-y-3 text-xs">
              <div>
                <dt className="font-semibold text-blue-200/80">Alamat</dt>
                <dd className="mt-1 leading-relaxed text-blue-50/90">
                  Jl. Lorem Ipsum Dolor No. 10, Jakarta
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-blue-200/80">Email</dt>
                <dd className="mt-1 text-blue-50/90">info@widyadarma.sch.id</dd>
              </div>
              <div>
                <dt className="font-semibold text-blue-200/80">WhatsApp</dt>
                <dd className="mt-1 font-semibold text-white">
                  {schoolContact.whatsappDisplay}
                </dd>
              </div>
            </dl>
          </div>

          {/* Kolom 4: Bantuan & Layanan (3 Kolom) */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
              Pusat Layanan
            </p>
            <p className="mt-4 text-xs leading-relaxed text-blue-100/75">
              Butuh konsultasi atau informasi pendaftaran siswa baru? Hubungi
              kami langsung melalui WhatsApp.
            </p>
            <div className="mt-4">
              <WhatsAppButton className="w-full justify-center rounded-xl bg-white text-xs font-semibold text-primary shadow-sm hover:bg-blue-50" />
            </div>
          </div>
        </div>

        {/* Baris Bawah: Copyright */}
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-blue-200/60 sm:flex-row sm:items-center">
          <p>© 2026 SMA Widya Darma. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-blue-200/50">
            <span>Akreditasi A+</span>
            <span>·</span>
            <span>Unggul &amp; Berkarakter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
