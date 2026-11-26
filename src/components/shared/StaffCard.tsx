import Image from "next/image";
import type { Staff } from "@/lib/school";

export default function StaffCard({
  person,
  teacher = false,
}: {
  person: Staff;
  teacher?: boolean;
}) {
  const roleLabel =
    teacher && !person.role.toLowerCase().startsWith("guru")
      ? `Guru · ${person.role}`
      : person.role;

  return (
    <article className="group relative mx-auto flex h-full w-full max-w-[190px] flex-col px-3 pb-3.5 text-left">
      {/* Card putih di bagian bawah (pedestal) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%] rounded-[24px] border border-slate-200/85 bg-white shadow-[0_12px_28px_-16px_rgba(32,44,69,0.22)]"
      />

      {/* Foto Signature Leaf yang menonjol ke atas */}
      <div className="relative z-10 aspect-[4/4.5] w-full overflow-hidden rounded-[24px_0_24px_0] bg-gradient-to-tr from-blue-100 to-blue-50 shadow-[0_10px_24px_-14px_rgba(32,44,69,0.28)] ring-1 ring-slate-900/5 transition-transform duration-300 ease-out group-hover:scale-[1.04]">
        <Image
          src={person.image}
          alt={`${person.name} — ${roleLabel}`}
          fill
          sizes="(max-width: 640px) 42vw, 190px"
          unoptimized={person.image.startsWith("/api/media?")}
          className="object-cover object-top"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-950/15 via-transparent to-transparent"
        />
      </div>

      {/* Informasi nama & jabatan di dalam area card putih */}
      <div className="relative z-10 mt-3 border-l-2 border-primary pl-2.5">
        <h3 className="text-[13px] font-bold leading-snug tracking-tight text-ink sm:text-sm">
          {person.name}
        </h3>
        <p className="mt-0.5 text-[11px] font-medium leading-snug text-primary">
          {roleLabel}
        </p>
      </div>
    </article>
  );
}
