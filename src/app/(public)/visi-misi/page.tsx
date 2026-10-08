import PageHeader from "@/components/shared/PageHeader";
import CTASection from "@/components/sections/CTASection";
import Reveal from "@/components/shared/Reveal";
import { Flower } from "@/components/shared/Svg";
import { copy } from "@/lib/constants";
export default function VisiMisiPage() {
  return (
    <>
      <PageHeader title="Consectetur adipiscing" />
      <section className="panel -mt-12 bg-white">
        <div className="container-width grid gap-10 lg:grid-cols-2">
          <Reveal className="rounded-[2rem] bg-primary p-8 text-white sm:p-12">
            <Flower className="mb-12 h-20 w-20 text-blue-200" />
            <p className="eyebrow mb-6 text-blue-100">01 / Lorem ipsum</p>
            <h2 className="text-3xl font-medium leading-snug tracking-tight sm:text-4xl">
              {copy.short}
            </h2>
            <p className="mt-8 text-sm leading-7 text-blue-100">{copy.body}</p>
          </Reveal>
          <div className="divide-y divide-blue-100">
            {[
              "Lorem ipsum dolor",
              "Sit amet consectetur",
              "Adipiscing elit sed",
            ].map((title, i) => (
              <Reveal key={title} className="py-8">
                <span className="text-xs text-primary">0{i + 1}</span>
                <h3 className="mb-4 mt-4 text-2xl font-medium">{title}</h3>
                <p className="body-copy">{copy.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
