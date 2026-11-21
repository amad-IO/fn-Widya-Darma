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
    const bytes = new Uint8Array(await response.arrayBuffer());
    const text = new TextDecoder("ascii");
    if (
      text.decode(bytes.slice(0, 4)) !== "RIFF" ||
      text.decode(bytes.slice(8, 12)) !== "WEBP"
    ) {
      return new NextResponse(
        "Backend belum menghasilkan file WebP yang valid. Periksa dukungan GD/WebP pada PHP backend.",
        { status: 502 },
      );
    }
    return new NextResponse(bytes, {
      headers: { "Content-Type": "image/webp", "Cache-Control": "no-store" },
    });
  } catch {
    return new NextResponse(
      "Penyimpanan gambar backend tidak dapat dihubungi.",
      { status: 503 },
    );
  }
}
