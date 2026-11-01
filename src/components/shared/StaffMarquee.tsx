import StaffCard from "@/components/shared/StaffCard";
import { leadership, teachers, type Staff } from "@/lib/school";

interface StaffMarqueeProps {
  items?: { person: Staff; teacher: boolean }[];
  speedSeconds?: number;
  wideGap?: boolean;
  className?: string;
}

export default function StaffMarquee({
  items,
  speedSeconds = 55,
  wideGap = false,
  className = "",
}: StaffMarqueeProps) {
  const staffList =
    items ?? [
      { person: leadership[0], teacher: false },
      ...teachers.map((person) => ({ person, teacher: true })),
    ];

  // Ulangi 3 kali per track group agar layar ultra-wide (e.g. 4K, 3840px)
  // terisi penuh tanpa celah kosong saat animasi berjalan.
  const repetitions = [0, 1, 2];

  const gapClass = wideGap
    ? "gap-7 sm:gap-10 lg:gap-12 pr-7 sm:pr-10 lg:pr-12"
    : "gap-5 sm:gap-7 pr-5 sm:pr-7";

  return (
    <div
      className={`relative w-full overflow-hidden py-4 select-none [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] ${className}`}
      aria-label="Daftar guru dan karyawan"
    >
      <div
        className="staff-marquee-track hover:[animation-play-state:paused] active:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {/* Set 1 */}
        <div className={`flex shrink-0 items-stretch ${gapClass}`}>
          {repetitions.flatMap((rep) =>
            staffList.map((item, idx) => (
              <div
                key={`track1-${rep}-${item.person.id}-${idx}`}
                className="w-[170px] sm:w-[190px] shrink-0"
                aria-hidden={rep > 0}
              >
                <StaffCard person={item.person} teacher={item.teacher} />
              </div>
            ))
          )}
        </div>

        {/* Set 2 (duplikasi identik untuk infinite seamless loop) */}
        <div
          className={`flex shrink-0 items-stretch ${gapClass}`}
          aria-hidden="true"
        >
          {repetitions.flatMap((rep) =>
            staffList.map((item, idx) => (
              <div
                key={`track2-${rep}-${item.person.id}-${idx}`}
                className="w-[170px] sm:w-[190px] shrink-0"
              >
                <StaffCard person={item.person} teacher={item.teacher} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
