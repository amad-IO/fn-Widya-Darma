import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types";
import { copy, articles } from "@/lib/constants";
import { Arrow } from "./Svg";
import ArticleCard from "./ArticleCard";
export default function ArticleDetail({
  article,
  base,
}: {
  article: Article;
  base: string;
}) {
  return (
    <>
      <section className="hero-wash pb-24 pt-12 sm:pb-28 sm:pt-16">
        <div className="container-width">
          <Link
            href={base}
            className="mb-8 inline-flex items-center gap-3 text-xs text-primary"
          >
            <Arrow className="h-4 w-4 rotate-180" />
            Lorem ipsum
          </Link>
          <p className="eyebrow mb-6 text-primary">
            {article.category} / {article.date}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="body-copy mt-6 max-w-2xl">{article.excerpt}</p>
        </div>
      </section>
      <section className="panel -mt-12 bg-white">
        <div className="container-width">
          <div className="relative mb-12 aspect-[1.5] overflow-hidden rounded-[2rem] sm:aspect-[2.3]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              preload
              sizes="90vw"
              className="object-cover"
            />
          </div>
          <div className="mx-auto max-w-2xl">
            <p className="body-copy">
              {copy.body} {copy.long}
            </p>
            <h2 className="my-8 text-3xl font-medium tracking-tight">
              Lorem ipsum dolor sit amet.
            </h2>
            <p className="body-copy">
              {copy.long} {copy.body}
            </p>
            <blockquote className="my-8 rounded-3xl bg-mist p-8 text-2xl leading-relaxed text-primary">
              “{copy.short}”
            </blockquote>
            <p className="body-copy">
              {copy.body} {copy.long}
            </p>
          </div>
          <div className="mt-16 border-t border-blue-100 pt-12">
            <h2 className="mb-8 text-3xl font-medium">Lorem ipsum dolor.</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {articles
                .filter((item) => item.slug !== article.slug)
                .map((item) => (
                  <ArticleCard key={item.slug} article={item} base={base} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
