"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SpmbInfo,
  SpmbWave,
  SpmbStep,
} from "@/types/spmb";
import {
  getStoredSpmbInfo,
  saveStoredSpmbInfo,
} from "@/lib/spmb-data";
import { cn } from "@/lib/utils";

interface AdminSpmbSectionProps {
  onNotify?: (msg: string) => void;
}

type SpmbTab = "umum" | "gelombang" | "syarat-alur" | "brosur";

export default function AdminSpmbSection({ onNotify }: AdminSpmbSectionProps) {
  const [data, setData] = useState<SpmbInfo>(getStoredSpmbInfo());
  const [activeTab, setActiveTab] = useState<SpmbTab>("umum");
  const [isSaved, setIsSaved] = useState(false);
  const [previewBrochureOpen, setPreviewBrochureOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(getStoredSpmbInfo());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SpmbInfo>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      }
    };

    window.addEventListener("widya_darma_spmb_updated", handleUpdate);
    return () => {
      window.removeEventListener("widya_darma_spmb_updated", handleUpdate);
    };
  }, []);

  const handleSave = () => {
    saveStoredSpmbInfo(data);
    setIsSaved(true);
    if (onNotify) {
      onNotify("Informasi SPMB, Jadwal, Persyaratan & Brosur berhasil disimpan.");
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const updated: SpmbInfo = {
        ...data,
        brochureUrl: result,
        brochureFileName: file.name,
        brochureUploadedAt: new Date().toISOString().split("T")[0],
      };
      setData(updated);
      saveStoredSpmbInfo(updated);
      if (onNotify) {
        onNotify(`Brosur SPMB "${file.name}" berhasil diunggah.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetBrochure = () => {
    const updated: SpmbInfo = {
      ...data,
      brochureUrl: "/images/spmb-brochure.jpg",
      brochureFileName: "Brosur-Resmi-SPMB-SMA-Widya-Darma-2026.jpg",
      brochureUploadedAt: new Date().toISOString().split("T")[0],
    };
    setData(updated);
    saveStoredSpmbInfo(updated);
    if (onNotify) {
      onNotify("Brosur dikembalikan ke versi resmi default.");
    }
  };

  // Wave Helpers
  const handleUpdateWave = (index: number, updatedFields: Partial<SpmbWave>) => {
    const newWaves = [...data.waves];
    newWaves[index] = { ...newWaves[index], ...updatedFields };
    setData({ ...data, waves: newWaves });
  };

  const handleAddWave = () => {
    const newWave: SpmbWave = {
      id: `wave-${Date.now()}`,
      name: `Gelombang ${data.waves.length + 1}`,
      period: "01 Juli - 31 Agustus 2027",
      status: "Segera Dibuka",
      quota: "50 Kursi",
      discount: "Reguler",
    };
    setData({ ...data, waves: [...data.waves, newWave] });
  };

  const handleDeleteWave = (id: string) => {
    if (confirm("Hapus gelombang pendaftaran ini?")) {
      setData({ ...data, waves: data.waves.filter((w) => w.id !== id) });
    }
  };

  // Requirement Helpers
  const handleUpdateReq = (index: number, val: string) => {
    const newReqs = [...data.requirements];
    newReqs[index] = val;
    setData({ ...data, requirements: newReqs });
  };

  const handleAddReq = () => {
    setData({
      ...data,
      requirements: [...data.requirements, "Dokumen persyaratan tambahan baru"],
    });
  };

  const handleDeleteReq = (index: number) => {
    setData({
      ...data,
      requirements: data.requirements.filter((_, i) => i !== index),
    });
  };

  // Step Helpers
  const handleUpdateStep = (index: number, field: keyof SpmbStep, val: any) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: val };
    setData({ ...data, steps: newSteps });
  };

  const tabs: { id: SpmbTab; label: string; count?: number }[] = [
    { id: "umum", label: "Informasi Umum & Kontak" },
    { id: "gelombang", label: "Jadwal Gelombang" },
    { id: "syarat-alur", label: "Syarat & Alur Pendaftaran" },
    { id: "brosur", label: "Brosur Resmi SPMB" },
  ];

  return (
    <div className="space-y-5">
      {/* 1. Header Bar Bersih */}
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#e6e8ec] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3.5 w-3.5 rounded-full bg-slate-900" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Pengelolaan SPMB & Brosur {data.academicYear}
            </h2>
            <span
              className={cn(
                "ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                data.status === "Buka"
                  ? "bg-emerald-100 text-emerald-800"
                  : data.status === "Segera Dibuka"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              )}
            >
              Status: {data.status}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href="/spmb"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              title="Buka halaman publik SPMB di tab baru"
            >
              <span>Lihat Halaman Publik</span>
              <span className="text-slate-400">↗</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-bold text-white shadow-xs transition",
                isSaved
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#2563eb] hover:bg-[#1d4ed8]"
              )}
            >
              {isSaved ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4-4 4m0 0-4-4m4 4V3" />
                  </svg>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. TAB NAVIGASI */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-50/80 px-4 py-2 sm:px-6 border-t border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-[#142c58] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. KONTEN TAB */}

      {/* TAB 1: INFORMASI UMUM & KONTAK */}
      {activeTab === "umum" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          {/* Header Kartu Terpadu */}
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Informasi Pokok & Kontak SPMB
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengaturan tahun ajaran, status penerimaan, biaya, dan kanal komunikasi resmi panitia.
              </p>
            </div>
          </div>

          {/* Form Berurutan ke Bawah */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tahun Pelajaran
              </label>
              <input
                type="text"
                value={data.academicYear}
                onChange={(e) =>
                  setData({ ...data, academicYear: e.target.value })
                }
                placeholder="2026/2027"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Status Penerimaan
              </label>
              <select
                value={data.status}
                onChange={(e) =>
                  setData({
                    ...data,
                    status: e.target.value as "Buka" | "Segera Dibuka" | "Ditutup",
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              >
                <option value="Buka">Buka (Pendaftaran Aktif)</option>
                <option value="Segera Dibuka">Segera Dibuka</option>
                <option value="Ditutup">Ditutup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Biaya Formulir
              </label>
              <input
                type="text"
                value={data.registrationFee}
                onChange={(e) =>
                  setData({ ...data, registrationFee: e.target.value })
                }
                placeholder="Rp 250.000"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Headline Banner
              </label>
              <input
                type="text"
                value={data.headline}
                onChange={(e) =>
                  setData({ ...data, headline: e.target.value })
                }
                placeholder="Penerimaan Siswa Baru (SPMB)"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Slogan / Sambutan
              </label>
              <input
                type="text"
                value={data.subheadline}
                onChange={(e) =>
                  setData({ ...data, subheadline: e.target.value })
                }
                placeholder="Bergabunglah bersama keluarga besar SMA Widya Darma"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                WhatsApp Hotline Panitia
              </label>
              <input
                type="text"
                value={data.contactPhone}
                onChange={(e) =>
                  setData({ ...data, contactPhone: e.target.value })
                }
                placeholder="+62 812-3456-7890"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Resmi SPMB
              </label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(e) =>
                  setData({ ...data, contactEmail: e.target.value })
                }
                placeholder="spmb@widyadarma.sch.id"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JADWAL GELOMBANG */}
      {activeTab === "gelombang" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Jadwal Gelombang Pendaftaran
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Atur nama gelombang, periode pendaftaran, status, kuota siswa, serta penawaran beasiswa.
            </p>
          </div>

          {/* Form 1 Gelombang Berurutan ke Bawah */}
          {(() => {
            const wave = data.waves[0] || {
              id: "wave-1",
              name: "Gelombang 1 (Early Bird)",
              period: "01 Oktober - 31 Desember 2026",
              status: "Aktif",
              quota: "120 Kursi",
              discount: "Diskon Biaya Masuk 20% + Bebas Biaya Formulir",
            };

            return (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Gelombang
                  </label>
                  <input
                    type="text"
                    value={wave.name}
                    onChange={(e) =>
                      handleUpdateWave(0, { name: e.target.value })
                    }
                    placeholder="Contoh: Gelombang 1 (Early Bird)"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Periode Pendaftaran
                  </label>
                  <input
                    type="text"
                    value={wave.period}
                    onChange={(e) =>
                      handleUpdateWave(0, { period: e.target.value })
                    }
                    placeholder="Contoh: 01 Oktober - 31 Desember 2026"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status Pendaftaran
                  </label>
                  <select
                    value={wave.status}
                    onChange={(e) =>
                      handleUpdateWave(0, {
                        status: e.target.value as "Aktif" | "Segera Dibuka" | "Ditutup",
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Segera Dibuka">Segera Dibuka</option>
                    <option value="Ditutup">Ditutup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kuota Kursi
                  </label>
                  <input
                    type="text"
                    value={wave.quota}
                    onChange={(e) =>
                      handleUpdateWave(0, { quota: e.target.value })
                    }
                    placeholder="Contoh: 120 Kursi"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Penawaran / Beasiswa
                  </label>
                  <input
                    type="text"
                    value={wave.discount || ""}
                    onChange={(e) =>
                      handleUpdateWave(0, { discount: e.target.value })
                    }
                    placeholder="Contoh: Diskon Biaya Masuk 20% + Bebas Biaya Formulir"
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: SYARAT & ALUR PENDAFTARAN */}
      {activeTab === "syarat-alur" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Sub-Card 1: Persyaratan Calon Siswa */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Persyaratan Berkas ({data.requirements.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar dokumen yang wajib disiapkan oleh calon siswa.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddReq}
                className="inline-flex items-center gap-1 rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#1d4ed8] transition"
              >
                + Tambah Syarat
              </button>
            </div>

            <div className="space-y-2.5">
              {data.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleUpdateReq(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#2563eb] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteReq(idx)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition text-xs"
                    title="Hapus Persyaratan"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Card 2: Alur Tahapan Pendaftaran */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Alur Tahapan Pendaftaran ({data.steps.length} Langkah)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Alur seleksi yang akan dilalui oleh calon siswa hingga resmi diterima.
              </p>
            </div>

            <div className="space-y-3">
              {data.steps.map((st, idx) => (
                <div
                  key={st.step}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2 hover:bg-white hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#142c58] text-[10px] font-bold text-white">
                      {st.step}
                    </span>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) =>
                        handleUpdateStep(idx, "title", e.target.value)
                      }
                      placeholder="Judul Tahapan..."
                      className="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-[#2563eb] transition"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={st.description}
                    onChange={(e) =>
                      handleUpdateStep(idx, "description", e.target.value)
                    }
                    placeholder="Deskripsi langkah..."
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-[#2563eb] transition resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BROSUR RESMI SPMB */}
      {activeTab === "brosur" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Brosur Resmi SPMB {data.academicYear}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Brosur ini ditampilkan di halaman publik SPMB dan dapat diunduh oleh calon siswa atau orang tua.
              </p>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 self-start sm:self-auto">
              Format: JPG / PNG / WEBP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Visual Preview Brosur */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
              <div className="relative aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 shadow-md group">
                <Image
                  src={data.brochureUrl || "/images/spmb-brochure.jpg"}
                  alt="Brosur Resmi SPMB"
                  fill
                  sizes="320px"
                  className="object-cover transition duration-300 group-hover:scale-102"
                />

                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2.5 p-4 text-white">
                  <button
                    type="button"
                    onClick={() => setPreviewBrochureOpen(true)}
                    className="rounded-lg bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-semibold hover:bg-white hover:text-slate-900 transition flex items-center gap-1.5"
                  >
                    <span>🔍 Lihat Ukuran Penuh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-[#2563eb] px-3.5 py-2 text-xs font-semibold hover:bg-[#1d4ed8] transition flex items-center gap-1.5"
                  >
                    <span>📤 Unggah Brosur Baru</span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewBrochureOpen(true)}
                className="mt-2.5 text-xs font-bold text-[#2563eb] hover:underline"
              >
                Klik untuk memperbesar gambar
              </button>
            </div>

            {/* Informasi File & Aksi Upload */}
            <div className="md:col-span-7 lg:col-span-8 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Informasi Berkas Brosur Aktif
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-white p-3 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Nama File</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">
                      {data.brochureFileName || "Brosur-SPMB.jpg"}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Tanggal Pembaruan</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {data.brochureUploadedAt || "2026-10-20"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Area Aksi Unggah */}
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Unggah Brosur SPMB Terbaru
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mendukung file format JPG, PNG, atau WEBP dengan resolusi tinggi (maksimal 5MB).
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleBrochureUpload}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1d4ed8] transition"
                  >
                    Pilih Berkas Dari Komputer
                  </button>

                  <a
                    href={data.brochureUrl || "/images/spmb-brochure.jpg"}
                    download={data.brochureFileName || "Brosur-SPMB-Widya-Darma.jpg"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Unduh Berkas Ini
                  </a>

                  <button
                    type="button"
                    onClick={handleResetBrochure}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Kembalikan ke Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Pratinjau Brosur Ukuran Penuh */}
      {previewBrochureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setPreviewBrochureOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl w-full max-h-[90vh] flex flex-col items-center bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Pratinjau Brosur Resmi SPMB
                </h4>
                <p className="text-[11px] text-slate-400">
                  {data.brochureFileName || "Brosur-SPMB.jpg"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={data.brochureUrl || "/images/spmb-brochure.jpg"}
                  download={data.brochureFileName || "Brosur-SPMB-Widya-Darma.jpg"}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-[#2563eb] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#1d4ed8] transition"
                >
                  Unduh Brosur
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewBrochureOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                  aria-label="Tutup pratinjau brosur"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-auto p-4 max-h-[75vh] w-full flex justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shadow-md">
                <Image
                  src={data.brochureUrl || "/images/spmb-brochure.jpg"}
                  alt="Brosur Resmi SPMB"
                  fill
                  sizes="600px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
