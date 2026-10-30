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
    <article className="group relative mx-auto aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-2xl bg-blue-100 shadow-sm shadow-blue-950/10">
      <Image
        src={person.image}
        alt={`${person.name} — ${roleLabel}`}
        fill
        sizes="(max-width: 640px) 45vw, 200px"
        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-3.5 text-left text-white sm:p-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-sky-300 sm:text-[10px]">
          {roleLabel}
        </p>
        <h3 className="mt-1 text-sm font-semibold leading-snug tracking-tight text-white sm:text-base">
          {person.name}
        </h3>
      </div>
    </article>
  );
}
