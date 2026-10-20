import Image from "next/image";
import PublicationGrid from "@/components/shared/PublicationGrid";
import Reveal from "@/components/shared/Reveal";
import { imageAsset } from "@/lib/media";

export const revalidate = 600;
export const metadata = { title: "Publikasi & Galeri" };

export default function PublicationsPage() {
  return (
    <>
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-[#062f4d] px-5 pb-8 pt-32 text-white sm:px-8 sm:pb-10 lg:px-12 lg:pt-36">
        <Image
          src={imageAsset(48)}
          alt="Kegiatan SMA Widya Darma"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="-z-20 object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-black/45"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-white/70 to-white sm:h-36"
        />

        <div className="mx-auto flex w-full max-w-[1480px] flex-1 items-center">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100 sm:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
              Cerita sekolah
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Publikasi &amp; Galeri
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Momen belajar, berkarya, dan berprestasi dari keluarga SMA Widya
              Darma. Lihat cerita dan kegiatan sekolah melalui dokumentasi kami.
            </p>
            <a
              href="#galeri"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Jelajahi galeri
            </a>
          </div>
        </div>

      </section>

      <section
        id="galeri"
        aria-label="Kolase publikasi dan galeri sekolah"
        className="school-section scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-10"
      >
        <Reveal>
          <div className="mx-auto w-full max-w-[1480px]">
            <PublicationGrid showFilters={false} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
