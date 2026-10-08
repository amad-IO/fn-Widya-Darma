import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import { ArrowUpRight, Flower, Mark } from "@/components/shared/Svg";
import { copy } from "@/lib/constants";
const features = [
  {
    number: "01",
    title: "Lorem ipsum dolor.",
    image: "/images/classroom.jpg",
    href: "/visi-misi",
    color: "bg-[#dceaff]",
    top: "md:top-28",
    shape: "mark",
  },
  {
    number: "02",
    title: "Consectetur elit.",
    image: "/images/library.jpg",
    href: "/ekstrakurikuler",
    color: "bg-[#cbdfff]",
    top: "md:top-36",
    shape: "flower",
  },
  {
    number: "03",
    title: "Sed do eiusmod.",
    image: "/images/students.jpg",
    href: "/spmb",
    color: "bg-primary text-white",
    top: "md:top-44",
    shape: "mark",
  },
];
export default function FeatureSection() {
  return (
    <section className="panel -mt-12 bg-mist">
      <div className="container-width">
        <Reveal className="mb-12 flex flex-col items-center text-center sm:mb-16">
          <p className="eyebrow mb-6 text-primary">02 / Dolor sit amet</p>
          <h2 className="section-heading">
            Lorem ipsum.
            <br />
            <span className="font-normal italic text-primary">
              Dolor sit amet.
            </span>
          </h2>
          <p className="body-copy mt-6 max-w-md">
            {copy.short} Sed do eiusmod tempor incididunt.
          </p>
        </Reveal>
        <div className="space-y-6">
          {features.map((feature) => (
            <article
              key={feature.number}
              className={`group md:sticky ${feature.top} ${feature.color} overflow-hidden rounded-[2rem] border border-white/40 p-6 shadow-[0_-8px_30px_-20px_rgba(16,40,88,0.25)] sm:rounded-[2.5rem] sm:p-8 lg:p-10`}
            >
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-widest opacity-65">
                      / {feature.number}
                    </span>
                    {feature.shape === "flower" ? (
                      <Flower className="h-10 w-10" />
                    ) : (
                      <Mark className="h-10 w-10" />
                    )}
                  </div>
                  <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">
                    {feature.title}
                  </h3>
                  <p
                    className={`mt-5 max-w-md text-sm leading-7 ${feature.number === "03" ? "text-blue-100" : "text-muted"}`}
                  >
                    {copy.body}
                  </p>
                  <Link
                    href={feature.href}
                    className="mt-8 inline-flex items-center gap-6 text-xs font-semibold"
                  >
                    Lorem ipsum
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current/25 transition group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
                <div className="relative h-52 overflow-hidden rounded-3xl sm:h-64 md:h-72">
                  <Image
                    src={feature.image}
                    alt="Lorem ipsum dolor sit amet"
                    fill
                    sizes="(max-width: 768px) 90vw, 560px"
                    className="image-zoom object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
