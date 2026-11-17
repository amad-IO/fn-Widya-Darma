"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Teacher } from "@/types/teacher";
import AdminIcon from "./AdminIcon";

interface AdminTeacherTableProps {
  teachers: Teacher[];
  onOpenAdd: () => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  onViewDetail: (teacher: Teacher) => void;
}

export default function AdminTeacherTable({
  teachers,
  onOpenAdd,
  onEdit,
  onDelete,
  onViewDetail,
}: AdminTeacherTableProps) {
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.education && t.education.join(" ").toLowerCase().includes(q)) ||
      (t.bio && t.bio.toLowerCase().includes(q));
    return matchQuery;
  });
  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / itemsPerPage));
  const activePage = Math.min(page, totalPages);
  const firstItemIndex = (activePage - 1) * itemsPerPage;
  const visibleTeachers = filteredTeachers.slice(
    firstItemIndex,
    firstItemIndex + itemsPerPage,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#07528c] via-[#0b639f] to-[#07528c] px-5 py-3.5 text-center text-white shadow-sm">
        <h2 className="text-sm font-bold tracking-wide">
          Data Guru & Tenaga Kependidikan
        </h2>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white/90">
          {teachers.length} Guru
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex justify-end border-b border-slate-100 px-5 py-3.5 sm:px-6">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari nama atau mata pelajaran"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-7 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <span className="pointer-events-none absolute left-2.5 top-2.5 text-slate-400">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
                  />
                </svg>
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onOpenAdd}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-dark active:scale-[0.99]"
            >
              <span className="text-base font-bold leading-none">+</span>
              <span>Tambah Guru Baru</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-blue-200 bg-gradient-to-r from-[#07528c]/[0.16] via-blue-50 to-[#07528c]/[0.1] text-[11px] font-bold uppercase tracking-wider text-primary">
                <th className="w-12 px-4 py-3 text-center">No</th>
                <th className="min-w-[220px] px-4 py-3">Guru & Profil</th>
                <th className="min-w-[150px] px-4 py-3">Mata Pelajaran</th>
                <th className="min-w-[190px] px-4 py-3">Pendidikan S1</th>
                <th className="w-28 px-4 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                      <AdminIcon name="people" className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-slate-700">
                      Data guru tidak ditemukan
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Coba gunakan kata kunci pencarian lain.
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                        }}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Reset filter pencarian
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                visibleTeachers.map((teacher, index) => (
                  <tr
                    key={teacher.id}
                    className="hover:bg-slate-50/80 transition duration-150 group"
                  >
                    {/* No */}
                    <td className="px-4 py-3.5 text-center font-medium text-slate-400 text-[11px]">
                      {firstItemIndex + index + 1}
                    </td>

                    {/* Guru & Profil (Avatar + Nama + Jabatan) */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => onViewDetail(teacher)}
                          className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs group-hover:ring-2 group-hover:ring-primary/20 transition"
                          title="Klik untuk melihat profil lengkap"
                        >
                          <Image
                            src={teacher.image || "/images/50.webp"}
                            alt={teacher.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewDetail(teacher)}
                            className="text-left font-semibold text-slate-900 hover:text-primary transition truncate block max-w-[200px]"
                            title={teacher.name}
                          >
                            {teacher.name}
                          </button>
                          <span className="mt-0.5 block text-[11px] text-slate-500">
                            Guru
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Mata Pelajaran */}
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {teacher.subject || "-"}
                    </td>

                    {/* Pendidikan S1 */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="line-clamp-2 max-w-[220px]">
                        {teacher.education?.[0] || "-"}
                      </span>
                    </td>

                    {/* Tindakan (Eye, Edit, Delete yang Modern & Human-Centered) */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Detail */}
                        <button
                          type="button"
                          onClick={() => onViewDetail(teacher)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-primary transition shadow-2xs"
                          title="Lihat Profil Lengkap"
                        >
                          <AdminIcon name="book" className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(teacher)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition shadow-2xs"
                          title="Edit Data Guru"
                        >
                          <AdminIcon name="edit" className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete(teacher.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition shadow-2xs"
                          title="Hapus Data Guru"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Footer Info Total Data yang Ringkas */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-slate-800">
              {filteredTeachers.length
                ? `${firstItemIndex + 1}–${Math.min(firstItemIndex + itemsPerPage, filteredTeachers.length)}`
                : 0}
            </span>{" "}
            dari {teachers.length} guru
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={activePage === 1}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="min-w-12 text-center text-[11px] font-semibold text-slate-500">
              {activePage} dari {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={activePage === totalPages}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
