import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import SectionLabel from "@/components/shared/SectionLabel";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { copy } from "@/lib/constants";
import { schoolContact } from "@/lib/school";

export default function Footer() {
  const details = [
    {
      label: "Alamat sekolah",
      value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    { label: "Email & media sosial", value: "Lorem ipsum dolor sit amet." },
    {
      label: schoolContact.whatsappUrl
        ? "WhatsApp sekolah"
        : "WhatsApp · Nomor contoh",
      value: schoolContact.whatsappDisplay,
    },
  ];

  return (
    <footer
      className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white"
      aria-label="Kontak dan informasi sekolah"
    >
      <section
        id="kontak"
        className="relative py-16 sm:py-24"
        aria-label="Kontak sekolah dan WhatsApp"
      >
        <div className="container-width grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionLabel className="text-blue-100">
              Kontak sekolah · Pertanyaan lebih lanjut
            </SectionLabel>
            <h2 className="school-heading text-white">
              Lorem ipsum
              <br />
              <span className="text-blue-200">dolor sit amet?</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100/85 sm:text-base sm:leading-8">
              {copy.body}
            </p>
            <div className="mt-7">
              <WhatsAppButton className="bg-white text-primary hover:bg-blue-50 hover:text-primary-dark" />
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="rounded-3xl border border-white/25 bg-white/10 p-7 shadow-2xl shadow-blue-950/20 backdrop-blur-md sm:p-9"
          >
            <div className="space-y-6">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-white/20 pb-5 last:border-0 last:pb-0"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-200">
                    {item.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-width relative flex flex-wrap items-start justify-between gap-8 border-t border-white/15 py-10 pb-24 text-xs text-blue-100">
        <div>
          <p className="font-semibold text-white">SMA Widya Darma</p>
          <p className="mt-3 text-blue-200">© 2026 · Lorem ipsum dolor sit amet.</p>
        </div>
        <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-6 gap-y-4">
          {[
            { href: "/profil", label: "Profil sekolah" },
            { href: "/guru", label: "Guru" },
            { href: "/spmb", label: "SPMB" },
            { href: "/publikasi", label: "Publikasi & galeri" },
            { href: "/kontak", label: "Kontak" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
