import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import type { Staff } from "@/lib/school";
import { getPublicTeachers } from "@/lib/public-teachers";

export const metadata = { title: "Daftar Guru" };

function StaffDirectoryCard({ person }: { person: Staff }) {
  const isTendik =
    person.badge?.toLowerCase().includes("tenaga kependidikan") ||
    person.role.toLowerCase().includes("sarana");

  return (
    <article className="group flex h-full gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md">
      {/* Kolom Kiri: Foto + Badge + Nama di bawah foto */}
      <div className="flex w-32 shrink-0 flex-col sm:w-36">
        <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-xl bg-blue-100">
          <Image
            src={person.image}
            alt={`${person.name} — ${person.role}`}
            fill
            sizes="144px"
            unoptimized={person.image.startsWith("/api/media?")}
            className="object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>

        <div className="mt-2.5">
          <span
            className={
              isTendik
                ? "inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                : "inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-primary"
            }
          >
            {person.badge ?? person.role}
          </span>

          <h3 className="mt-1.5 text-xs font-bold leading-snug tracking-tight text-ink sm:text-[13px]">
            {person.name}
          </h3>
        </div>
      </div>

      {/* Kolom Kanan: Bidang Studi, Alumni & Pengalaman Karir */}
      <div className="flex min-w-0 flex-1 flex-col justify-between border-l border-slate-100 pl-4">
        <div>
          <p className="text-xs font-semibold text-primary">
            {person.department ?? person.role}
          </p>

          <p className="mt-2 text-[11px] font-semibold text-ink/85 sm:text-xs">
            Kode guru {person.code}
          </p>
          {person.alumni && (
            <p className="mt-2 text-xs text-ink/85">{person.alumni}</p>
          )}
          {person.experience && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{person.experience}</p>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function TeachersPage() {
  const teachers = await getPublicTeachers();
  return (
    <>
      {/* HERO — Profil Guru dengan Background Image Full */}
      <section className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden bg-[#062f4d] pb-20 pt-28 text-white sm:pb-24 sm:pt-32">
        <Image
          src="/images/50.webp"
          alt="Pendidik dan tenaga kependidikan SMA Widya Darma"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-top"
        />
        {/* Overlay gelap netral agar teks tetap terbaca jelas */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />

        <div className="container-width relative z-20 flex flex-1 flex-col justify-between">
          {/* Breadcrumb: Beranda / Profil Guru */}
          <div className="flex items-center gap-3 text-xs font-medium text-white/80">
            <Link href="/" className="transition hover:text-white">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-white">Profil Guru</span>
          </div>

          {/* Konten Judul Hero dengan koreografi animasi berbeda di tiap elemen */}
          <div className="mx-auto my-auto max-w-2xl py-10 text-center">
            {/* 1. Badge: Zoom-pop + Blur-in + Glowing Dot */}
            <div className="hero-anim-badge mx-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
              </span>
              Direktori Guru
            </div>

            {/* 2. Heading: Staggered Word Mask Slide-Up + 3. Highlight Shimmer & Underline Draw */}
            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              <span className="block">
                <span className="inline-block overflow-hidden align-bottom pb-1">
                  <span
                    className="hero-anim-word inline-block"
                    style={{ animationDelay: "0.12s" }}
                  >
                    Pendidik
                  </span>
                </span>{" "}
                <span className="inline-block overflow-hidden align-bottom pb-1">
                  <span
                    className="hero-anim-word inline-block"
                    style={{ animationDelay: "0.24s" }}
                  >
                    berdedikasi,
                  </span>
                </span>
              </span>

              <span className="block">
                <span className="inline-block overflow-hidden align-bottom pb-1">
                  <span
                    className="hero-anim-word inline-block"
                    style={{ animationDelay: "0.36s" }}
                  >
                    membimbing
                  </span>
                </span>
              </span>

              <span className="hero-anim-highlight relative mt-1 inline-block">
                <span className="hero-shimmer-text">generasi berprestasi</span>
                <span
                  aria-hidden="true"
                  className="hero-anim-underline pointer-events-none absolute -bottom-1.5 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"
                />
              </span>
            </h1>

            {/* 4. Deskripsi: Blur-to-Crisp Cinematic Fade */}
            <p className="hero-anim-desc mt-5 text-sm leading-6 text-white/85 sm:text-base">
              Mengenal {teachers.length} guru SMA Widya Darma Surabaya.
            </p>
          </div>
        </div>

        <style>{`
          @keyframes heroBadgePop {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(-10px);
              filter: blur(6px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0);
            }
          }
          @keyframes heroWordSlide {
            0% {
              opacity: 0;
              transform: translateY(110%) rotate(2deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
          }
          @keyframes heroHighlightSpring {
            0% {
              opacity: 0;
              transform: scale(0.88) translateY(16px);
              filter: blur(8px);
            }
            70% {
              opacity: 1;
              transform: scale(1.03) translateY(-2px);
              filter: blur(0);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0);
            }
          }
          @keyframes heroUnderlineDraw {
            0% {
              transform: scaleX(0);
              opacity: 0;
            }
            100% {
              transform: scaleX(1);
              opacity: 1;
            }
          }
          @keyframes heroShimmer {
            0% {
              background-position: 200% center;
            }
            100% {
              background-position: -200% center;
            }
          }
          @keyframes heroDescBlur {
            0% {
              opacity: 0;
              transform: translateY(14px);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
          .hero-anim-badge {
            animation: heroBadgePop 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .hero-anim-word {
            animation: heroWordSlide 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          .hero-anim-highlight {
            animation: heroHighlightSpring 0.85s 0.52s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .hero-shimmer-text {
            background: linear-gradient(
              110deg,
              #bae6fd 0%,
              #ffffff 45%,
              #7dd3fc 55%,
              #bae6fd 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: heroShimmer 6s linear infinite;
          }
          .hero-anim-underline {
            transform-origin: center;
            animation: heroUnderlineDraw 0.8s 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
          .hero-anim-desc {
            animation: heroDescBlur 0.85s 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          }
        `}</style>
      </section>

      {/* Daftar Card Profil Guru & Karyawan */}
      <section className="school-section py-12 sm:py-16">
        <div className="container-width">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-ink">Daftar Nama Guru</h2>
            <p className="text-sm text-muted">Jumlah: {teachers.length} guru</p>
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((person, index) => (
              <Reveal
                key={`${person.id}-${index}`}
                delay={(index % 3) * 0.05}
                className="h-full"
              >
                <StaffDirectoryCard person={person} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
