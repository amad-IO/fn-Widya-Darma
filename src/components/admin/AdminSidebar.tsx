"use client";

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
    <aside className="relative flex h-full flex-col py-10 text-white">
      {mobile && (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => onClose()}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <AdminIcon name="close" className="h-4 w-4" />
        </button>
      )}

      <div className="h-16 shrink-0" aria-hidden="true" />

      <nav
        aria-label={mobile ? "Menu admin ponsel" : "Menu admin"}
        className="space-y-1.5"
      >
        {adminNavigation.map((item) => {
          const isActive = section === item.id;
          const count =
            item.id === "galeri"
              ? galleryCount
              : item.id === "guru"
                ? teachersCount
                : 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 py-3 pr-4 text-left text-sm font-medium transition duration-150",
                isActive
                  ? "ml-6 w-[calc(100%-1.5rem)] rounded-l-[1.85rem] bg-slate-50 py-3 pl-7 text-[#31529a] font-semibold shadow-[0_1px_0_rgba(255,255,255,0.4)]"
                  : "w-full pl-12 text-white/85 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center transition",
                  isActive
                    ? "text-[#31529a]"
                    : "text-white/85 group-hover:text-white",
                )}
              >
                <AdminIcon name={item.icon} className="h-4 w-4" />
              </span>

              <span className="truncate">{item.label}</span>

              {count > 0 && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
                    isActive
                      ? "bg-[#31529a]/10 text-[#31529a]"
                      : "bg-white/15 text-white/85 group-hover:bg-white/20 group-hover:text-white",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
