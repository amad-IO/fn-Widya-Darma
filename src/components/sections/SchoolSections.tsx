import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import SectionLabel from "@/components/shared/SectionLabel";
import StaffCard from "@/components/shared/StaffCard";
import PublicationGrid from "@/components/shared/PublicationGrid";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { ArrowUpRight } from "@/components/shared/Svg";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/constants";
import { leadership, teachers, schoolContact } from "@/lib/school";

const sectionClass = "school-section relative py-16 sm:py-24";
function MoreLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 text-xs font-semibold text-primary transition hover:gap-5"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}

export function SchoolIntro({ profile = false }: { profile?: boolean }) {
  const pillars = [
    {
      tag: "01 · Akademik",
      title: "Kurikulum Terstruktur & Adaptif",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.",
    },
    {
      tag: "02 · Karakter",
      title: "Pembinaan Minat, Bakat & Etika",
      desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.",
    },
    {
      tag: "03 · Fasilitas",
      title: "Lingkungan Belajar Nyaman & Modern",
      desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    },
  ];

  return (
    <section
      id="sekilas-sekolah"
      className={`${sectionClass} relative`}
      aria-label="Tentang SMA Widya Darma"
    >
      <div className="container-width">
        {/* Top Row: Open Editorial Text + Visual Showcase */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Main Story — Tanpa Card */}
          <Reveal className="flex flex-col justify-between lg:col-span-7">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/80 px-3.5 py-1 text-[11px] font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Tentang SMA Widya Darma
              </span>
              <h2 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-[2.65rem]">
                Membangun generasi unggul melalui{" "}
                <span className="text-primary">pendidikan berkualitas.</span>
              </h2>
              <p className="body-copy mt-5 max-w-2xl">{copy.body}</p>
              <p className="body-copy mt-3 max-w-2xl">{copy.short}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-black/10 pt-6 sm:gap-8">
              <div>
                <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  A<span className="text-primary">+</span>
                </p>
                <p className="text-[11px] text-muted">Standar Mutu</p>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  15<span className="text-primary">+</span>
                </p>
                <p className="text-[11px] text-muted">Ekstrakurikuler</p>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div>
                <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  100<span className="text-primary">%</span>
                </p>
                <p className="text-[11px] text-muted">Pendidik Kompeten</p>
              </div>
            </div>
          </Reveal>

          {/* Visual Showcase */}
          <Reveal
            delay={0.08}
            className="group relative min-h-[340px] overflow-hidden rounded-[2rem] border-2 border-white bg-white shadow-[0_12px_30px_-18px_rgba(32,44,69,0.2)] lg:col-span-5"
          >
            <Image
              src="/images/campus.jpg"
              alt="Lingkungan SMA Widya Darma"
              fill
              sizes="(max-width: 1024px) 95vw, 40vw"
              className="object-cover image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />

            <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/85 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink backdrop-blur-md">
              Kampus Utama
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-white/90 p-4 backdrop-blur-xl">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Suasana Belajar
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                Lingkungan kondusif yang mendukung tumbuh kembang akademik dan
                karakter siswa.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Bottom Row — 3 Pillars (Open Editorial, Tanpa Card) */}
        <div className="mt-12 grid gap-8 border-t border-black/10 pt-10 md:grid-cols-3">
          {pillars.map((item, idx) => (
            <Reveal key={item.tag} delay={0.12 + idx * 0.06}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {item.tag}
              </span>
              <h3 className="mt-2.5 text-base font-semibold tracking-tight text-ink sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-muted">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StaffPreview() {
  return (
    <section
      className={sectionClass}
      aria-label="Kepala sekolah dan profil guru"
    >
      <div className="container-width">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel number="03">
              Kepala sekolah & profil guru
            </SectionLabel>
            <h2 className="school-heading">
              Lorem ipsum,
              <br />
              consectetur elit.
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <MoreLink href="/struktur-organisasi">Struktur organisasi</MoreLink>
            <MoreLink href="/guru">Semua guru</MoreLink>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <StaffCard person={leadership[0]} />
          </Reveal>
          {teachers.slice(0, 3).map((person, index) => (
            <Reveal key={person.id} delay={(index + 1) * 0.06}>
              <StaffCard person={person} teacher />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PublicationPreview() {
  return (
    <section
      className={`${sectionClass} bg-blue-50/45`}
      aria-label="Publikasi dan galeri sekolah"
    >
      <div className="container-width">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel number="04">
              Publikasi & galeri · Berita, jurnal, karya, prestasi,
              ekstrakurikuler
            </SectionLabel>
            <h2 className="school-heading">
              Lorem ipsum
              <br />
              <span className="text-primary">dolor sit amet.</span>
            </h2>
          </div>
          <MoreLink href="/publikasi">Semua publikasi</MoreLink>
        </Reveal>
        <PublicationGrid preview />
      </div>
    </section>
  );
}

export function SpmbPreview() {
  return (
    <section
      className={sectionClass}
      aria-label="Informasi penerimaan siswa baru"
    >
      <div className="container-width">
        <Reveal className="grid gap-10 rounded-[2rem] border border-blue-100 bg-white/70 p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-14">
          <div>
            <SectionLabel number="05">
              Informasi SPMB · Penerimaan siswa baru
            </SectionLabel>
            <h2 className="school-heading">
              Lorem ipsum.
              <br />
              <span className="text-primary">Dolor sit amet.</span>
            </h2>
            <p className="body-copy mt-5 max-w-lg">{copy.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl">
                <Link href="/spmb">
                  Informasi SPMB
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <WhatsAppButton />
            </div>
          </div>
          <div className="flex flex-col justify-center divide-y divide-blue-100">
            {["Jadwal penerimaan", "Persyaratan", "Alur pendaftaran"].map(
              (label, index) => (
                <div key={label} className="flex gap-5 py-5">
                  <span className="text-sm text-primary/40">0{index + 1}</span>
                  <div>
                    <h3 className="text-sm font-semibold">{label}</h3>
                    <p className="mt-2 text-xs leading-6 text-muted">
                      {copy.short}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactSection({ page = false }: { page?: boolean }) {
  return (
    <section
      id="kontak"
      className={`${sectionClass} bg-white/55`}
      aria-label="Kontak sekolah dan WhatsApp"
    >
      <div className="container-width grid gap-10 lg:grid-cols-2">
        <Reveal>
          <SectionLabel number={page ? "01" : "06"}>
            Kontak sekolah · Pertanyaan lebih lanjut
          </SectionLabel>
          <h2 className="school-heading">
            Lorem ipsum
            <br />
            <span className="text-primary">dolor sit amet?</span>
          </h2>
          <p className="body-copy mt-5 max-w-lg">{copy.body}</p>
          <div className="mt-7">
            <WhatsAppButton />
          </div>
        </Reveal>
        <Reveal
          delay={0.1}
          className="rounded-3xl border border-blue-100 bg-white p-7 sm:p-9"
        >
          <div className="space-y-6">
            {[
              {
                label: "Alamat sekolah",
                value:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              },
              {
                label: "Email & media sosial",
                value: "Lorem ipsum dolor sit amet.",
              },
              {
                label: schoolContact.whatsappUrl
                  ? "WhatsApp sekolah"
                  : "WhatsApp · Nomor contoh",
                value: schoolContact.whatsappDisplay,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="border-b border-blue-50 pb-5 last:border-0 last:pb-0"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
