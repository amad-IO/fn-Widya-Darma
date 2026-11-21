import type { NewsRecord } from "@/lib/gallery-api";
import { mediaUrl } from "@/lib/gallery-api";
import {
  publicationCategories,
  type Publication,
  type PublicationCategory,
} from "@/lib/school";

export function newsToPublication(record: NewsRecord): Publication {
  const photos = (record.galleries || []).map((photo) => ({
    src: mediaUrl(photo.image_url),
    alt: photo.caption || record.title,
  }));
  return {
    slug: record.slug,
    title: record.title,
    category: publicationCategories.includes(
      record.category as PublicationCategory,
    )
      ? (record.category as PublicationCategory)
      : "Galeri Kegiatan",
    excerpt: record.content,
    article: record.content.split(/\n\s*\n/),
    image: mediaUrl(
      record.image_url || record.galleries?.[0]?.image_url || "/images/32.webp",
    ),
    photos,
    authorName: record.author_name,
    activityDate: record.activity_date,
  };
}
