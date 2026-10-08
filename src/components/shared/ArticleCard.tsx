import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types";
import { ArrowUpRight } from "./Svg";
export default function ArticleCard({
  article,
  base = "/berita",
}: {
  article: Article;
  base?: string;
}) {
  return (
    <Link
      href={`${base}/${article.slug}`}
      className="group block rounded-3xl outline-offset-8"
    >
      <div className="relative aspect-[1.35] overflow-hidden rounded-3xl bg-blue-100">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
          className="image-zoom object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-[10px] capitalize text-ink backdrop-blur-sm">
          {article.category}
        </span>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition duration-300 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="px-1 pb-4 pt-6">
        <p className="text-[10px] tracking-widest text-muted">{article.date}</p>
        <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight transition group-hover:text-primary">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
