"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import AdminSidebar from "./AdminSidebar";
import AdminIcon, { type AdminIconName } from "./AdminIcon";
import AdminGalleryModal from "./AdminGalleryModal";
import AdminGalleryDetailModal from "./AdminGalleryDetailModal";
import AdminTeacherModal from "./AdminTeacherModal";
import AdminTeacherTable from "./AdminTeacherTable";
import AdminVisitorChart from "./AdminVisitorChart";
import AdminSpmbSection from "./AdminSpmbSection";
import TeacherDetailModal from "@/components/shared/TeacherDetailModal";
import { initialGalleryActivities } from "@/lib/gallery-data";
import { GalleryActivity } from "@/types/gallery";
import { Teacher } from "@/types/teacher";
import {
  initialTeachers,
  getStoredTeachers,
  saveStoredTeachers,
} from "@/lib/teacher-data";
import { cn } from "@/lib/utils";
import {
  adminNavigation,
  previewStaff,
  type AdminSection,
} from "@/lib/admin-preview";

const panel = "rounded-2xl border border-slate-200/80 bg-white";
const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  // Gallery Activities State
  const [galleryActivities, setGalleryActivities] = useState<GalleryActivity[]>(
    initialGalleryActivities
  );
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryActivity, setEditingGalleryActivity] =
    useState<GalleryActivity | null>(null);
  const [viewingGalleryActivity, setViewingGalleryActivity] =
    useState<GalleryActivity | null>(null);

  const mobileDialogRef = useRef<HTMLDialogElement>(null);

  const active = adminNavigation.find((item) => item.id === section)!;

  function navigate(next: AdminSection) {
    setSection(next);
    setQuery("");
    setNotice("");
    mobileDialogRef.current?.close();
    setMobileMenu(false);
  }

  // Gallery CRUD Operations
  const handleOpenAddGallery = () => {
    setEditingGalleryActivity(null);
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (act: GalleryActivity) => {
    setEditingGalleryActivity(act);
    setIsGalleryModalOpen(true);
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kegiatan galeri ini?")) {
      setGalleryActivities((prev) => prev.filter((a) => a.id !== id));
      setNotice("Kegiatan galeri berhasil dihapus.");
    }
  };

  const handleSaveGallery = (savedActivity: GalleryActivity) => {
    setGalleryActivities((prev) => {
      const exists = prev.some((a) => a.id === savedActivity.id);
      if (exists) {
        return prev.map((a) => (a.id === savedActivity.id ? savedActivity : a));
      }
      return [savedActivity, ...prev];
    });
    setNotice(
      editingGalleryActivity
        ? "Kegiatan galeri berhasil diperbarui."
        : "Kegiatan galeri baru berhasil dipublikasikan."
    );
  };

  // Filtered Gallery Activities
  const filteredGalleryActivities = galleryActivities.filter((act) => {
    const matchQuery =
      act.title.toLowerCase().includes(query.toLowerCase()) ||
      act.authorName.toLowerCase().includes(query.toLowerCase()) ||
      act.category.toLowerCase().includes(query.toLowerCase());
    return matchQuery;
  });

  // Teachers State
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    setTeachers(getStoredTeachers());

    const handleTeachersUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Teacher[]>;
      if (customEvent.detail) {
        setTeachers(customEvent.detail);
      } else {
        setTeachers(getStoredTeachers());
      }
    };

    window.addEventListener(
      "widya_darma_teachers_updated",
      handleTeachersUpdated
    );
    return () => {
      window.removeEventListener(
        "widya_darma_teachers_updated",
        handleTeachersUpdated
      );
    };
  }, []);

  // Teacher CRUD Operations
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setIsTeacherModalOpen(true);
  };

  const handleDeleteTeacher = (id: string) => {
    const target = teachers.find((t) => t.id === id);
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus data guru "${target?.name || "ini"}"?`
      )
    ) {
      const updated = teachers.filter((t) => t.id !== id);
      setTeachers(updated);
      saveStoredTeachers(updated);
      setNotice("Data guru berhasil dihapus.");
    }
  };

  const handleSaveTeacher = (savedTeacher: Teacher) => {
    const exists = teachers.some((t) => t.id === savedTeacher.id);
    let updated: Teacher[];
    if (exists) {
      updated = teachers.map((t) =>
        t.id === savedTeacher.id ? savedTeacher : t
      );
    } else {
      updated = [savedTeacher, ...teachers];
    }
    setTeachers(updated);
    saveStoredTeachers(updated);
    setNotice(
      editingTeacher
        ? `Data guru "${savedTeacher.name}" berhasil diperbarui.`
        : `Guru baru "${savedTeacher.name}" berhasil ditambahkan.`
    );
  };

  return (
    <div className="min-h-dvh bg-[#f5f7fb] text-slate-700 lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 overflow-y-auto bg-gradient-to-b from-[#063b5d] to-[#052f4d] lg:block">
        <AdminSidebar
          section={section}
          galleryCount={galleryActivities.length}
          teachersCount={teachers.length}
          onNavigate={navigate}
          onClose={() => mobileDialogRef.current?.close()}
        />
      </aside>
      <dialog
        ref={mobileDialogRef}
        aria-label="Navigasi dashboard"
        onClose={() => setMobileMenu(false)}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] border-0 bg-[#052f4d] p-0 backdrop:bg-slate-950/50"
      >
        <AdminSidebar
          mobile
          section={section}
          galleryCount={galleryActivities.length}
          teachersCount={teachers.length}
          onNavigate={navigate}
          onClose={() => mobileDialogRef.current?.close()}
        />
      </dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenu(true);
                mobileDialogRef.current?.showModal();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
              aria-label="Buka navigasi"
            >
                <AdminIcon name="menu" />
              </button>
              <div>
                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                  {active.label}
                </h1>
                <p className="text-xs text-slate-400">{active.caption}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <AdminIcon name="globe" className="h-3.5 w-3.5 text-slate-500" />
                <span className="hidden sm:inline">Lihat Website</span>
              </Link>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#142c58] text-xs font-bold text-white shadow-xs">
                WD
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8">
            {notice && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-xs">
                <span>✓ {notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  className="text-emerald-600 hover:text-emerald-900"
                >
                  ✕
                </button>
              </div>
            )}

            {section === "dashboard" ? (
              <div className="space-y-6">
                {/* Informasi Utama Website Sekolah (1 Baris 3 Kartu Bersih & Elegan) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Card Data Guru */}
                  <div
                    onClick={() => navigate("guru")}
                    className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        TENAGA PENDIDIK
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                        <AdminIcon name="people" className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {teachers.length} Guru
                    </p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {teachers.filter((t) => t.status === "Guru Tetap").length} Guru Tetap • {teachers.filter((t) => t.category === "MIPA").length} Rumpun MIPA
                    </p>
                    <div className="mt-4 border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-blue-700">
                      <span>Kelola direktori guru</span>
                      <span className="transition group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* Card Galeri Kegiatan */}
                  <div
                    onClick={() => navigate("galeri")}
                    className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        GALERI & KEGIATAN
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <AdminIcon name="gallery" className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      {galleryActivities.length} Kegiatan
                    </p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {galleryActivities.reduce((acc, a) => acc + (a.photos?.length || 0), 0)} Foto dokumentasi aktif
                    </p>
                    <div className="mt-4 border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-indigo-700">
                      <span>Kelola galeri kegiatan</span>
                      <span className="transition group-hover:translate-x-1">→</span>
                    </div>
                  </div>

                  {/* Card Informasi SPMB */}
                  <div
                    onClick={() => navigate("spmb")}
                    className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        PENERIMAAN SISWA
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <AdminIcon name="calendar" className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                      Gelombang 1
                    </p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      Status Buka • Pendaftaran TA 2026/2027
                    </p>
                    <div className="mt-4 border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                      <span>Jadwal & alur SPMB</span>
                      <span className="transition group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>

                {/* Grafik Pengunjung Website */}
                <AdminVisitorChart />
              </div>
            ) : section === "galeri" ? (
              /* FULL GALERI MANAGEMENT SECTION */
              <div className="space-y-6">
                {/* Header Actions & Filter */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Pengelolaan Galeri Kegiatan
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Kelola daftar kegiatan, urutan foto, penulis artikel, dan editor crop sampul 3:4.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddGallery}
                    className="rounded-xl bg-[#142c58] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#1a3870] transition"
                  >
                    + Tambah Kegiatan Baru
                  </button>
                </div>

                {/* Gallery Cards Grid (3:4 Portrait Aspect Ratio) */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredGalleryActivities.map((act) => {
                    const coverPhoto =
                      act.photos.find((p) => p.id === act.coverPhotoId) ||
                      act.photos[0];
                    const coverUrl = coverPhoto?.url || "/images/32.webp";
                    const crop = act.cropConfig || { zoom: 1, x: 0, y: 0 };

                    return (
                      <article
                        key={act.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-primary/50 hover:shadow-md"
                      >
                        {/* 3:4 Portrait Aspect Ratio Container with Non-destructive Crop Transform */}
                        <div
                          onClick={() => setViewingGalleryActivity(act)}
                          className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-slate-950"
                        >
                          <img
                            src={coverUrl}
                            alt={act.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            style={{
                              transform: `scale(${crop.zoom}) translate(${crop.x}%, ${crop.y}%)`,
                            }}
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                          
                          {/* Category Badge */}
                          <span className="absolute top-3 left-3 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                            {act.category}
                          </span>

                          {/* Photo Count Badge */}
                          <span className="absolute top-3 right-3 rounded-lg bg-slate-900/80 px-2 py-1 text-[10px] font-mono font-semibold text-slate-200 backdrop-blur-xs">
                            📷 {act.photos.length} Foto
                          </span>

                          {/* Overlay Title & Date (NO AUTHOR NAME ON CARD) */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-[10px] font-medium text-slate-300">
                              {act.date}
                            </p>
                            <h3 className="mt-1 text-sm font-bold leading-snug line-clamp-2 text-white group-hover:text-amber-300 transition">
                              {act.title}
                            </h3>
                          </div>
                        </div>

                        {/* Article Snippet & Author Info Footer */}
                        <div className="flex flex-1 flex-col justify-between p-4 bg-white">
                          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                            {act.content}
                          </p>

                          <div className="mt-4 border-t border-slate-100 pt-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span className="font-semibold text-slate-700">
                                ✍️ {act.authorName}
                              </span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                {act.status}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setViewingGalleryActivity(act)}
                                className="text-xs font-bold text-[#142c58] hover:underline"
                              >
                                Detail & Slider →
                              </button>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditGallery(act)}
                                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGallery(act.id)}
                                  className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-100 transition"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : section === "guru" ? (
              <AdminTeacherTable
                teachers={teachers}
                onOpenAdd={handleOpenAddTeacher}
                onEdit={handleOpenEditTeacher}
                onDelete={handleDeleteTeacher}
                onViewDetail={(t) => setViewingTeacher(t)}
              />
            ) : section === "spmb" ? (
              <AdminSpmbSection onNotify={(msg) => setNotice(msg)} />
            ) : null}
          </main>
        </div>


      {/* Admin Gallery Modal */}
      <AdminGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={handleSaveGallery}
        initialData={editingGalleryActivity}
      />

      {/* Admin Gallery Detail Modal */}
      <AdminGalleryDetailModal
        activity={viewingGalleryActivity}
        onClose={() => setViewingGalleryActivity(null)}
        onEdit={(act) => {
          setViewingGalleryActivity(null);
          handleOpenEditGallery(act);
        }}
      />

      {/* Admin Teacher Modal (Add / Edit) */}
      <AdminTeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSave={handleSaveTeacher}
        initialData={editingTeacher}
      />

      {/* Teacher Detail Modal (Profil Lengkap) */}
      <TeacherDetailModal
        teacher={viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        isAdmin={true}
        onEdit={(t) => {
          setViewingTeacher(null);
          handleOpenEditTeacher(t);
        }}
      />
    </div>
  );
}
