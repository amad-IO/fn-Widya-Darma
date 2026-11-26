import { getAdminSession } from "@/lib/admin-auth";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type DashboardStats = {
  news: { total: number; published: number; draft: number };
  programs: { total: number };
  extracurriculars: { total: number };
  galleries: { total: number };
  knowledge_base: { total: number; active: number };
  spmb: { is_active: boolean; active_academic_year: string | null };
  website_traffic: { total_page_views: number };
};

async function readResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    return (await response.json()) as ApiResponse<T>;
  } catch {
    return { success: false, message: "Respons server tidak dapat diproses." };
  }
}

/** Request admin melalui proxy Next.js agar token dan alamat backend tidak tersebar di komponen. */
export async function adminApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const session = getAdminSession();
  if (!session) {
    throw new Error("Sesi admin berakhir. Silakan masuk kembali.");
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `${session.tokenType} ${session.token}`);

  const response = await fetch(`/api/admin${path}`, {
    ...init,
    headers,
  });
  const payload = await readResponse<T>(response);

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Permintaan ke server gagal.");
  }

  return payload.data as T;
}
