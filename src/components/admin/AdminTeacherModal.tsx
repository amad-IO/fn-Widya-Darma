"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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

const PRESET_IMAGES = [
  { label: "Formal Hijab 1", url: "/images/teachers/teacher-1.jpg" },
  { label: "Formal Hijab Biru", url: "/images/teachers/teacher-2.jpg" },
  { label: "Formal Pria Jas", url: "/images/teachers/teacher-3.jpg" },
  { label: "Formal Hijab 2", url: "/images/teachers/teacher-4.jpg" },
];

export default function AdminTeacherModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AdminTeacherModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("NJFA");
  const [category, setCategory] = useState<TeacherCategory>("MIPA");
  const [subject, setSubject] = useState("");
  const [nip, setNip] = useState("");
  const [nuptk, setNuptk] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("/images/teachers/teacher-1.jpg");
  const [educationInput, setEducationInput] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<TeacherStatus>("Guru Tetap");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCode(initialData.code || "");
      setRole(initialData.role || "NJFA");
      setCategory(initialData.category || "MIPA");
      setSubject(initialData.subject || "");
      setNip(initialData.nip || "");
      setNuptk(initialData.nuptk || "");
      setExpertiseInput(
        Array.isArray(initialData.expertise)
          ? initialData.expertise.join(", ")
          : ""
      );
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
      setImage(initialData.image || "/images/teachers/teacher-1.jpg");
      setEducationInput(
        Array.isArray(initialData.education)
          ? initialData.education.join("\n")
          : ""
      );
      setBio(initialData.bio || "");
      setStatus(initialData.status || "Guru Tetap");
    } else {
      setName("");
      setCode("");
      setRole("NJFA");
      setCategory("MIPA");
      setSubject("");
      setNip("");
      setNuptk("");
      setExpertiseInput("");
      setEmail("");
      setPhone("");
      setAddress("");
      setImage("/images/teachers/teacher-1.jpg");
      setEducationInput("");
      setBio("");
      setStatus("Guru Tetap");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Ukuran file maksimal 3MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Nama guru wajib diisi";
    if (!email.trim()) newErrors.email = "Email resmi wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const expertiseList = expertiseInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const educationList = educationInput
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const savedTeacher: Teacher = {
      id: initialData?.id || `guru-${Date.now()}`,
      name: name.trim(),
      code: code.trim() ? code.trim().toUpperCase() : undefined,
      role: role.trim() || "NJFA",
      category,
      subject: subject.trim() || "Pengajar",
      nip: nip.trim() || undefined,
      nuptk: nuptk.trim() || undefined,
      expertise: expertiseList.length > 0 ? expertiseList : undefined,
      email: email.trim(),
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      image: image || "/images/portrait.jpg",
      education: educationList.length > 0 ? educationList : undefined,
      bio: bio.trim() || undefined,
      status,
      order: initialData?.order || Date.now(),
    };

    onSave(savedTeacher);
    onClose();
  };

  const previewDisplayName = code ? `${name || "Nama Guru, Gelar"} (${code})` : name || "Nama Guru, Gelar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? "Edit Data Guru" : "Tambah Guru Baru"}
            </h2>
            <p className="text-xs text-slate-400">
              Sesuaikan data pengajar sesuai struktur profil kartu pengajar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/60 transition"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </div>

        {/* Content: 2-Column Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Left Form */}
          <form onSubmit={handleSave} className="lg:col-span-7 p-6 sm:p-8 space-y-5 border-r border-slate-100">
            {/* Nama & Kode Singkatan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Karina Fitriwulandari Ilham, S.Kom., M.Kom."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode (Singkatan)
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Contoh: KFI"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition uppercase"
                />
              </div>
            </div>

            {/* Subtitle / Role & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jabatan / Subtitle
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Contoh: NJFA atau Guru Mata Pelajaran"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rumpun Pelajaran
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TeacherCategory)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mata Pelajaran Utama */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mata Pelajaran yang Diampu
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Informatika & Rekayasa Komputer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
              />
            </div>

            {/* Bidang Keahlian (Garis Merah di Kartu) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Bidang Keahlian / Fokus (Garis Merah Aksen)
                </label>
                <span className="text-[10px] text-slate-400">Pisahkan dengan koma</span>
              </div>
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                placeholder="Contoh: Network Security, Cloud Computing, Machine Learning, Network Architecture"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
              />
            </div>

            {/* Email & Kontak */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Resmi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="karinafitriwulandari@telkomuniversity.ac.id"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-3456-7890"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                />
              </div>
            </div>

            {/* Alamat Domisili */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Domisili
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Melati No. 14, Jakarta Timur"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
              />
            </div>

            {/* NIP & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NIP / NUPTK (Opsional)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="19910412 201801 2 004"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Kepegawaian
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TeacherStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 transition"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Foto Profil Guru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Foto Formal Guru (Rasio Portrait 3:4)
              </label>
              
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] text-slate-400">Pilih Preset Foto:</span>
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                      image === preset.url
                        ? "bg-[#142c58] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Upload file button or URL */}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  📁 Upload Foto Baru
                </button>
                <span className="text-xs text-slate-400">atau masukkan URL gambar:</span>
              </div>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/teachers/teacher-1.jpg atau https://..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white transition"
              />
            </div>

            {/* Riwayat Pendidikan */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Riwayat Pendidikan
                </label>
                <span className="text-[10px] text-slate-400">1 baris per jenjang</span>
              </div>
              <textarea
                rows={2}
                value={educationInput}
                onChange={(e) => setEducationInput(e.target.value)}
                placeholder="S1 Teknik Informatika - Institut Teknologi Bandung&#10;S2 Magister Ilmu Komputer - Universitas Indonesia"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white transition"
              />
            </div>

            {/* Biografi / Moto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Biografi & Moto Mengajar
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan filosofi mengajar atau pengalaman singkat guru..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-primary focus:bg-white transition"
              />
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#142c58] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#1a3870] transition"
              >
                {initialData ? "Simpan Perubahan" : "Tambahkan Guru"}
              </button>
            </div>
          </form>

          {/* Right Live Card Preview (Identical to user's screenshot) */}
          <div className="lg:col-span-5 p-6 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Pratinjau Kartu (Live Preview)
                </span>
                <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                  Sesuai Halaman Publik
                </span>
              </div>

              {/* Exact card mockup */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row items-stretch gap-4">
                {/* Photo Left */}
                <div className="relative mx-auto sm:mx-0 w-32 shrink-0 aspect-[3/4] overflow-hidden rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
                  <img
                    src={image || "/images/teachers/teacher-1.jpg"}
                    alt={name || "Preview"}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] font-medium text-white">
                    {category}
                  </span>
                </div>

                {/* Info Right */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {previewDisplayName}
                    </h4>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {role || "NJFA"}
                    </p>

                    {/* Red line for expertise */}
                    {expertiseInput ? (
                      <div className="mt-2.5 border-l-2 border-[#990000] pl-2.5 py-0.5 text-[11px] text-slate-600 leading-relaxed">
                        {expertiseInput}
                      </div>
                    ) : (
                      <div className="mt-2.5 border-l-2 border-slate-200 pl-2.5 py-0.5 text-[11px] text-slate-400 italic">
                        Belum ada bidang keahlian diisi
                      </div>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                      <AdminIcon name="mail" className="h-3 w-3 shrink-0 text-slate-400" />
                      <span className="truncate">{email || "email@sekolah.sch.id"}</span>
                    </div>

                    <div className="rounded-lg border border-[#990000] py-1.5 text-center text-[11px] font-semibold text-[#990000]">
                      Profil Lengkap
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notice / info box */}
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-[11px] text-blue-900 leading-relaxed">
              💡 <strong>Tips Tampilan:</strong> Format kartu diatur dengan rasio foto formal 3:4 di sebelah kiri dan informasi gelar, kode, keahlian bergaris aksen merah di sebelah kanan, sama persis dengan referensi direktori pengajar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
