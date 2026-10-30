import PageHeader from "@/components/shared/PageHeader";
import StaffCard from "@/components/shared/StaffCard";
import Reveal from "@/components/shared/Reveal";
import { leadership, teachers } from "@/lib/school";
export const metadata = { title: "Profil guru" };
export default function TeachersPage() {
  return (
    <>
      <PageHeader title="Lorem ipsum, consectetur" label="Profil guru" />
      <section className="school-section py-16 sm:py-24">
        <div className="container-width">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            <Reveal>
              <StaffCard person={leadership[0]} />
            </Reveal>
            {teachers.map((person, index) => (
              <Reveal key={person.id} delay={((index + 1) % 4) * 0.06}>
                <StaffCard person={person} teacher />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
