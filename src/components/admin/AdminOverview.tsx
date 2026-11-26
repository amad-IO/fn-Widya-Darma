import type { GalleryActivity } from "@/types/gallery";
import type { Teacher } from "@/types/teacher";
import type { AdminSection } from "@/lib/admin-preview";
import type { DashboardStats } from "@/lib/admin-api";
import AdminIcon from "./AdminIcon";
import AdminVisitorChart from "./AdminVisitorChart";

interface AdminOverviewProps {
  teachers: Teacher[];
  galleryActivities: GalleryActivity[];
  dashboardStats: DashboardStats | null;
  onNavigate: (section: AdminSection) => void;
}

export default function AdminOverview({
  teachers,
  galleryActivities,
  dashboardStats,
  onNavigate,
}: AdminOverviewProps) {
  const galleryTotal = dashboardStats?.galleries.total ?? galleryActivities.length;
  const activeAcademicYear = dashboardStats?.spmb.active_academic_year || "2026/2027";
  const isSpmbActive = dashboardStats?.spmb.is_active ?? true;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate("guru")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              Tenaga Pendidik
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-primary transition group-hover:bg-primary group-hover:text-white">
              <AdminIcon name="people" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
            {teachers.length}{" "}
            <span className="text-sm font-semibold text-slate-500">Guru</span>
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-semibold text-primary">
            <span>Kelola direktori guru</span>
            <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("galeri")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Galeri Kegiatan
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
              <AdminIcon name="gallery" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tabular-nums text-slate-900">
            {galleryTotal}{" "}
            <span className="text-sm font-semibold text-slate-500">
              Galeri
            </span>
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-semibold text-indigo-700">
            <span>Kelola dokumentasi</span>
            <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("spmb")}
          className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              SPMB {activeAcademicYear}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
              <AdminIcon name="calendar" className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-base font-bold text-slate-900">
            {isSpmbActive ? "Pendaftaran sedang dibuka" : "Pendaftaran belum dibuka"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {isSpmbActive
              ? "Periode aktif dari sistem pendaftaran"
              : "Belum ada periode pendaftaran aktif"}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-semibold text-emerald-700">
            <span>Kelola pendaftaran</span>
            <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </button>
      </div>

      <AdminVisitorChart stats={dashboardStats} />
    </div>
  );
}
