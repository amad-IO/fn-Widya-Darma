import GalleryGrid from "@/components/shared/GalleryGrid";
export const revalidate = 3600;
export default function GaleriPage() {
  return (
    <section className="school-section min-h-[75svh] bg-white pb-24 pt-28 sm:pb-32 sm:pt-36">
      <div className="container-width">
        <GalleryGrid />
      </div>
    </section>
  );
}
