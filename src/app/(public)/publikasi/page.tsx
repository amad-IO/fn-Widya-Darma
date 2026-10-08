import PageHeader from "@/components/shared/PageHeader";
import SectionLabel from "@/components/shared/SectionLabel";
import PublicationGrid from "@/components/shared/PublicationGrid";
export const revalidate = 600;
export const metadata = { title: "Publikasi & galeri" };
export default function PublicationsPage() {
  return (
    <>
      <PageHeader
        title="Lorem ipsum dolor sit"
        label="Publikasi & galeri sekolah"
      />
      <section className="school-section py-16 sm:py-24">
        <div className="container-width">
          <SectionLabel number="01">
            Berita · Jurnal · Karya · Galeri prestasi · Ekstrakurikuler
          </SectionLabel>
          <PublicationGrid />
        </div>
      </section>
    </>
  );
}
