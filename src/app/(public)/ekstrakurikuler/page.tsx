import Image from "next/image";
import PageHeader from "@/components/shared/PageHeader";
import CTASection from "@/components/sections/CTASection";
import Reveal from "@/components/shared/Reveal";
import Link from "next/link";
import { ArrowUpRight } from "@/components/shared/Svg";
import { copy } from "@/lib/constants";
export default function EkstrakurikulerPage() {
  return (
    <>
      <PageHeader title="Dolor sit amet" />
      <section className="panel -mt-12 bg-white">
        <div className="container-width grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Lorem ipsum",
            "Dolor sit amet",
            "Consectetur elit",
            "Sed do eiusmod",
            "Tempor incididunt",
            "Ut enim veniam",
          ].map((title, i) => (
            <Reveal key={title}>
              <Link
                href="/kontak"
                className="group block overflow-hidden rounded-[2rem] bg-mist"
              >
                <div className="relative aspect-[1.4]">
                  <Image
                    src={
                      [
                        "/images/students.jpg",
                        "/images/library.jpg",
                        "/images/classroom.jpg",
                      ][i % 3]
                    }
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 90vw, 400px"
                    className="image-zoom object-cover"
                  />
                </div>
                <div className="p-7">
                  <span className="text-xs text-primary">/ 0{i + 1}</span>
                  <h2 className="mt-4 text-2xl font-medium">{title}</h2>
                  <p className="body-copy mt-3">{copy.short}</p>
                  <span className="mt-6 inline-flex items-center gap-5 text-xs font-semibold">
                    Lorem ipsum
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
