import { NextRequest, NextResponse } from "next/server";

function backendUrl(path: string) {
  const baseUrl = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api"
  ).replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

export async function proxyAdminRequest(
  request: NextRequest,
  path: string,
) {
  const headers = new Headers({ Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");

  if (contentType) headers.set("Content-Type", contentType);
  if (authorization) headers.set("Authorization", authorization);

  try {
    const response = await fetch(backendUrl(path), {
      method: request.method,
      headers,
      body: request.method === "GET" ? undefined : await request.text(),
      cache: "no-store",
    });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Server backend tidak dapat dihubungi." },
      { status: 503 },
    );
  }
}
