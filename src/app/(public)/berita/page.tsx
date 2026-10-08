import PageHeader from "@/components/shared/PageHeader";
import ArticleList from "@/components/shared/ArticleList";
export const revalidate = 600;
export default function BeritaPage() {
  return (
    <>
      <PageHeader title="Sed do eiusmod" label="Lorem / Consectetur" />
      <section className="panel -mt-12 bg-white">
        <div className="container-width">
          <ArticleList />
        </div>
      </section>
    </>
  );
}
