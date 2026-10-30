import Image from "next/image";
import PublicationGrid, {
  PublicationMosaic,
} from "@/components/shared/PublicationGrid";
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
          className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/25 to-black/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-gradient-to-b from-transparent via-white/55 via-60% to-white sm:h-64 lg:h-72"
        />

        <div className="relative z-20 mx-auto flex w-full max-w-[1480px] flex-1 items-center pb-16 sm:pb-24">
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
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Jelajahi galeri
            </a>
          </div>
        </div>
      </section>

      <section
        id="galeri"
        aria-label="Kolase publikasi dan galeri sekolah"
        className="relative z-20 scroll-mt-24 bg-white px-5 pt-4 pb-10 sm:px-8 sm:pt-8 sm:pb-12 lg:px-10"
      >
        <div className="mx-auto w-full max-w-[1480px]">
          <PublicationMosaic />
        </div>
      </section>

      <section
        id="kegiatan"
        aria-label="Daftar galeri kegiatan dan berita sekolah"
        className="bg-white pt-4 pb-16 sm:pt-8 sm:pb-24"
      >
        <div className="container-width">
          <PublicationGrid />
        </div>
      </section>
    </>
  );
}
