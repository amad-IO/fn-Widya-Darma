import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  publicationCategories,
  type AdminSection,
  type PublicationCategory,
  type PreviewPublication,
} from "@/lib/admin-preview";
import AdminIcon from "./AdminIcon";
import StatusBadge from "./AdminStatusBadge";

const panel = "rounded-2xl border border-slate-200/80 bg-white";

export default function AdminPublications({
  full = false,
  category,
  query,
  filtered,
  total,
  onNavigate,
  onCategory,
  onQuery,
  onEdit,
}: {
  full?: boolean;
  category: PublicationCategory | "Semua";
  query: string;
  filtered: PreviewPublication[];
  total: number;
  onNavigate: (section: AdminSection) => void;
  onCategory: (category: PublicationCategory | "Semua") => void;
  onQuery: (query: string) => void;
  onEdit: (item: PreviewPublication) => void;
}) {
  return (
    <section
      aria-labelledby="publication-heading"
      className={cn(panel, "min-w-0 overflow-hidden")}
    >
      <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-6">
        <div>
          <h2
            id="publication-heading"
            className="text-sm font-semibold text-slate-900"
          >
            {full ? "Daftar publikasi" : "Publikasi terbaru"}
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Berita, jurnal, karya, dan kegiatan sekolah
          </p>
        </div>
        {!full && (
          <button
            type="button"
            onClick={() => onNavigate("publikasi")}
            className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-primary hover:text-primary-dark"
          >
            Lihat semua
            <AdminIcon name="arrow" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 pb-4 sm:px-6">
        <div
          className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-50 p-1"
          role="group"
          aria-label="Filter kategori publikasi"
        >
          {(
            [
              "Semua",
              ...(full ? publicationCategories : ["Berita", "Jurnal", "Karya"]),
            ] as (PublicationCategory | "Semua")[]
          ).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => onCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-[11px] transition",
                category === item
                  ? "bg-white font-semibold text-primary shadow-sm"
                  : "text-slate-500 hover:text-primary",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:w-40">
          <span className="sr-only">Cari publikasi</span>
          <AdminIcon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Cari publikasi..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] outline-none transition focus:border-primary"
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[570px] border-collapse text-left">
          <caption className="sr-only">
            Publikasi dengan data contoh, kategori, status, dan tanggal
            pembaruan.
          </caption>
          <thead className="bg-slate-50/70 text-[10px] font-medium uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Judul publikasi
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Diperbarui
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item.id} className="transition hover:bg-blue-50/40">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-[12px] font-medium text-slate-800">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <StatusBadge status={item.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-[11px] text-slate-500">
                  {item.date}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    aria-label={`Edit ${item.title}`}
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-primary"
                  >
                    <AdminIcon name="edit" className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-xs text-slate-500"
                >
                  Tidak ada publikasi yang sesuai. Coba kata kunci atau kategori
                  lain.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 text-[10px] text-slate-400">
        <span>
          Menampilkan {filtered.length} dari {total} publikasi
        </span>
        <span>Data contoh</span>
      </div>
    </section>
  );
}
