import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";
import SectionLabel from "@/components/shared/SectionLabel";
import StaffMarquee from "@/components/shared/StaffMarquee";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/constants";
import { leadership, teachers } from "@/lib/school";

const sectionClass = "school-section relative py-16 sm:py-24";

type StaffSectionProps = {
  showPrincipalWelcome?: boolean;
  showButton?: boolean;
  limit?: number;
  className?: string;
  id?: string;
};

export default function StaffSection({
  showPrincipalWelcome = false,
  showButton = false,
  limit,
  className = sectionClass,
  id,
}: StaffSectionProps) {
  const principal = leadership[0];
  const allItems = [
    { person: leadership[0], teacher: false },
    ...teachers.map((person) => ({ person, teacher: true })),
  ];
  const visibleItems = limit ? allItems.slice(0, limit) : allItems;

  return (
    <section
      className={className + " overflow-hidden"}
      id={id}
      aria-label="Profil guru dan tenaga pendidik"
    >
      <div className="container-width">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mx-auto inline-flex rounded-full border border-slate-300 bg-white/90 px-5 py-2 text-xs font-medium text-ink shadow-sm">
            Profil Guru
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.5rem]">
            Pendidik berdedikasi, membimbing
            <span className="block text-slate-400">generasi berprestasi</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Tenaga pendidik profesional dari keluarga SMA Widya Darma.
          </p>
        </Reveal>

        {showPrincipalWelcome && (
          <Reveal className="mx-auto mb-14 grid max-w-5xl items-center gap-8 sm:mb-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-12 lg:gap-16">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[50px_0_50px_0] border-2 border-white bg-blue-50 shadow-[0_16px_36px_-24px_rgba(32,44,69,0.35)]">
              <Image
                src={principal.image}
                alt="Foto kepala sekolah SMA Widya Darma"
                fill
                sizes="(max-width: 767px) min(320px, 90vw), 320px"
                className="object-cover object-top"
              />
            </div>

            <div>
              <SectionLabel>Sambutan Kepala Sekolah</SectionLabel>
              <h3 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Lorem ipsum dolor sit amet,
                <span className="text-primary"> consectetur adipiscing elit.</span>
              </h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
                <p>{copy.body}</p>
                <p>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
              </div>
              <div className="mt-6 border-t border-blue-100 pt-5">
                <p className="text-base font-semibold text-ink">{principal.name}</p>
                <p className="mt-1 text-xs text-muted">
                  Kepala Sekolah SMA Widya Darma
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <StaffMarquee
        items={visibleItems}
        wideGap={ Boolean(limit && limit <= 5) }
      />

      {showButton && (
        <div className="container-width">
          <Reveal className="mt-10 flex justify-center">
            <Button asChild className="rounded-full px-6">
              <Link href="/guru">Lihat semua guru</Link>
            </Button>
          </Reveal>
        </div>
      )}
    </section>
  );
}
