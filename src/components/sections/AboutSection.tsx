import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import { ArrowUpRight, Flower } from "@/components/shared/Svg";
import { copy } from "@/lib/constants";
export default function AboutSection() {
  return (
    <section id="lorem" className="panel -mt-12 bg-white">
      <div className="container-width">
        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal>
            <p className="eyebrow text-primary">01 / Lorem ipsum</p>
            <Flower className="mt-12 hidden h-20 w-20 text-blue-100 lg:block" />
          </Reveal>
          <Reveal className="lg:col-span-2">
            <h2 className="section-heading max-w-3xl">
              Lorem ipsum dolor.
              <br />
              <span className="text-muted/80">Sit amet, consectetur</span>
              <br />
              adipiscing elit.
            </h2>
            <div className="mt-8 grid items-start gap-8 sm:grid-cols-[1fr_auto]">
              <p className="body-copy max-w-lg">
                {copy.body} Ut enim ad minim veniam, quis nostrud exercitation
                ullamco.
              </p>
              <Link
                href="/profil"
                aria-label="Lorem ipsum — profil"
                className="round-link text-primary"
              >
                <ArrowUpRight />
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-5 border-t border-blue-100 pt-8 sm:mt-20 sm:gap-12 sm:pt-10">
          {[
            { value: "25", suffix: "+", text: "Lorem ipsum dolor" },
            { value: "1.2", suffix: "k", text: "Sit amet consectetur" },
            { value: "98", suffix: "%", text: "Adipiscing elit sed" },
          ].map((stat) => (
            <Reveal key={stat.value}>
              <p className="text-4xl font-medium tracking-tight sm:text-6xl">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </p>
              <p className="mt-3 text-[10px] text-muted sm:text-sm">
                {stat.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
