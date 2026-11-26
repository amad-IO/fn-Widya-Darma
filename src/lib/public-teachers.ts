import { backendUrl } from "@/lib/backend-proxy";
import type { Staff } from "@/lib/school";

type PublicTeacherRecord = {
  teacher_id: number;
  name: string;
  code?: string | null;
  role?: string | null;
  subject?: string | null;
  education?: string[] | null;
  bio?: string | null;
  image?: string | null;
  status?: string | null;
};

function imageUrl(image?: string | null) {
  if (!image) return "/images/staff-placeholder.svg";
  if (image.startsWith("/storage/")) {
    return `/api/media?path=${encodeURIComponent(image)}`;
  }
  return image;
}

/** Data direktori guru publik dari API, tanpa fallback data contoh. */
export async function getPublicTeachers(): Promise<Staff[]> {
  try {
    const response = await fetch(backendUrl("/teachers"), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as {
      success?: boolean;
      data?: PublicTeacherRecord[];
    };
    if (!payload.success || !Array.isArray(payload.data)) return [];

    return payload.data.map((teacher) => ({
      id: String(teacher.teacher_id),
      code: teacher.code || undefined,
      name: teacher.name,
      role: teacher.role || "Guru",
      badge: teacher.status || "Guru",
      department: teacher.subject || "Mata pelajaran belum dicantumkan.",
      alumni: teacher.education?.[0],
      experience: teacher.bio || undefined,
      image: imageUrl(teacher.image),
    }));
  } catch {
    return [];
  }
}
