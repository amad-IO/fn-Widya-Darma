"use client";

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

const CATEGORIES = [
  "Semua",
  "MIPA",
  "Bahasa",
  "Sosial & Humaniora",
  "Seni & Olahraga",
  "Bimbingan Konseling",
  "Lainnya",
];

export default function AdminTeacherTable({
  teachers,
  onOpenAdd,
  onEdit,
  onDelete,
  onViewDetail,
}: AdminTeacherTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const filteredTeachers = teachers.filter((t) => {
    const matchCategory =
      categoryFilter === "Semua" || t.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      (t.code && t.code.toLowerCase().includes(q)) ||
      (t.subject && t.subject.toLowerCase().includes(q)) ||
      (t.nip && t.nip.toLowerCase().includes(q)) ||
      (t.role && t.role.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.address && t.address.toLowerCase().includes(q)) ||
      (t.email && t.email.toLowerCase().includes(q));
    return matchCategory && matchQuery;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* 1. Header Toolbar yang Bersih & Elegan */}
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-5 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Data Guru & Tenaga Kependidikan
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-primary border border-blue-100/70">
              {teachers.length} Guru
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:justify-end">
          <select
            id="filter-kategori-guru"
            aria-label="Filter bidang studi"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="Semua">Filter bidang studi</option>
            {CATEGORIES.filter((c) => c !== "Semua").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama, NIP, atau mapel"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setSearchQuery("")}
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07528c] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#063b68] active:scale-[0.99]"
          >
            <span className="text-base font-bold leading-none">+</span>
            <span>Tambah Guru Baru</span>
          </button>
        </div>
      </div>

      {/* 3. Modern Clean Data Table (Tanpa border kaku per kotak, menggunakan soft divider) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-blue-100 bg-gradient-to-r from-[#31529a]/[0.12] via-blue-50 to-[#31529a]/[0.08] text-[11px] font-bold uppercase tracking-wider text-[#31529a]">
              <th className="px-4 py-3 text-center w-12">No</th>
              <th className="px-4 py-3 min-w-[220px]">Guru & Profil</th>
              <th className="px-4 py-3 min-w-[130px]">NIP / Kode</th>
              <th className="px-4 py-3 min-w-[150px]">Mata Pelajaran</th>
              <th className="px-4 py-3 min-w-[130px]">Bidang Studi</th>
              <th className="px-4 py-3 min-w-[170px]">Alamat</th>
              <th className="px-4 py-3 text-right w-28">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTeachers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                    <AdminIcon name="people" className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-slate-700">
                    Data guru tidak ditemukan
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Coba gunakan kata kunci pencarian lain atau ubah filter
                    bidang studi.
                  </p>
                  {(searchQuery || categoryFilter !== "Semua") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("Semua");
                      }}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Reset filter pencarian
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-slate-50/80 transition duration-150 group"
                >
                  {/* No */}
                  <td className="px-4 py-3.5 text-center font-medium text-slate-400 text-[11px]">
                    {index + 1}
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
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500 truncate">
                            {teacher.role || "Tenaga Pendidik"}
                          </span>
                          <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {teacher.status || "Aktif"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* NIP / Kode */}
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {teacher.nip ? (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                        {teacher.nip}
                      </span>
                    ) : teacher.code ? (
                      <span className="bg-blue-50 text-primary font-sans font-bold px-1.5 py-0.5 rounded text-[10px]">
                        {teacher.code}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Mata Pelajaran */}
                  <td className="px-4 py-3.5 font-medium text-slate-700">
                    {teacher.subject || "-"}
                  </td>

                  {/* Rumpun */}
                  <td className="px-4 py-3.5">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {teacher.category || "-"}
                    </span>
                  </td>

                  {/* Alamat */}
                  <td className="px-4 py-3.5 text-slate-600">
                    <span
                      className="line-clamp-1 max-w-[180px]"
                      title={teacher.address}
                    >
                      {teacher.address || "-"}
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
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
        <p>
          Menampilkan{" "}
          <span className="font-semibold text-slate-800">
            {filteredTeachers.length}
          </span>{" "}
          dari {teachers.length} guru
        </p>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Data tersimpan di penyimpanan lokal dan tersinkronisasi otomatis
        </span>
      </div>
    </div>
  );
}
