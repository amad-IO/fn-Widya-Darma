import PageHeader from "@/components/shared/PageHeader";
import GalleryGrid from "@/components/shared/GalleryGrid";
export const revalidate = 3600;
export default function GaleriPage() {
  return (
    <>
      <PageHeader title="Lorem ipsum, sit amet" label="Lorem / Dolor" />
      <section className="panel -mt-12 bg-white">
        <div className="container-width">
          <GalleryGrid />
        </div>
      </section>
    </>
  );
}
