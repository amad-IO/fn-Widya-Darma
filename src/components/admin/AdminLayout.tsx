"use client";

import type { ReactNode, RefObject } from "react";
import type { AdminSection } from "@/lib/admin-preview";
import { adminTheme } from "@/lib/admin-theme";
import AdminIcon from "./AdminIcon";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  section: AdminSection;
  galleryCount: number;
  teachersCount: number;
  notice: string;
  mobileDialogRef: RefObject<HTMLDialogElement | null>;
  onNavigate: (section: AdminSection) => void;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
  onClearNotice: () => void;
}

export default function AdminLayout({
  children,
  section,
  galleryCount,
  teachersCount,
  notice,
  mobileDialogRef,
  onNavigate,
  onOpenMobileMenu,
  onCloseMobileMenu,
  onClearNotice,
}: AdminLayoutProps) {
  return (
    <div className={adminTheme.classNames.shell}>
      <aside
        className={adminTheme.classNames.desktopSidebar}
        style={{ backgroundColor: adminTheme.colors.sidebar }}
      >
        <AdminSidebar
          section={section}
          galleryCount={galleryCount}
          teachersCount={teachersCount}
          onNavigate={onNavigate}
          onClose={onCloseMobileMenu}
        />
      </aside>

      <dialog
        ref={mobileDialogRef}
        aria-label="Navigasi dashboard"
        onClose={onCloseMobileMenu}
        className={adminTheme.classNames.mobileSidebar}
        style={{ backgroundColor: adminTheme.colors.sidebar }}
      >
        <AdminSidebar
          mobile
          section={section}
          galleryCount={galleryCount}
          teachersCount={teachersCount}
          onNavigate={onNavigate}
          onClose={onCloseMobileMenu}
        />
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className={adminTheme.classNames.pageContent}>
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Buka navigasi"
          >
            <AdminIcon name="menu" className="h-4 w-4" />
          </button>

          {notice && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-xs font-semibold text-emerald-800 shadow-2xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-[10px] text-emerald-800">
                  ✓
                </span>
                <span>{notice}</span>
              </div>
              <button
                type="button"
                onClick={onClearNotice}
                className="rounded px-2 py-0.5 text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-900"
                aria-label="Tutup notifikasi"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-col items-center justify-center pb-1 pt-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-white text-primary shadow-sm">
              <AdminIcon name="school" className="h-7 w-7" />
            </div>
            <p className="mt-2 text-sm font-bold tracking-[0.18em] text-primary">
              SMA WIDYA DARMA
            </p>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
