import PageHeader from "@/components/shared/PageHeader";
import SectionLabel from "@/components/shared/SectionLabel";
import StaffCard from "@/components/shared/StaffCard";
import { leadership } from "@/lib/school";
import { copy } from "@/lib/constants";
import Link from "next/link";
export const metadata = { title: "Struktur organisasi sekolah" };
export default function OrganizationPage() {
  return (
    <>
      <PageHeader
        title="Lorem ipsum dolor"
        label="Struktur organisasi sekolah"
      />
      <section className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="01">
            Bagan organisasi · Kepala sekolah dan wakil kepala sekolah
          </SectionLabel>
          <p className="body-copy mb-12 max-w-xl">{copy.body}</p>
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-xs">
              <StaffCard person={leadership[0]} />
            </div>
            <div className="mx-auto h-10 w-px bg-blue-200" aria-hidden="true" />
            <div className="relative grid gap-6 border-l border-blue-200 pl-6 md:grid-cols-3 md:border-l-0 md:border-t md:pl-0 md:pt-10">
              {leadership.slice(1).map((person) => (
                <div
                  key={person.id}
                  className="relative md:before:absolute md:before:-top-10 md:before:left-1/2 md:before:h-10 md:before:w-px md:before:bg-blue-200"
                >
                  <StaffCard person={person} />
                </div>
              ))}
            </div>
            <div className="mx-auto h-10 w-px bg-blue-200" aria-hidden="true" />
            <div className="mx-auto max-w-sm rounded-2xl border border-blue-100 bg-white p-6 text-center">
              <p className="text-xs font-semibold text-primary">
                Guru & tenaga kependidikan
              </p>
              <p className="mt-3 text-sm text-muted">{copy.short}</p>
              <Link
                href="/guru"
                className="mt-5 inline-block text-xs font-semibold text-primary hover:underline"
              >
                Lihat profil guru
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
