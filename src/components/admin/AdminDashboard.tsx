"use client";

import { useRef, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminGalleryModal from "./AdminGalleryModal";
import AdminGalleryDetailModal from "./AdminGalleryDetailModal";
import AdminTeacherModal from "./AdminTeacherModal";
import AdminTeacherTable from "./AdminTeacherTable";
import AdminOverview from "./AdminOverview";
import AdminGallerySection from "./AdminGallerySection";
import AdminSpmbSection from "./AdminSpmbSection";
import TeacherDetailModal from "@/components/shared/TeacherDetailModal";
import { GalleryActivity } from "@/types/gallery";
import { Teacher } from "@/types/teacher";
import { type AdminSection } from "@/lib/admin-preview";
import { useAdminGallery } from "@/hooks/admin/useAdminGallery";
import { useAdminNotice } from "@/hooks/admin/useAdminNotice";
import { useAdminTeachers } from "@/hooks/admin/useAdminTeachers";

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const { notice, setNotice, clearNotice } = useAdminNotice();

  const {
    activities: galleryActivities,
    saveActivity,
    removeActivity,
  } = useAdminGallery();
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryActivity, setEditingGalleryActivity] =
    useState<GalleryActivity | null>(null);
  const [viewingGalleryActivity, setViewingGalleryActivity] =
    useState<GalleryActivity | null>(null);

  const mobileDialogRef = useRef<HTMLDialogElement>(null);

  function navigate(next: AdminSection) {
    setSection(next);
    setNotice("");
    mobileDialogRef.current?.close();
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
    removeActivity(id);
    setNotice("Kegiatan galeri berhasil dihapus.");
  };

  const handleSaveGallery = (savedActivity: GalleryActivity) => {
    saveActivity(savedActivity);
    setNotice(
      editingGalleryActivity
        ? "Kegiatan galeri berhasil diperbarui."
        : "Kegiatan galeri baru berhasil dipublikasikan.",
    );
  };

  const { teachers, saveTeacher, removeTeacher } = useAdminTeachers();
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);

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
        `Apakah Anda yakin ingin menghapus data guru "${target?.name || "ini"}"?`,
      )
    ) {
      removeTeacher(id);
      setNotice("Data guru berhasil dihapus.");
    }
  };

  const handleSaveTeacher = (savedTeacher: Teacher) => {
    saveTeacher(savedTeacher);
    setNotice(
      editingTeacher
        ? `Data guru "${savedTeacher.name}" berhasil diperbarui.`
        : `Guru baru "${savedTeacher.name}" berhasil ditambahkan.`,
    );
  };

  return (
    <AdminLayout
      section={section}
      galleryCount={galleryActivities.length}
      teachersCount={teachers.length}
      notice={notice}
      mobileDialogRef={mobileDialogRef}
      onNavigate={navigate}
      onOpenMobileMenu={() => {
        mobileDialogRef.current?.showModal();
      }}
      onCloseMobileMenu={() => {
        mobileDialogRef.current?.close();
      }}
      onClearNotice={clearNotice}
    >
      {section === "dashboard" ? (
        <AdminOverview
          teachers={teachers}
          galleryActivities={galleryActivities}
          onNavigate={navigate}
        />
      ) : section === "galeri" ? (
        <AdminGallerySection
          activities={galleryActivities}
          onAdd={handleOpenAddGallery}
          onEdit={handleOpenEditGallery}
          onView={setViewingGalleryActivity}
        />
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
      ) : section === "kelas" || section === "pengaturan" ? (
        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-xs">
          <h2 className="text-lg font-bold text-slate-900">
            {section === "kelas" ? "Kelas" : "Pengaturan"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {section === "kelas"
              ? "Menu pengelolaan kelas akan tersedia di sini."
              : "Menu pengaturan administrasi akan tersedia di sini."}
          </p>
        </section>
      ) : null}

      {/* Admin Gallery Modal */}
      <AdminGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSave={handleSaveGallery}
        onDelete={handleDeleteGallery}
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
    </AdminLayout>
  );
}
