import Image from "next/image";
import SectionLabel from "@/components/shared/SectionLabel";
import StaffCard from "@/components/shared/StaffCard";
import Reveal from "@/components/shared/Reveal";
import {
  SchoolIntro,
  ContactSection,
} from "@/components/sections/SchoolSections";
import { leadership, teachers } from "@/lib/school";
import { copy } from "@/lib/constants";

export const metadata = { title: "Profil & Visi Misi — SMA Widya Darma" };

export default function ProfilPage() {
  return (
    <>
      {/* HERO — Profil Sekolah */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {/* Background foto */}
        <Image
          src="/images/campus.jpg"
          alt="Foto kampus SMA Widya Darma"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay gelap netral */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Konten teks */}
        <div className="relative z-10 px-6 text-center text-white">
          <p
            className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white"
            style={{ animation: "fadeSlideUp 0.7s ease both" }}
          >
            PROFIL
          </p>
          <h1
            className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animation: "fadeSlideUp 0.85s 0.15s ease both" }}
          >
            SMA Widya Darma
          </h1>
        </div>

        {/* Garis dekoratif bawah */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f5f7fb] to-transparent" />
      </section>

      {/* Keyframes animasi */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Paragraf perkenalan */}
      <section className="school-section py-16 sm:py-20">
        <div className="container-width max-w-3xl">
          <p className="body-copy leading-8 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="body-copy mt-5 leading-8 text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit.
          </p>
        </div>
      </section>
      {/* 01 — Identitas & Sejarah Sekolah */}
      <SchoolIntro profile />

      {/* 02 — Visi & Misi Sekolah */}
      <section id="visi-misi" className="school-section py-20 sm:py-28">
        <div className="container-width">
          {/* Section Heading dengan garis aksen biru */}
          <Reveal className="mb-20 text-center">
            <h2 className="relative inline-block text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Visi &amp; Misi
              <span className="absolute -bottom-3 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-primary" />
            </h2>
          </Reveal>

          <div className="space-y-24 sm:space-y-32">
            {/* ROW 1: 3 KARTU DI KIRI, VISI DI KANAN */}
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Kiri: 3 Kartu Foto Vertikal */}
              <Reveal className="flex justify-center lg:col-span-6">
                <div className="flex items-center justify-center gap-3 py-4 sm:gap-4">
                  <div className="relative h-64 w-24 overflow-hidden rounded-[2.5rem] border-2 border-white shadow-lg shadow-blue-950/10 sm:h-80 sm:w-32 lg:h-88 lg:w-36">
                    <Image
                      src="/images/students.jpg"
                      alt="Siswa SMA Widya Darma"
                      fill
                      sizes="(max-width: 640px) 96px, 144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
                  </div>
                  <div className="relative h-76 w-28 -translate-y-3 overflow-hidden rounded-[2.5rem] border-2 border-white shadow-xl shadow-blue-950/15 sm:h-96 sm:w-36 sm:-translate-y-4 lg:h-[26rem] lg:w-44">
                    <Image
                      src="/images/campus.jpg"
                      alt="Kampus SMA Widya Darma"
                      fill
                      sizes="(max-width: 640px) 112px, 176px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
                  </div>
                  <div className="relative h-64 w-24 translate-y-3 overflow-hidden rounded-[2.5rem] border-2 border-white shadow-lg shadow-blue-950/10 sm:h-80 sm:w-32 sm:translate-y-4 lg:h-88 lg:w-36">
                    <Image
                      src="/images/classroom.jpg"
                      alt="Kelas SMA Widya Darma"
                      fill
                      sizes="(max-width: 640px) 96px, 144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
                  </div>
                </div>
              </Reveal>

              {/* Kanan: Teks Visi */}
              <Reveal delay={0.08} className="flex flex-col justify-center lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Visi Sekolah
                </span>
                <blockquote className="mt-4 text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&rdquo;
                </blockquote>
                <p className="mt-5 text-sm leading-7 text-muted sm:text-base sm:leading-8">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                  nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
              </Reveal>
            </div>

            {/* ROW 2: MISI DI KIRI, 3 KARTU DI KANAN */}
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Kiri: Teks Misi */}
              <Reveal className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Misi Sekolah
                </span>
                <h3 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.
                </h3>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      no: "01",
                      title: "Lorem ipsum dolor sit amet",
                      desc: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                    },
                    {
                      no: "02",
                      title: "Sed do eiusmod tempor",
                      desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    },
                    {
                      no: "03",
                      title: "Duis aute irure dolor in reprehenderit",
                      desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                    },
                  ].map((item) => (
                    <div key={item.no} className="flex items-start gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-xs font-bold text-primary">
                        {item.no}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-ink">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs leading-6 text-muted sm:text-sm">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Kanan: 3 Kartu Foto Vertikal */}
              <Reveal delay={0.08} className="order-1 flex justify-center lg:order-2 lg:col-span-6">
                <div className="flex items-center justify-center gap-3 py-4 sm:gap-4">
                  <div className="relative h-64 w-24 overflow-hidden rounded-[2.5rem] border-2 border-white shadow-lg shadow-blue-950/10 sm:h-80 sm:w-32 lg:h-88 lg:w-36">
                    <Image
                      src="/images/library.jpg"
                      alt="Perpustakaan SMA Widya Darma"
                      fill
                      sizes="(max-width: 640px) 96px, 144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
                  </div>
                  <div className="relative h-76 w-28 -translate-y-3 overflow-hidden rounded-[2.5rem] border-2 border-white shadow-xl shadow-blue-950/15 sm:h-96 sm:w-36 sm:-translate-y-4 lg:h-[26rem] lg:w-44">
                    <Image
                      src="/images/students.jpg"
                      alt="Aktivitas Siswa SMA Widya Darma"
                      fill
                      sizes="(max-width: 640px) 112px, 176px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
                  </div>
                  <div className="relative h-64 w-24 translate-y-3 overflow-hidden rounded-[2.5rem] border-2 border-white shadow-lg shadow-blue-950/10 sm:h-80 sm:w-32 sm:translate-y-4 lg:h-88 lg:w-36">
                    <Image
                      src="/images/classroom.jpg"
                      alt="Fasilitas Belajar SMA Widya Darma"
                      fill
                      sizes="(max-width: 640px) 96px, 144px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Struktur Organisasi */}
      <section id="struktur-organisasi" className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="03">
            Struktur organisasi · Pimpinan sekolah
          </SectionLabel>
          <p className="body-copy mb-12 max-w-xl">{copy.body}</p>
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-xs">
              <StaffCard person={leadership[0]} />
            </div>
            <div className="mx-auto h-10 w-px bg-blue-200" aria-hidden="true" />
            <div className="relative grid gap-6 border-l border-blue-200 pl-6 md:grid-cols-3 md:border-l-0 md:border-t md:pl-0 md:pt-10">
              {leadership.slice(1).map((person) => (
                <div
                  key={person.id}
                  className="relative md:before:absolute md:before:-top-10 md:before:left-1/2 md:before:h-10 md:before:w-px md:before:bg-blue-200"
                >
                  <StaffCard person={person} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Profil Guru */}
      <section id="guru" className="school-section bg-white/55 py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="04">
            Profil guru & tenaga pendidik
          </SectionLabel>
          <p className="body-copy mb-10 max-w-xl">{copy.body}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((person, index) => (
              <Reveal key={person.id} delay={(index % 3) * 0.06}>
                <StaffCard person={person} teacher />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
