import type { LoginValues } from "@/lib/login";

const SESSION_STORAGE_KEY = "widya-darma-admin-session";

type AdminProfile = {
  admin_id?: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    token_type?: string;
    expires_at?: string;
    admin?: AdminProfile;
  };
};

export type AdminSession = {
  token: string;
  tokenType: string;
  expiresAt: string;
  admin: AdminProfile;
};

function apiUrl(path: string) {
  return `/api${path}`;
}

function saveSession(session: AdminSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getAdminSession(): AdminSession | null {
  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as AdminSession;
    if (!session.token || !session.expiresAt || new Date(session.expiresAt) <= new Date()) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    clearAdminSession();
    return null;
  }
}

async function responseJson(response: Response): Promise<LoginResponse> {
  try {
    return (await response.json()) as LoginResponse;
  } catch {
    return { success: false, message: "Respons server tidak dapat diproses." };
  }
}

export async function loginAdmin(values: LoginValues) {
  let response: Response;
  try {
    response = await fetch(apiUrl("/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(values),
    });
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke server. Pastikan backend Laravel sedang berjalan.",
    );
  }

  const payload = await responseJson(response);
  if (!response.ok || !payload.success || !payload.data?.token) {
    throw new Error(payload.message || "Login gagal. Silakan coba lagi.");
  }

  const session: AdminSession = {
    token: payload.data.token,
    tokenType: payload.data.token_type || "Bearer",
    expiresAt:
      payload.data.expires_at ||
      new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    admin: payload.data.admin || {},
  };
  saveSession(session);
  return session;
}

export async function validateAdminSession() {
  const session = getAdminSession();
  if (!session) return false;

  try {
    const response = await fetch(apiUrl("/admin/me"), {
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.token}`,
      },
    });
    if (!response.ok) clearAdminSession();
    return response.ok;
  } catch {
    return false;
  }
}

export async function logoutAdmin() {
  const session = getAdminSession();
  if (!session) return;

  try {
    await fetch(apiUrl("/admin/logout"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.token}`,
      },
    });
  } finally {
    clearAdminSession();
  }
}
