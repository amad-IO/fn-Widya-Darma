import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publications } from "@/lib/school";
import { copy } from "@/lib/constants";
import PageHeader from "@/components/shared/PageHeader";
import SectionLabel from "@/components/shared/SectionLabel";
export const revalidate = 600;
export function generateStaticParams() {
  return publications.map(({ slug }) => ({ slug }));
}
export default async function PublicationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = publications.find((publication) => publication.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageHeader
        title={item.title.replace(/\.$/, "")}
        label={`Publikasi & galeri / ${item.category}`}
      />
      <article className="school-section py-14 sm:py-20">
        <div className="container-width max-w-5xl">
          <SectionLabel>Konten {item.category}</SectionLabel>
          <div className="relative aspect-[1.5] overflow-hidden rounded-[2rem] sm:aspect-[2]">
            <Image
              src={item.image}
              alt={`Foto contoh untuk ${item.category}`}
              fill
              loading="eager"
              sizes="90vw"
              className="object-cover"
            />
          </div>
          <div className="mx-auto mt-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Lorem ipsum dolor sit amet.
            </h2>
            <p className="body-copy mt-6">
              {copy.body} {copy.long}
            </p>
            <p className="body-copy mt-6">
              {copy.long} {copy.body}
            </p>
            <Link
              href="/publikasi"
              className="mt-10 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Kembali ke publikasi & galeri
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
