import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import { ArrowUpRight, Flower } from "@/components/shared/Svg";
import { copy } from "@/lib/constants";
export default function GallerySection() {
  return (
    <section className="panel -mt-12 overflow-hidden bg-primary text-white">
      <div className="container-width">
        <Reveal className="mb-10 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow mb-6 text-blue-100">03 / Consectetur elit</p>
            <h2 className="section-heading">
              Lorem ipsum,
              <br />
              <span className="font-normal italic text-blue-200">
                dolor sit amet.
              </span>
            </h2>
          </div>
          <div className="md:ml-auto md:max-w-xs">
            <p className="text-sm leading-7 text-blue-100">{copy.body}</p>
            <Link
              href="/galeri"
              className="mt-6 inline-flex items-center gap-6 text-xs font-semibold"
            >
              Lorem ipsum
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-[1.4fr_1fr_0.65fr]">
          <Link
            href="/galeri"
            aria-label="Lorem ipsum — galeri"
            className="group relative col-span-2 h-64 overflow-hidden rounded-[2rem] sm:h-80 md:col-span-1 md:h-96"
          >
            <Image
              src="/images/students.jpg"
              alt="Lorem ipsum dolor sit amet"
              fill
              sizes="(max-width: 768px) 90vw, 550px"
              className="image-zoom object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/55 to-transparent" />
            <p className="absolute bottom-6 left-6 text-xs">
              Lorem ipsum dolor sit amet.
            </p>
            <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/50">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/galeri"
            aria-label="Dolor sit amet — galeri"
            className="group relative h-52 overflow-hidden rounded-[2rem] md:mt-12 md:h-80"
          >
            <Image
              src="/images/library.jpg"
              alt="Consectetur adipiscing elit"
              fill
              sizes="(max-width: 768px) 45vw, 380px"
              className="image-zoom object-cover"
            />
          </Link>
          <div className="flex h-52 flex-col items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 p-6 md:mt-24 md:h-64">
            <Flower className="rotate-slow mb-6 h-20 w-20 text-blue-200" />
            <p className="text-center text-xs leading-6 text-blue-100">
              Lorem ipsum.
              <br />
              Dolor sit amet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
