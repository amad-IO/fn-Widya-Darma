import { NextRequest, NextResponse } from "next/server";
import { proxyAdminRequest } from "@/lib/backend-proxy";

async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const resource = path.join("/");
  if (
    !/^(upload|dashboard\/stats|teachers(?:\/\d+)?|news(?:\/\d+)?|galleries(?:\/\d+)?)$/.test(
      resource,
    )
  ) {
    return NextResponse.json(
      { message: "Endpoint tidak tersedia." },
      { status: 404 },
    );
  }
  return proxyAdminRequest(
    request,
    `/admin/${resource}${request.nextUrl.search}`,
  );
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
