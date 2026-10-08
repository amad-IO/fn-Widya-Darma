import PageHeader from "@/components/shared/PageHeader";
import SectionLabel from "@/components/shared/SectionLabel";
import Accordion from "@/components/shared/Accordion";
import Reveal from "@/components/shared/Reveal";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { copy } from "@/lib/constants";
export const revalidate = 3600;
export const metadata = { title: "Informasi SPMB" };
export default function SpmbPage() {
  return (
    <>
      <PageHeader
        title="Lorem ipsum, dolor"
        label="Informasi SPMB · Penerimaan siswa baru"
      />
      <section className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="01">Jadwal & persyaratan SPMB</SectionLabel>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Jadwal penerimaan",
              "Persyaratan calon siswa",
              "Dokumen pendaftaran",
            ].map((label, index) => (
              <Reveal
                key={label}
                className="rounded-3xl border border-white bg-white/75 p-7"
              >
                <p className="text-sm text-primary/40">0{index + 1}</p>
                <h2 className="mt-5 text-sm font-semibold text-primary">
                  {label}
                </h2>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  Lorem ipsum dolor.
                </h3>
                <p className="body-copy mt-4">{copy.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="school-section bg-white/55 py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="02">Alur pendaftaran</SectionLabel>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Informasi awal",
              "Persiapan dokumen",
              "Konfirmasi ke sekolah",
            ].map((label, index) => (
              <div key={label} className="border-t border-blue-100 pt-6">
                <p className="text-4xl font-semibold text-primary/25">
                  0{index + 1}
                </p>
                <h2 className="mt-5 text-sm font-semibold">{label}</h2>
                <p className="body-copy mt-3">{copy.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="school-section py-16 sm:py-24">
        <div className="container-width grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionLabel number="03">Pertanyaan tentang SPMB</SectionLabel>
            <h2 className="school-heading">
              Lorem ipsum
              <br />
              dolor sit amet?
            </h2>
            <div className="mt-8">
              <WhatsAppButton />
            </div>
          </div>
          <Accordion />
        </div>
      </section>
    </>
  );
}
