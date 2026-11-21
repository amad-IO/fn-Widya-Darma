import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend-proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const resource = path.join("/");
  if (!/^(galleries|news(?:\/[a-zA-Z0-9_-]+)?)$/.test(resource)) {
    return NextResponse.json(
      { message: "Endpoint tidak tersedia." },
      { status: 404 },
    );
  }
  try {
    const response = await fetch(
      backendUrl(`/${resource}${request.nextUrl.search}`),
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Backend tidak dapat dihubungi." },
      { status: 503 },
    );
  }
}
