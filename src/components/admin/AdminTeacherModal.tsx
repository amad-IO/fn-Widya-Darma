"use client";

import React, { useEffect, useRef, useState } from "react";
import { Teacher, TeacherCategory, TeacherStatus } from "@/types/teacher";
import AdminIcon from "./AdminIcon";

interface AdminTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  initialData?: Teacher | null;
}

const CATEGORIES: TeacherCategory[] = [
  "MIPA",
  "Bahasa",
  "Sosial & Humaniora",
  "Seni & Olahraga",
  "Bimbingan Konseling",
  "Lainnya",
];

const STATUSES: TeacherStatus[] = [
  "Guru Tetap",
  "Aktif",
  "Guru Honorer",
  "Cuti",
];
const DEFAULT_IMAGE = "/images/teachers/teacher-1.jpg";

export default function AdminTeacherModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AdminTeacherModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState<TeacherCategory>("MIPA");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nip, setNip] = useState("");
  const [status, setStatus] = useState<TeacherStatus>("Guru Tetap");
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCode(initialData.code || "");
      setRole(initialData.role || "");
      setCategory(initialData.category || "MIPA");
      setSubject(initialData.subject || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setNip(initialData.nip || "");
      setStatus(initialData.status || "Guru Tetap");
      setImage(initialData.image || DEFAULT_IMAGE);
    } else {
      setName("");
      setCode("");
      setRole("");
      setCategory("MIPA");
      setSubject("");
      setEmail("");
      setPhone("");
      setAddress("");
      setNip("");
      setStatus("Guru Tetap");
      setImage(DEFAULT_IMAGE);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Ukuran file maksimal 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string } = {};
    if (!name.trim()) nextErrors.name = "Nama lengkap wajib diisi.";
    if (!email.trim()) nextErrors.email = "Email wajib diisi.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...initialData,
      id: initialData?.id || `guru-${Date.now()}`,
      name: name.trim(),
      code: code.trim() ? code.trim().toUpperCase() : undefined,
      role: role.trim() || "Tenaga Pendidik",
      category,
      subject: subject.trim() || "-",
      email: email.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      nip: nip.trim() || undefined,
      image: image || DEFAULT_IMAGE,
      status,
      order: initialData?.order || Date.now(),
    });
    onClose();
  };

  const previewName = name || "Nama Guru, Gelar";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#31529a] focus:bg-white focus:ring-2 focus:ring-[#31529a]/15";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-xs sm:p-5">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">
            {initialData ? "Edit Data Guru" : "Tambah Guru Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="max-h-[82vh] space-y-5 overflow-y-auto p-6 sm:p-8"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Nama lengkap & gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Karina Fitriwulandari Ilham, S.Kom., M.Kom."
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Kode guru
            </label>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Contoh: KFI"
              className={`${inputClass} uppercase`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Jabatan
            </label>
            <input
              type="text"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Contoh: Guru Mata Pelajaran"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Bidang studi
            </label>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TeacherCategory)
              }
              className={inputClass}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Mata pelajaran
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Contoh: Informatika"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@sekolah.sch.id"
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              No. telepon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Contoh: +62 812-3456-7890"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Alamat domisili
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Contoh: Jl. Melati No. 14, Jakarta Timur"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              NIP
            </label>
            <input
              type="text"
              value={nip}
              onChange={(event) => setNip(event.target.value)}
              placeholder="Contoh: 19910412 201801 2 004"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Status kepegawaian
            </label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TeacherStatus)
              }
              className={inputClass}
            >
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
            <label className="block text-xs font-semibold text-slate-700">
              Foto guru{" "}
              <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG, atau WebP. Maksimal 3 MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#31529a] transition hover:bg-blue-50"
            >
              <span className="text-base leading-none">+</span> Pilih foto
            </button>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pratinjau
            </p>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:flex-row">
              <div className="relative mx-auto mt-5 h-36 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-200 sm:mb-5 sm:ml-5 sm:mr-0">
                <img
                  src={image || DEFAULT_IMAGE}
                  alt={previewName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
                <h3 className="text-sm font-bold text-slate-900">
                  {previewName}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#31529a]">
                  {role || "Jabatan guru"}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {subject || "Mata pelajaran"} · {category}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {email || "email@sekolah.sch.id"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#31529a] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#26437f]"
            >
              {initialData ? "Simpan Perubahan" : "Tambahkan Guru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
