import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import ArticleCard from "@/components/shared/ArticleCard";
import { ArrowUpRight } from "@/components/shared/Svg";
import { articles } from "@/lib/constants";
export default function NewsSection() {
  return (
    <section className="panel -mt-12 bg-white">
      <div className="container-width">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-6 text-primary">04 / Lorem ipsum</p>
            <h2 className="section-heading">
              Lorem ipsum
              <br />
              <span className="text-muted/80">dolor sit amet.</span>
            </h2>
          </div>
          <Link
            href="/berita"
            className="flex items-center gap-5 text-xs font-semibold"
          >
            Lorem ipsum
            <span className="round-link text-primary">
              <ArrowUpRight />
            </span>
          </Link>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.07}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
