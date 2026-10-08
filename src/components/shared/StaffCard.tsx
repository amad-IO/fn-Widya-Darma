import Image from "next/image";
import type { Staff } from "@/lib/school";

export default function StaffCard({
  person,
  teacher = false,
}: {
  person: Staff;
  teacher?: boolean;
}) {
  return (
    <article className="rounded-3xl border border-white bg-white/80 p-5 text-center shadow-sm shadow-blue-950/5">
      <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-blue-50">
        <Image
          src={person.image}
          alt={`Foto contoh ${teacher ? "guru" : person.role.toLowerCase()}`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <p className="mt-5 text-[10px] font-semibold uppercase tracking-wider text-primary">
        {teacher ? "Guru · Mata pelajaran" : person.role}
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">
        {person.name}
      </h3>
      <p className="mt-2 text-xs leading-6 text-muted">
        {teacher ? person.role : "Lorem ipsum dolor sit amet."}
      </p>
    </article>
  );
}
