import { notFound } from "next/navigation";
import { articles } from "@/lib/constants";
import ArticleDetail from "@/components/shared/ArticleDetail";
export const revalidate = 600;
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <ArticleDetail article={article} base="/berita" />;
}
