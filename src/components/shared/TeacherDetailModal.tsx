"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Teacher } from "@/types/teacher";
import AdminIcon from "@/components/admin/AdminIcon";

interface TeacherDetailModalProps {
  teacher: Teacher | null;
  onClose: () => void;
  onEdit?: (teacher: Teacher) => void;
  isAdmin?: boolean;
}

export default function TeacherDetailModal({
  teacher,
  onClose,
  onEdit,
  isAdmin = false,
}: TeacherDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (teacher) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  const displayName = teacher.code
    ? `${teacher.name} (${teacher.code})`
    : teacher.name;

  if (isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-xs sm:p-6">
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
        <div className="relative z-10 my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
            <h2 className="text-base font-bold text-slate-900">Profil Guru</h2>
            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(teacher);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <AdminIcon name="edit" className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup jendela profil"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <AdminIcon name="close" className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[78vh] space-y-6 overflow-y-auto p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative aspect-[3/4] w-36 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
                <Image
                  src={teacher.image || "/images/50.webp"}
                  alt={teacher.name}
                  fill
                  sizes="144px"
                  unoptimized={teacher.image?.startsWith("/api/media?")}
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {teacher.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {teacher.subject || "Mata pelajaran belum diisi"}
              </p>
            </div>

            <dl className="divide-y divide-slate-100 border-y border-slate-100">
              <div className="py-4">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Deskripsi Singkat
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-slate-700">
                  {teacher.bio || "Belum ada deskripsi singkat."}
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Pendidikan S1
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-slate-700">
                  {teacher.education?.[0] || "Belum ada pendidikan S1."}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 my-auto">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {teacher.status || "Aktif"}
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {teacher.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(teacher);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <AdminIcon name="edit" className="h-3.5 w-3.5 text-slate-500" />
                Edit Data
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
              aria-label="Tutup jendela profil"
            >
              <AdminIcon name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            {/* Foto Portrait Kiri */}
            <div className="w-full sm:w-52 shrink-0 flex flex-col items-center">
              <div className="relative aspect-[3/4] w-48 sm:w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 shadow-sm">
                <Image
                  src={teacher.image || "/images/50.webp"}
                  alt={teacher.name}
                  fill
                  sizes="240px"
                  unoptimized={teacher.image?.startsWith("/api/media?")}
                  className="object-cover"
                />
              </div>

              {/* Quick Actions (Email & WA) */}
              <div className="mt-4 w-full space-y-2">
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-[#990000] hover:text-white hover:border-[#990000] transition group"
                  >
                    <AdminIcon name="mail" className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                    <span>Kirim Email</span>
                  </a>
                )}
                {teacher.phone && (
                  <a
                    href={`https://wa.me/${teacher.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-3 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
                  >
                    <AdminIcon name="phone" className="h-3.5 w-3.5 text-white" />
                    <span>Hubungi WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Detail Profil Kanan */}
            <div className="flex-1 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {displayName}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#990000]">
                  {teacher.role || "NJFA"} · {teacher.subject}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  {teacher.nip && <span>NIP: {teacher.nip}</span>}
                  {teacher.nuptk && <span>NUPTK: {teacher.nuptk}</span>}
                </div>
              </div>

              {/* Bidang Keahlian dengan Garis Aksen Merah */}
              {teacher.expertise && teacher.expertise.length > 0 && (
                <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Bidang Keahlian & Fokus Akademik
                  </h3>
                  <div className="border-l-3 border-[#990000] pl-3 py-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                      {teacher.expertise.join(" • ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Biografi / Filosofi Mengajar */}
              {teacher.bio && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Biografi & Moto Mengajar
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    {teacher.bio}
                  </p>
                </div>
              )}

              {/* Riwayat Pendidikan */}
              {teacher.education && teacher.education.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Riwayat Pendidikan
                  </h3>
                  <ul className="space-y-2">
                    {teacher.education.map((edu, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                      >
                        <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-[#990000]" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Kontak Resmi */}
              <div className="pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                      Email Resmi
                    </span>
                    <span className="font-medium text-slate-800 break-all">
                      {teacher.email}
                    </span>
                  </div>
                  {teacher.phone && (
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                        Telepon / WhatsApp
                      </span>
                      <span className="font-medium text-slate-800">
                        {teacher.phone}
                      </span>
                    </div>
                  )}
                  {teacher.address && (
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-slate-400 block text-[10px] uppercase">
                        Alamat Domisili
                      </span>
                      <span className="font-medium text-slate-800">
                        {teacher.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-200/80 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
