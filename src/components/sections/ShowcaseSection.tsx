import Image from "next/image";
import Reveal from "@/components/shared/Reveal";

export default function ShowcaseSection() {
  return (
    <div
      id="lorem"
      aria-label="Lorem ipsum dolor"
      role="group"
      className="relative w-full sm:px-10"
    >
      <div className="hero-card-row mx-auto flex max-w-[700px] snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-6 py-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0">
        {/* Card 1 — tilt kiri */}
        <Reveal
          className="showcase-tilt-left w-52 shrink-0 snap-center sm:w-56 lg:w-auto"
          delay={0.05}
        >
          <div className="showcase-card group block p-2.5">
            <div
              aria-hidden="true"
              className="showcase-illustration aspect-[3/4] w-full overflow-hidden rounded-xl"
            >
              <Image
                src="/images/03.webp"
                alt="Foto kegiatan siswa SMA Widya Darma"
                fill
                sizes="(min-width: 1024px) 220px, 224px"
                className="object-cover image-zoom"
                priority
              />
            </div>
            <div className="relative px-1.5 pt-2.5 pb-1.5">
              <p className="mb-1 text-[8px] font-medium uppercase tracking-wider text-muted">
                Profil sekolah
              </p>
              <h2 className="text-xs font-semibold leading-4 tracking-tight sm:text-[13px]">
                Lorem ipsum. Dolor sit amet, consectetur elit.
              </h2>
              <p className="mt-0.5 text-[11px] leading-4 text-muted">
                Sed do eiusmod.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Card 2 — tengah */}
        <Reveal
          className="showcase-center w-52 shrink-0 snap-center sm:w-56 lg:w-auto"
          delay={0.12}
        >
          <div className="showcase-card group block p-2.5">
            <div
              aria-hidden="true"
              className="showcase-illustration aspect-[3/4] w-full overflow-hidden rounded-xl"
            >
              <Image
                src="/images/01.webp"
                alt="Foto gedung dan fasilitas sekolah"
                fill
                sizes="(min-width: 1024px) 220px, 224px"
                className="object-cover image-zoom"
                priority
              />
            </div>
            <div className="relative px-1.5 pt-2.5 pb-1.5">
              <p className="mb-1 text-[8px] font-medium uppercase tracking-wider text-muted">
                Informasi SPMB
              </p>
              <h2 className="text-xs font-normal leading-4 tracking-tight sm:text-[13px]">
                Lorem ipsum dolor sit{" "}
                <span className="font-semibold">amet, consectetur</span>
              </h2>
              <p className="mt-0.5 text-[11px] leading-4 text-muted">
                Adipiscing elit.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Card 3 — tilt kanan */}
        <Reveal
          className="showcase-tilt-right w-52 shrink-0 snap-center sm:w-56 lg:w-auto"
          delay={0.19}
        >
          <div className="showcase-card group block p-2.5">
            <div
              aria-hidden="true"
              className="showcase-illustration aspect-[3/4] w-full overflow-hidden rounded-xl"
            >
              <Image
                src="/images/31.webp"
                alt="Foto ruang kelas dan kegiatan pembelajaran"
                fill
                sizes="(min-width: 1024px) 220px, 224px"
                className="object-cover image-zoom"
              />
            </div>
            <div className="relative px-1.5 pt-2.5 pb-1.5">
              <p className="mb-1 text-[8px] font-medium uppercase tracking-wider text-muted">
                Publikasi & galeri
              </p>
              <h2 className="text-xs font-normal leading-4 tracking-tight sm:text-[13px]">
                Lorem ipsum{" "}
                <span className="font-semibold">dolor sit amet</span>,
                consectetur.
              </h2>
              <p className="mt-0.5 text-[11px] leading-4 text-muted">
                Tempor incididunt.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
