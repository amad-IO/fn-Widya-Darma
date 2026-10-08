import PageHeader from "@/components/shared/PageHeader";
import SectionLabel from "@/components/shared/SectionLabel";
import StaffCard from "@/components/shared/StaffCard";
import Reveal from "@/components/shared/Reveal";
import { teachers } from "@/lib/school";
import { copy } from "@/lib/constants";
export const metadata = { title: "Profil guru" };
export default function TeachersPage() {
  return (
    <>
      <PageHeader title="Lorem ipsum, consectetur" label="Profil guru" />
      <section className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="01">
            Profil guru · Foto, nama, dan mata pelajaran
          </SectionLabel>
          <p className="body-copy mb-10 max-w-xl">{copy.body}</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((person, index) => (
              <Reveal key={person.id} delay={(index % 3) * 0.06}>
                <StaffCard person={person} teacher />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
