import type { NextRequest } from "next/server";
import { proxyAdminRequest } from "@/lib/backend-proxy";

export async function POST(request: NextRequest) {
  return proxyAdminRequest(request, "/admin/login");
}
