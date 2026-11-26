import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backend-proxy";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  if (!/^\/storage\/[a-zA-Z0-9/_-]+\.webp$/.test(path))
    return new NextResponse("Path gambar tidak valid.", { status: 400 });
  try {
    const response = await fetch(new URL(path, backendUrl("")), {
      cache: "no-store",
    });
    if (!response.ok)
      return new NextResponse(
        "Foto belum dapat diakses dari penyimpanan backend.",
        { status: response.status },
      );
    const contentType = response.headers.get("content-type") || "";
    if (!/^image\/(webp|jpeg|png|gif)$/i.test(contentType)) {
      return new NextResponse(
        "Backend tidak mengembalikan berkas gambar yang valid.",
        { status: 502 },
      );
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    return new NextResponse(bytes, {
      headers: { "Content-Type": contentType, "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse(
      "Penyimpanan gambar backend tidak dapat dihubungi.",
      { status: 503 },
    );
  }
}
