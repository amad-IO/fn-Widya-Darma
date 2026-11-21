import Link from "next/link";
import { notFound } from "next/navigation";
import { backendUrl } from "@/lib/backend-proxy";
import { newsToPublication } from "@/lib/gallery-public";
import type { NewsRecord } from "@/lib/gallery-api";
import ActivitySlider from "@/components/shared/ActivitySlider";
export const dynamic = "force-dynamic";
export default async function PublicationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let record: NewsRecord | null = null;
  let missing = false;
  try {
    const response = await fetch(
      backendUrl(`/news/${encodeURIComponent(slug)}`),
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
    missing = response.status === 404;
    if (response.ok) record = (await response.json()).data;
  } catch {
    /* The public page remains readable when the backend is unavailable. */
  }
  if (missing) notFound();
  if (!record)
    return (
      <section className="container-width py-24">
        <h1 className="text-2xl font-semibold">Publikasi belum dapat dimuat</h1>
        <p className="mt-3 text-muted">
          Silakan coba kembali beberapa saat lagi.
        </p>
        <Link href="/publikasi" className="mt-6 inline-block text-primary">
          Kembali ke galeri
        </Link>
      </section>
    );
  const item = newsToPublication(record);
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
                {/^\d{4}-\d{2}-\d{2}$/.test(item.activityDate)
                  ? new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "long",
                      timeZone: "UTC",
                    }).format(new Date(`${item.activityDate}T00:00:00Z`))
                  : item.activityDate}
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
