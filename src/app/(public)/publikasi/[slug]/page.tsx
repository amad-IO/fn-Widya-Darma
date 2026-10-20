import Link from "next/link";
import { notFound } from "next/navigation";
import { publications } from "@/lib/school";
import ActivitySlider from "@/components/shared/ActivitySlider";
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
  const item = publications.find((p) => p.slug === slug);
  if (!item) notFound();
  const photos = item.photos?.length
    ? item.photos
    : [{ src: item.image, alt: item.title }];
  return (
    <article className="school-section pb-20 pt-10 sm:pt-14">
      <div className="container-width max-w-5xl">
        <Link
          href="/publikasi"
          className="text-sm text-muted hover:text-primary"
        >
          ← Kembali ke galeri
        </Link>
        <header className="mb-10 mt-8 max-w-3xl">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {item.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-muted">
            {item.activityDate && (
              <time dateTime={item.activityDate}>
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "long",
                  timeZone: "UTC",
                }).format(new Date(`${item.activityDate}T00:00:00Z`))}
              </time>
            )}
            {item.authorName && (
              <span>
                Ditulis oleh{" "}
                <span className="font-medium text-ink">{item.authorName}</span>
              </span>
            )}
          </div>
        </header>
        <ActivitySlider photos={photos} />
        <div className="mx-auto mt-10 max-w-2xl sm:mt-14">
          {(item.article?.length ? item.article : [item.excerpt]).map(
            (paragraph, index) => (
              <p
                key={index}
                className="mb-6 whitespace-pre-line text-sm leading-8 text-muted sm:text-base"
              >
                {paragraph}
              </p>
            ),
          )}
          <Link
            href="/publikasi"
            className="mt-6 inline-flex rounded-full border border-blue-100 px-5 py-3 text-sm font-medium text-primary hover:bg-blue-50"
          >
            Jelajahi kegiatan lainnya ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
