import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
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
      <PageHeader title="SMA Widya Darma" label="Profil & Visi Misi Sekolah" />

      {/* 01 — Identitas & Sejarah Sekolah */}
      <SchoolIntro profile />

      {/* 02 — Visi & Misi Sekolah */}
      <section id="visi-misi" className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="02">Visi & misi sekolah</SectionLabel>
          <div className="grid gap-8 lg:grid-cols-12">
            <Reveal className="flex flex-col justify-between rounded-3xl border border-blue-200/60 bg-primary p-8 text-white shadow-xl shadow-blue-950/10 sm:p-10 lg:col-span-5">
              <div>
                <span className="inline-block rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-50">
                  Visi Sekolah
                </span>
                <h2 className="mt-6 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </h2>
              </div>
              <p className="mt-8 text-xs leading-6 text-blue-100 sm:text-sm">
                {copy.body}
              </p>
            </Reveal>

            <div className="flex flex-col justify-between gap-4 lg:col-span-7">
              {[
                {
                  no: "01",
                  title: "Lorem ipsum dolor sit amet",
                  desc: copy.body,
                },
                {
                  no: "02",
                  title: "Consectetur adipiscing elit sed do",
                  desc: copy.body,
                },
                {
                  no: "03",
                  title: "Eiusmod tempor incididunt ut labore",
                  desc: copy.body,
                },
              ].map((misi, idx) => (
                <Reveal
                  key={misi.no}
                  delay={idx * 0.06}
                  className="flex gap-5 rounded-3xl border border-white bg-white/80 p-6 shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-primary">
                    {misi.no}
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Misi {misi.no}
                    </p>
                    <h3 className="mt-1 text-base font-semibold tracking-tight sm:text-lg">
                      {misi.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-muted">
                      {misi.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Fasilitas Sekolah */}
      <section
        id="fasilitas"
        className="school-section bg-white/55 py-16 sm:py-24"
      >
        <div className="container-width">
          <SectionLabel number="03">Fasilitas sekolah</SectionLabel>
          <h2 className="school-heading mb-10">Lorem ipsum, dolor sit.</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {["classroom", "library", "campus"].map((image, index) => (
              <Reveal key={image}>
                <div className="relative aspect-[1.2] overflow-hidden rounded-3xl">
                  <Image
                    src={`/images/${image}.jpg`}
                    alt="Foto contoh fasilitas sekolah"
                    fill
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold text-primary">
                  {
                    ["Ruang belajar", "Perpustakaan", "Lingkungan sekolah"][
                      index
                    ]
                  }
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Lorem ipsum dolor sit.
                </h3>
                <p className="mt-2 text-xs leading-6 text-muted">
                  {copy.short}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Struktur Organisasi */}
      <section id="struktur-organisasi" className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="04">
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

      {/* 05 — Profil Guru */}
      <section id="guru" className="school-section bg-white/55 py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="05">
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
