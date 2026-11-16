import Link from "next/link";
import { Ticket } from "@/components/shared/Svg";
import { cn } from "@/lib/utils";
import { adminNavigation, type AdminSection } from "@/lib/admin-preview";
import AdminIcon from "./AdminIcon";

export default function AdminSidebar({
  mobile = false,
  section,
  galleryCount = 0,
  teachersCount = 0,
  onNavigate,
  onClose,
}: {
  mobile?: boolean;
  section: AdminSection;
  galleryCount?: number;
  teachersCount?: number;
  onNavigate: (section: AdminSection) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full flex-col px-5 py-7 text-white">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold leading-5">
            SMA Widya Darma
            <span className="block text-[11px] font-normal tracking-wide text-blue-200/65">
              ADMINISTRATOR
            </span>
          </span>
        </Link>
        {mobile && (
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => onClose()}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <AdminIcon name="close" />
          </button>
        )}
      </div>
      <div className="mt-10 px-3 text-[10px] font-semibold tracking-[0.18em] text-blue-200/45">
        RUANG KERJA
      </div>
      <nav
        aria-label={mobile ? "Menu admin ponsel" : "Menu admin"}
        className="mt-3 space-y-1.5"
      >
        {adminNavigation.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={section === item.id ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs transition duration-200",
              section === item.id
                ? "bg-primary font-semibold text-white shadow-lg shadow-black/5"
                : "text-blue-100/65 hover:bg-white/7 hover:text-white",
            )}
          >
            <AdminIcon name={item.icon} className="h-[18px] w-[18px]" />
            {item.label}
            {item.id === "galeri" && galleryCount > 0 && (
              <span
                className={cn(
                  "ml-auto rounded-md px-1.5 py-0.5 text-[10px]",
                  section === item.id ? "bg-white/15" : "bg-white/7",
                )}
              >
                {galleryCount}
              </span>
            )}
            {item.id === "guru" && teachersCount > 0 && (
              <span
                className={cn(
                  "ml-auto rounded-md px-1.5 py-0.5 text-[10px]",
                  section === item.id ? "bg-white/15" : "bg-white/7",
                )}
              >
                {teachersCount}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-10">
        <div className="rounded-xl border border-blue-300/10 bg-white/5 p-4">
          <p className="text-xs font-medium">Ruang informasi sekolah</p>
          <p className="mt-2 text-[11px] leading-5 text-blue-100/50">
            Konten untuk siswa, orang tua, dan masyarakat.
          </p>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium text-blue-200 transition hover:text-white"
          >
            Kunjungi website
            <AdminIcon name="external" className="h-3 w-3" />
          </Link>
        </div>
        <Link
          href="/admin/login"
          className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-xs text-blue-100/65 transition hover:bg-white/7 hover:text-white"
        >
          <AdminIcon name="logout" className="h-[18px] w-[18px]" />
          Kembali ke login
        </Link>
      </div>
    </div>
  );
}
