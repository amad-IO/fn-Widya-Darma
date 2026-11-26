import { getAdminSession } from "@/lib/admin-auth";
import type { GalleryActivity } from "@/types/gallery";
import { normalizeGalleryCategory } from "@/lib/gallery-categories";

export type SaveStage =
  "idle" | "preparing" | "uploading" | "saving" | "success" | "error";
export const saveStageLabels: Record<SaveStage, string> = {
  idle: "Simpan",
  preparing: "Menyiapkan foto…",
  uploading: "Mengunggah dan mengompres…",
  saving: "Menyimpan…",
  success: "Berhasil disimpan",
  error: "Coba lagi",
};

export type GalleryRecord = {
  gallery_id: number;
  title: string;
  image_url: string;
  caption?: string;
  news_id?: number | null;
  is_cover?: boolean;
  collage_order?: number | null;
};
export type NewsRecord = {
  news_id: number;
  title: string;
  slug: string;
  author_name?: string;
  category: string;
  content: string;
  activity_date?: string;
  status?: string;
  created_at?: string;
  image_url?: string;
  galleries?: GalleryRecord[];
};

export function mediaUrl(value: string) {
  if (value.startsWith("/storage/"))
    return `/api/media?path=${encodeURIComponent(value)}`;
  if (/^https?:/.test(value)) {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith("/storage/"))
      return `/api/media?path=${encodeURIComponent(parsed.pathname)}`;
  }
  return value;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (authenticated) {
    const session = getAdminSession();
    if (!session)
      throw new Error("Sesi admin berakhir. Silakan login kembali.");
    headers.set("Authorization", `${session.tokenType} ${session.token}`);
  }
  let response: Response;
  try {
    response = await fetch(path, { ...init, headers, cache: "no-store" });
  } catch {
    throw new Error("Koneksi terputus. Periksa backend dan coba lagi.");
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    const details = payload?.errors
      ? Object.values(payload.errors).flat().join(" ")
      : "";
    throw new Error(
      details || payload?.message || `Permintaan gagal (${response.status}).`,
    );
  }
  return payload?.data as T;
}

const pendingLists = new Map<string, Promise<unknown[]>>();

export function fetchAll<T>(path: string, authenticated = true): Promise<T[]> {
  const identity = authenticated
    ? getAdminSession()?.token || "no-session"
    : "public";
  const key = `${path}\u0000${identity}`;
  const pending = pendingLists.get(key);
  if (pending) return pending as Promise<T[]>;
  const request = fetchAllPages<T>(path, authenticated);
  pendingLists.set(key, request);
  const cleanup = () => {
    if (pendingLists.get(key) === request) pendingLists.delete(key);
  };
  void request.then(cleanup, cleanup);
  return request;
}

async function fetchAllPages<T>(
  path: string,
  authenticated = true,
): Promise<T[]> {
  const result: T[] = [];
  for (let page = 1; page <= 100; page++) {
    const data = await apiRequest<{ data: T[]; last_page: number }>(
      `${path}${path.includes("?") ? "&" : "?"}per_page=50&page=${page}`,
      {},
      authenticated,
    );
    if (!data || !Array.isArray(data.data))
      throw new Error("Format daftar dari backend tidak valid.");
    result.push(...data.data);
    if (page >= data.last_page) return result;
  }
  throw new Error("Daftar terlalu panjang. Persempit data dari backend.");
}

export function fromNews(record: NewsRecord): GalleryActivity {
  const photos = (record.galleries || []).map((photo, index) => ({
    id: String(photo.gallery_id),
    url: mediaUrl(photo.image_url),
    caption: photo.caption || "",
    order: index + 1,
  }));
  if (!photos.length && record.image_url)
    photos.push({
      id: `cover-${record.news_id}`,
      url: mediaUrl(record.image_url),
      caption: record.title,
      order: 1,
    });
  const cover = record.galleries?.find((photo) => photo.is_cover);
  return {
    id: String(record.news_id),
    backendId: record.news_id,
    title: record.title,
    slug: record.slug,
    authorName: record.author_name || "",
    category: normalizeGalleryCategory(record.category),
    content: record.content,
    date: record.activity_date || "",
    photos,
    coverPhotoId: cover ? String(cover.gallery_id) : photos[0]?.id || "",
    cropConfig: { zoom: 1, x: 0, y: 0 },
    status: ["Draf", "draft"].includes(record.status || "") ? "Draf" : "Terbit",
    createdAt: record.created_at,
  };
}

export async function uploadPhoto(
  blob: Blob,
  folder = "gallery",
): Promise<string> {
  if (blob.size > 5 * 1024 * 1024)
    throw new Error(
      "Foto hasil crop melebihi 5 MB. Pilih foto yang lebih kecil.",
    );
  const form = new FormData();
  form.set("folder", folder);
  form.set("file", blob, "foto.png");
  const result = await apiRequest<{ path: string }>("/api/admin/upload", {
    method: "POST",
    body: form,
  });
  if (!result?.path?.startsWith("/storage/"))
    throw new Error("Backend tidak mengembalikan alamat foto yang valid.");
  const check = await fetch(mediaUrl(result.path), { cache: "no-store" });
  if (!check.ok) throw new Error(await check.text());
  return result.path;
}

export async function saveNews(
  activity: GalleryActivity,
  onStage: (stage: SaveStage) => void,
): Promise<GalleryActivity> {
  onStage("preparing");
  const cover =
    activity.photos.find((photo) => photo.id === activity.coverPhotoId) ||
    activity.photos[0];
  const ordered = cover
    ? [cover, ...activity.photos.filter((photo) => photo.id !== cover.id)]
    : [];
  const photos: { url: string; caption: string; order: number }[] = [];
  for (const [index, photo] of ordered.entries()) {
    onStage("preparing");
    const response = await fetch(photo.url);
    if (!response.ok)
      throw new Error(
        "Salah satu foto tidak dapat dibaca. Pilih ulang foto tersebut.",
      );
    let blob = await response.blob();
    if (index === 0 || photo.cropConfig) {
      const { cropBlob } = await import("@/lib/image-crop");
      blob = await cropBlob(
        blob,
        photo.cropConfig || activity.cropConfig,
        16 / 10,
      );
    }
    onStage("uploading");
    photos.push({
      url: await uploadPhoto(blob),
      caption: photo.caption || "",
      order: index + 1,
    });
  }
  onStage("saving");
  const record = await apiRequest<NewsRecord>(
    `/api/admin/news${activity.backendId ? `/${activity.backendId}` : ""}`,
    {
      method: activity.backendId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: activity.title,
        slug: activity.slug,
        author_name: activity.authorName,
        category: activity.category,
        activity_date: activity.date,
        content: activity.content,
        status: activity.status,
        image_url: photos[0]?.url,
        crop_config: { zoom: 1, x: 0, y: 0 },
        photos,
      }),
    },
  );
  return fromNews(record);
}
