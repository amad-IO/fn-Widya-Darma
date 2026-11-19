"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminNavigation, type AdminSection } from "@/lib/admin-preview";
import AdminIcon from "./AdminIcon";
import { logoutAdmin } from "@/lib/admin-auth";

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
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const router = useRouter();

  async function confirmLogout() {
    await logoutAdmin();
    onClose();
    router.replace("/admin/login");
  }

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
                  ? "ml-6 w-[calc(100%-1.5rem)] rounded-l-[1.85rem] bg-slate-50 py-3 pl-7 text-primary font-semibold shadow-[0_1px_0_rgba(255,255,255,0.4)]"
                  : "w-full pl-12 text-white/85 hover:bg-white/10 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center transition",
                  isActive
                    ? "text-primary"
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
                      ? "bg-primary/10 text-primary"
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

      <div className="mt-auto px-5 pt-8">
        <button
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          <AdminIcon name="logout" className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      {isLogoutOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-800 shadow-2xl"
          >
            <h2 id="logout-dialog-title" className="text-base font-bold">
              Keluar dari Admin?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Anda yakin ingin logout dari halaman administrasi?
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsLogoutOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
