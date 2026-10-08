import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import { ArrowUpRight, Flower } from "@/components/shared/Svg";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/constants";
export default function CTASection() {
  return (
    <section className="panel -mt-12 overflow-hidden bg-[#dceaff]">
      <div className="container-width relative">
        <Flower className="rotate-slow absolute -right-8 top-0 hidden h-64 w-64 text-blue-200/80 sm:block" />
        <Reveal className="relative">
          <p className="eyebrow mb-6 text-primary">Lorem ipsum dolor</p>
          <h2 className="section-heading max-w-2xl">
            Lorem ipsum.
            <br />
            Dolor{" "}
            <span className="font-normal italic text-primary">sit amet?</span>
          </h2>
          <p className="body-copy mt-6 max-w-md">{copy.body}</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/kontak">
              Lorem ipsum dolor
              <ArrowUpRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
