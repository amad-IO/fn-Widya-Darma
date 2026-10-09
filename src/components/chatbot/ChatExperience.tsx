"use client";

import dynamic from "next/dynamic";

const SchoolChat = dynamic(() => import("./SchoolChat"), {
  ssr: false,
  loading: () => (
    <section
      aria-label="Memuat halaman Tanya AI"
      aria-busy="true"
      className="ai-workspace flex items-center justify-center"
    >
      <div role="status" className="flex items-center gap-3 text-sm text-muted">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        Menyiapkan ruang percakapan…
      </div>
    </section>
  ),
});

export default function ChatExperience() {
  return <SchoolChat />;
}
