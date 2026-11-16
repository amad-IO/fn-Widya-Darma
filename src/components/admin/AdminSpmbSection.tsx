"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SpmbInfo, SpmbStep, SpmbWave } from "@/types/spmb";
import { getStoredSpmbInfo, saveStoredSpmbInfo } from "@/lib/spmb-data";
import { cn } from "@/lib/utils";

interface AdminSpmbSectionProps {
  onNotify?: (message: string) => void;
}

type SpmbTab = "umum" | "gelombang" | "syarat-alur" | "brosur";

const tabs: { id: SpmbTab; label: string }[] = [
  { id: "umum", label: "Informasi pokok" },
  { id: "gelombang", label: "Jadwal gelombang" },
  { id: "syarat-alur", label: "Syarat & alur" },
  { id: "brosur", label: "Brosur resmi" },
];

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#31529a] focus:ring-2 focus:ring-[#31529a]/10";

export default function AdminSpmbSection({ onNotify }: AdminSpmbSectionProps) {
  const [data, setData] = useState<SpmbInfo>(getStoredSpmbInfo());
  const [activeTab, setActiveTab] = useState<SpmbTab>("umum");
  const [isSaved, setIsSaved] = useState(false);
  const [previewBrochureOpen, setPreviewBrochureOpen] = useState(false);
  const [editingWaveIndex, setEditingWaveIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setData(getStoredSpmbInfo());

    const handleUpdate = (event: Event) => {
      const nextData = (event as CustomEvent<SpmbInfo>).detail;
      if (nextData) setData(nextData);
    };

    window.addEventListener("widya_darma_spmb_updated", handleUpdate);
    return () =>
      window.removeEventListener("widya_darma_spmb_updated", handleUpdate);
  }, []);

  const handleSave = () => {
    saveStoredSpmbInfo(data);
    setIsSaved(true);
    onNotify?.("Pengaturan SPMB berhasil disimpan.");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleBrochureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated: SpmbInfo = {
        ...data,
        brochureUrl: reader.result as string,
        brochureFileName: file.name,
        brochureUploadedAt: new Date().toISOString().split("T")[0],
      };
      setData(updated);
      saveStoredSpmbInfo(updated);
      onNotify?.(`Brosur SPMB "${file.name}" berhasil diunggah.`);
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
    onNotify?.("Brosur dikembalikan ke versi resmi default.");
  };

  const handleUpdateWave = (index: number, fields: Partial<SpmbWave>) => {
    const waves = [...data.waves];
    waves[index] = { ...waves[index], ...fields };
    setData({ ...data, waves });
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
    setEditingWaveIndex(data.waves.length);
  };

  const handleDeleteWave = (id: string) => {
    if (confirm("Hapus gelombang pendaftaran ini?")) {
      setData({ ...data, waves: data.waves.filter((wave) => wave.id !== id) });
      setEditingWaveIndex(null);
    }
  };

  const handleUpdateReq = (index: number, value: string) => {
    const requirements = [...data.requirements];
    requirements[index] = value;
    setData({ ...data, requirements });
  };

  const handleAddReq = () =>
    setData({
      ...data,
      requirements: [...data.requirements, "Dokumen persyaratan tambahan baru"],
    });

  const handleDeleteReq = (index: number) =>
    setData({
      ...data,
      requirements: data.requirements.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    });

  const handleUpdateStep = (
    index: number,
    field: keyof SpmbStep,
    value: string | number,
  ) => {
    const steps = [...data.steps];
    steps[index] = { ...steps[index], [field]: value };
    setData({ ...data, steps });
  };

  const editingWave =
    editingWaveIndex === null ? null : data.waves[editingWaveIndex];

  return (
    <section className="space-y-5">
      <header className="space-y-3">
        <nav
          aria-label="Bagian pengelolaan SPMB"
          className="grid grid-cols-2 gap-1.5 rounded-2xl bg-gradient-to-r from-[#07528c] via-[#0b639f] to-[#07528c] p-1.5 shadow-sm sm:grid-cols-4"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                activeTab === tab.id
                  ? "bg-white text-[#31529a] shadow-sm"
                  : "text-white/80 hover:bg-white/12 hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === "umum" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">
              Informasi pokok & kontak
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Pengaturan yang akan tampil di halaman pendaftaran publik.
            </p>
          </div>

          <div className="max-w-3xl space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Tahun pelajaran
              </label>
              <input
                type="text"
                value={data.academicYear}
                onChange={(event) =>
                  setData({ ...data, academicYear: event.target.value })
                }
                placeholder="2026/2027"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status penerimaan
              </label>
              <select
                value={data.status}
                onChange={(event) =>
                  setData({
                    ...data,
                    status: event.target.value as SpmbInfo["status"],
                  })
                }
                className={fieldClass}
              >
                <option value="Buka">Buka (pendaftaran aktif)</option>
                <option value="Segera Dibuka">Segera dibuka</option>
                <option value="Ditutup">Ditutup</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Judul utama
              </label>
              <input
                type="text"
                value={data.headline}
                onChange={(event) =>
                  setData({ ...data, headline: event.target.value })
                }
                placeholder="Penerimaan Siswa Baru (SPMB)"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Slogan / sambutan
              </label>
              <input
                type="text"
                value={data.subheadline}
                onChange={(event) =>
                  setData({ ...data, subheadline: event.target.value })
                }
                placeholder="Bergabunglah bersama keluarga besar SMA Widya Darma"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Biaya formulir
              </label>
              <input
                type="text"
                value={data.registrationFee}
                onChange={(event) =>
                  setData({ ...data, registrationFee: event.target.value })
                }
                placeholder="Rp 250.000"
                className={fieldClass}
              />
            </div>
            <div className="border-t border-slate-100 pt-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                WhatsApp panitia
              </label>
              <input
                type="tel"
                value={data.contactPhone}
                onChange={(event) =>
                  setData({ ...data, contactPhone: event.target.value })
                }
                placeholder="+62 812-3456-7890"
                className={fieldClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email informasi SPMB
              </label>
              <input
                type="email"
                value={data.contactEmail}
                onChange={(event) =>
                  setData({ ...data, contactEmail: event.target.value })
                }
                placeholder="spmb@widyadarma.sch.id"
                className={fieldClass}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "gelombang" && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Jadwal gelombang
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Tampilkan ringkasan terlebih dahulu; buka detail hanya saat
                ingin mengubahnya.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddWave}
              className="self-start rounded-lg bg-[#31529a] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#26437f] sm:self-auto"
            >
              + Tambah gelombang
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 sm:px-7">Gelombang</th>
                  <th className="px-5 py-3.5">Periode</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Kuota</th>
                  <th className="px-5 py-3.5 text-right sm:px-7"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.waves.map((wave, index) => (
                  <tr
                    key={wave.id || index}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900 sm:px-7">
                      {wave.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{wave.period}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          wave.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-700"
                            : wave.status === "Segera Dibuka"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {wave.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{wave.quota}</td>
                    <td className="px-5 py-4 text-right sm:px-7">
                      <button
                        type="button"
                        onClick={() => setEditingWaveIndex(index)}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-[#31529a] transition hover:bg-blue-50"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "syarat-alur" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="grid gap-8 xl:grid-cols-2 xl:gap-10">
            <section>
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Persyaratan berkas
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Dokumen yang perlu dibawa calon siswa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddReq}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-[#31529a] transition hover:bg-blue-50"
                >
                  + Tambah
                </button>
              </div>
              <ol className="mt-3 divide-y divide-slate-100">
                {data.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-3 py-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-[#31529a]">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      value={requirement}
                      onChange={(event) =>
                        handleUpdateReq(index, event.target.value)
                      }
                      className="min-w-0 flex-1 border-0 bg-transparent px-0 py-1 text-sm text-slate-800 outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteReq(index)}
                      aria-label="Hapus persyaratan"
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-semibold text-slate-900">
                  Alur pendaftaran
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Urutan yang ditampilkan kepada calon siswa.
                </p>
              </div>
              <ol className="mt-3 divide-y divide-slate-100">
                {data.steps.map((step, index) => (
                  <li key={step.step} className="flex gap-3 py-3.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#31529a] text-xs font-semibold text-white">
                      {step.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(event) =>
                          handleUpdateStep(index, "title", event.target.value)
                        }
                        placeholder="Judul tahapan"
                        className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-800 outline-none focus:ring-0"
                      />
                      <textarea
                        rows={2}
                        value={step.description}
                        onChange={(event) =>
                          handleUpdateStep(
                            index,
                            "description",
                            event.target.value,
                          )
                        }
                        placeholder="Keterangan tahapan"
                        className="mt-1 w-full resize-none border-0 bg-transparent p-0 text-sm leading-6 text-slate-500 outline-none focus:ring-0"
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      )}

      {activeTab === "brosur" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="w-full shrink-0 md:w-56">
              <button
                type="button"
                onClick={() => setPreviewBrochureOpen(true)}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100"
              >
                <Image
                  src={data.brochureUrl || "/images/spmb-brochure.jpg"}
                  alt="Brosur Resmi SPMB"
                  fill
                  sizes="224px"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/65 px-3 py-2 text-center text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                  Lihat ukuran penuh
                </span>
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-slate-900">
                Brosur resmi SPMB
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                File ini tampil di halaman publik dan dapat diunduh oleh calon
                siswa atau orang tua.
              </p>

              <dl className="mt-5 grid gap-4 border-y border-slate-100 py-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Nama file</dt>
                  <dd className="mt-1 truncate font-medium text-slate-800">
                    {data.brochureFileName || "Brosur-SPMB.jpg"}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Terakhir diperbarui</dt>
                  <dd className="mt-1 font-medium text-slate-800">
                    {data.brochureUploadedAt || "2026-10-20"}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-700">
                  Ganti brosur
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 5 MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleBrochureUpload}
                  className="hidden"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-[#31529a] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#26437f]"
                  >
                    Pilih file
                  </button>
                  <a
                    href={data.brochureUrl || "/images/spmb-brochure.jpg"}
                    download={
                      data.brochureFileName || "Brosur-SPMB-Widya-Darma.jpg"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Unduh
                  </a>
                  <button
                    type="button"
                    onClick={handleResetBrochure}
                    className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    Kembalikan default
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 flex justify-center border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "w-full rounded-lg px-5 py-3 text-sm font-semibold text-white transition sm:w-72",
                isSaved
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-[#07528c] hover:bg-[#063b68]",
              )}
            >
              {isSaved ? "Perubahan tersimpan" : "Simpan semua perubahan"}
            </button>
          </div>
        </div>
      )}

      {editingWave && editingWaveIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Tutup editor gelombang"
            className="absolute inset-0 cursor-default"
            onClick={() => setEditingWaveIndex(null)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Edit gelombang
                </h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  Perbarui detail jadwal pendaftaran.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingWaveIndex(null)}
                aria-label="Tutup editor"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nama gelombang
                </label>
                <input
                  type="text"
                  value={editingWave.name}
                  onChange={(event) =>
                    handleUpdateWave(editingWaveIndex, {
                      name: event.target.value,
                    })
                  }
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Periode
                </label>
                <input
                  type="text"
                  value={editingWave.period}
                  onChange={(event) =>
                    handleUpdateWave(editingWaveIndex, {
                      period: event.target.value,
                    })
                  }
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={editingWave.status}
                  onChange={(event) =>
                    handleUpdateWave(editingWaveIndex, {
                      status: event.target.value as SpmbWave["status"],
                    })
                  }
                  className={fieldClass}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Segera Dibuka">Segera dibuka</option>
                  <option value="Ditutup">Ditutup</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Kuota
                </label>
                <input
                  type="text"
                  value={editingWave.quota}
                  onChange={(event) =>
                    handleUpdateWave(editingWaveIndex, {
                      quota: event.target.value,
                    })
                  }
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Potongan / beasiswa
                </label>
                <input
                  type="text"
                  value={editingWave.discount || ""}
                  onChange={(event) =>
                    handleUpdateWave(editingWaveIndex, {
                      discount: event.target.value,
                    })
                  }
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => handleDeleteWave(editingWave.id)}
                className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
              >
                Hapus gelombang
              </button>
              <button
                type="button"
                onClick={() => setEditingWaveIndex(null)}
                className="rounded-lg bg-[#31529a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#26437f]"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {previewBrochureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm sm:p-6">
          <button
            type="button"
            aria-label="Tutup pratinjau brosur"
            className="absolute inset-0 cursor-default"
            onClick={() => setPreviewBrochureOpen(false)}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Pratinjau brosur
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {data.brochureFileName || "Brosur-SPMB.jpg"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewBrochureOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>
            <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-slate-50 p-5">
              <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-white shadow-sm">
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
    </section>
  );
}
