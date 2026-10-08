import PageHeader from "@/components/shared/PageHeader";
import ArticleList from "@/components/shared/ArticleList";
export const revalidate = 1800;
export default function KegiatanPage() {
  return (
    <>
      <PageHeader title="Lorem ipsum, dolor" label="Dolor / Sit amet" />
      <section className="panel -mt-12 bg-white">
        <div className="container-width">
          <ArticleList base="/kegiatan" />
        </div>
      </section>
    </>
  );
}
