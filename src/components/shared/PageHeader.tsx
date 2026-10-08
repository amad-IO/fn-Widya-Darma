import Link from "next/link";
import { copy } from "@/lib/constants";
import Reveal from "./Reveal";
export default function PageHeader({
  title,
  label = "Lorem ipsum dolor",
}: {
  title: string;
  label?: string;
}) {
  return (
    <section className="hero-wash relative overflow-hidden pb-24 pt-12 sm:pb-28 sm:pt-16">
      <div className="container-width relative">
        <div className="mb-10 flex items-center gap-3 text-xs text-muted">
          <Link href="/" className="transition hover:text-primary">
            Beranda
          </Link>
          <span>/</span>
          <span>{label}</span>
        </div>
        <Reveal>
          <p className="eyebrow mb-6 text-primary">{label}</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
            <span className="text-primary">.</span>
          </h1>
          <p className="body-copy mt-6 max-w-xl">{copy.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
