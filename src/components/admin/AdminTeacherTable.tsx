"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Teacher } from "@/types/teacher";

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
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs">
      {/* 1. Header Bar Abu-abu (Persis sesuai referensi screenshot pengguna) */}
      <div className="flex items-center justify-between border-b border-slate-300 bg-[#e6e8ec] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3.5 w-3.5 rounded-full bg-slate-900" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Data Guru
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1d4ed8] transition"
        >
          <span className="text-sm font-bold leading-none">+</span>
          <span>Tambah Guru</span>
        </button>
      </div>

      {/* 2. Toolbar: Search Bar di Kanan Sesuai Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3 sm:px-6 bg-white">
        {/* Total Data Info */}
        <div className="text-xs text-slate-500">
          Total data: <strong className="text-slate-800">{filteredTeachers.length}</strong> guru
        </div>

        {/* Filter Rumpun Ringkas & Kotak Search... */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-[#2563eb] transition"
            title="Filter Jurusan / Rumpun"
          >
            <option value="Semua">Semua Jurusan</option>
            {CATEGORIES.filter((c) => c !== "Semua").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="relative w-52 sm:w-60">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-600"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Tabel Data Guru Bergaris (Format persis sesuai screenshot referensi) */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-white text-slate-900 border-b border-slate-300">
              <th className="border border-slate-300 px-3 py-3 text-center font-bold w-12">
                No
              </th>
              <th className="border border-slate-300 px-3 py-3 text-center font-bold w-20">
                Foto
              </th>
              <th className="border border-slate-300 px-3 py-3 text-left font-bold w-36">
                NIP
              </th>
              <th className="border border-slate-300 px-4 py-3 text-left font-bold min-w-[170px]">
                Nama
              </th>
              <th className="border border-slate-300 px-4 py-3 text-left font-bold min-w-[150px]">
                Kelas
              </th>
              <th className="border border-slate-300 px-4 py-3 text-left font-bold min-w-[130px]">
                Jurusan
              </th>
              <th className="border border-slate-300 px-4 py-3 text-left font-bold min-w-[180px]">
                Alamat
              </th>
              <th className="border border-slate-300 px-3 py-3 text-center font-bold w-24">
                Operasi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border border-slate-300 px-4 py-10 text-center text-slate-400"
                >
                  <p className="font-medium">Data guru tidak ditemukan.</p>
                  {(searchQuery || categoryFilter !== "Semua") && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("Semua");
                      }}
                      className="mt-2 text-xs font-semibold text-[#2563eb] hover:underline"
                    >
                      Reset pencarian & filter
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <tr
                  key={teacher.id}
                  className="border-b border-slate-300 hover:bg-slate-50/70 transition"
                >
                  {/* No */}
                  <td className="border border-slate-300 px-3 py-3 text-center font-bold text-slate-800">
                    {index + 1}
                  </td>

                  {/* Foto (Circular Avatar persis seperti screenshot) */}
                  <td className="border border-slate-300 px-3 py-2 text-center">
                    <div
                      onClick={() => onViewDetail(teacher)}
                      className="relative mx-auto h-11 w-11 cursor-pointer overflow-hidden rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center hover:scale-105 transition"
                      title="Klik untuk lihat detail profil guru"
                    >
                      {teacher.image ? (
                        <Image
                          src={teacher.image}
                          alt={teacher.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <svg
                          className="h-6 w-6 text-slate-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* NIP (Pengganti NIS untuk Guru) */}
                  <td className="border border-slate-300 px-3 py-3 font-mono text-xs text-slate-700 whitespace-nowrap">
                    {teacher.nip ? (
                      teacher.nip
                    ) : teacher.code ? (
                      <span className="font-sans font-bold text-slate-600">
                        {teacher.code}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Nama Lengkap & Gelar */}
                  <td className="border border-slate-300 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onViewDetail(teacher)}
                      className="text-left font-bold text-slate-900 hover:text-[#2563eb] transition line-clamp-2"
                      title="Klik untuk melihat profil lengkap"
                    >
                      {teacher.name} {teacher.code ? `(${teacher.code})` : ""}
                    </button>
                  </td>

                  {/* Kelas (Mata Pelajaran yang Diampu) */}
                  <td className="border border-slate-300 px-4 py-3 font-medium text-slate-700">
                    {teacher.subject || "-"}
                  </td>

                  {/* Jurusan (Rumpun Akademik) */}
                  <td className="border border-slate-300 px-4 py-3 text-slate-700">
                    <span className="font-semibold text-slate-800">
                      {teacher.category || teacher.role || "-"}
                    </span>
                  </td>

                  {/* Alamat (Alamat Domisili Guru) */}
                  <td className="border border-slate-300 px-4 py-3 text-slate-700">
                    <span className="line-clamp-2" title={teacher.address}>
                      {teacher.address || "-"}
                    </span>
                  </td>

                  {/* Operasi: Tombol Kuning (Edit) & Tombol Merah (Hapus) persis di screenshot */}
                  <td className="border border-slate-300 px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Tombol Edit Kuning */}
                      <button
                        type="button"
                        onClick={() => onEdit(teacher)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-2xs transition"
                        title="Edit Data Guru"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m16 3 5 5M4 20l4-1L21 6a2.1 2.1 0 0 0-3-3L5 16z" />
                        </svg>
                      </button>

                      {/* Tombol Hapus Merah */}
                      <button
                        type="button"
                        onClick={() => onDelete(teacher.id)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-2xs transition"
                        title="Hapus Data Guru"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" />
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

      {/* 4. Footer Info Total Data */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 text-xs text-slate-500">
        <p>
          Menampilkan <span className="font-bold text-slate-800">{filteredTeachers.length}</span> dari {teachers.length} guru terdaftar
        </p>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Data tersimpan dan tersinkronisasi otomatis
        </span>
      </div>
    </div>
  );
}
