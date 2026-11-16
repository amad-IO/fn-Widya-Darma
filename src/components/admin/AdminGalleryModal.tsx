"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GalleryActivity, GalleryPhoto, CropConfig } from "@/types/gallery";

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: GalleryActivity) => void;
  initialData?: GalleryActivity | null;
}

const DEFAULT_CATEGORIES = [
  "Kreativitas & Seni",
  "Prestasi Akademik",
  "Kegiatan Sosial",
  "Ekstrakurikuler",
  "Pramuka & Olahraga",
];

export default function AdminGalleryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AdminGalleryModalProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [date, setDate] = useState("");
  const [authorName, setAuthorName] = useState(""); // MANDATORY field
  const [category, setCategory] = useState("Kreativitas & Seni");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [coverPhotoId, setCoverPhotoId] = useState<string>("");
  const [cropConfig, setCropConfig] = useState<CropConfig>({
    zoom: 1.0,
    x: 0,
    y: 0,
  });
  const [status, setStatus] = useState<"Terbit" | "Draf">("Terbit");

  // Errors & UI state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialCropPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to auto generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setDate(initialData.date || "");
      setAuthorName(initialData.authorName || "");
      setCategory(initialData.category || "Kreativitas & Seni");
      setContent(initialData.content || "");
      const sortedPhotos = [...(initialData.photos || [])].sort(
        (a, b) => a.order - b.order
      );
      setPhotos(sortedPhotos);
      setCoverPhotoId(initialData.coverPhotoId || (sortedPhotos[0]?.id ?? ""));
      setCropConfig(
        initialData.cropConfig || { zoom: 1.0, x: 0, y: 0 }
      );
      setStatus(initialData.status || "Terbit");
    } else {
      // New Activity Defaults
      setTitle("");
      setSlug("");
      setDate(new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }));
      setAuthorName("");
      setCategory("Kreativitas & Seni");
      setContent("");
      const defaultPhotos: GalleryPhoto[] = [
        {
          id: `photo-${Date.now()}-1`,
          url: "/images/32.webp",
          caption: "Foto Sampul Utama",
          order: 1,
        },
        {
          id: `photo-${Date.now()}-2`,
          url: "/images/31.webp",
          caption: "Dokumentasi Kegiatan 2",
          order: 2,
        },
      ];
      setPhotos(defaultPhotos);
      setCoverPhotoId(defaultPhotos[0].id);
      setCropConfig({ zoom: 1.0, x: 0, y: 0 });
      setStatus("Terbit");
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle title change & auto slug creation if slug hasn't been manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  // Photo Management
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotosList: GalleryPhoto[] = [];
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: GalleryPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: event.target.result as string,
            caption: file.name.replace(/\.[^/.]+$/, ""),
            order: photos.length + newPhotosList.length + index + 1,
          };
          setPhotos((prev) => {
            const updated = [...prev, newPhoto];
            if (!coverPhotoId && updated.length === 1) {
              setCoverPhotoId(newPhoto.id);
            }
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSamplePhoto = (sampleUrl: string) => {
    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: sampleUrl,
      caption: "Foto Dokumentasi",
      order: photos.length + 1,
    };
    setPhotos((prev) => {
      const updated = [...prev, newPhoto];
      if (!coverPhotoId && updated.length === 1) {
        setCoverPhotoId(newPhoto.id);
      }
      return updated;
    });
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      const reordered = filtered.map((p, idx) => ({ ...p, order: idx + 1 }));
      if (coverPhotoId === id && reordered.length > 0) {
        setCoverPhotoId(reordered[0].id);
      }
      return reordered;
    });
  };

  const handleMovePhoto = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const updated = [...photos];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Re-assign order sequence
    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setPhotos(reordered);
  };

  // Interactive Mouse Drag Crop Position Adjuster
  const handleMouseDownCrop = (e: React.MouseEvent) => {
    setIsDraggingImage(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialCropPos.current = { x: cropConfig.x, y: cropConfig.y };
  };

  const handleMouseMoveCrop = (e: React.MouseEvent) => {
    if (!isDraggingImage) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    // Convert pixel delta to percentage offset
    const sensitivity = 0.25;
    const newX = Math.max(
      -50,
      Math.min(50, initialCropPos.current.x + deltaX * sensitivity)
    );
    const newY = Math.max(
      -50,
      Math.min(50, initialCropPos.current.y + deltaY * sensitivity)
    );

    setCropConfig((prev) => ({ ...prev, x: Math.round(newX), y: Math.round(newY) }));
  };

  const handleMouseUpCrop = () => {
    setIsDraggingImage(false);
  };

  // Form Validation & Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Judul kegiatan wajib diisi!";
    }
    if (!authorName.trim()) {
      newErrors.authorName = "Penulis / Penanggung Jawab Artikel wajib diisi!";
    }
    if (!date.trim()) {
      newErrors.date = "Tanggal kegiatan wajib diisi!";
    }
    if (photos.length === 0) {
      newErrors.photos = "Minimal 1 foto kegiatan harus diunggah!";
    }
    if (!coverPhotoId && photos.length > 0) {
      setCoverPhotoId(photos[0].id);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentCover = photos.find((p) => p.id === coverPhotoId) || photos[0];

    const savedActivity: GalleryActivity = {
      id: initialData?.id || `galeri-${Date.now()}`,
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      date: date.trim(),
      authorName: authorName.trim(), // REQUIRED authorName
      category,
      content: content.trim(),
      photos: photos.map((p, idx) => ({ ...p, order: idx + 1 })),
      coverPhotoId: currentCover ? currentCover.id : photos[0]?.id || "",
      cropConfig,
      status,
      createdAt: initialData?.createdAt || new Date().toISOString().split("T")[0],
    };

    onSave(savedActivity);
    onClose();
  };

  // Find active cover photo URL
  const selectedCoverPhoto =
    photos.find((p) => p.id === coverPhotoId)?.url ||
    photos[0]?.url ||
    "/images/32.webp";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Galeri Kegiatan" : "Tambah Kegiatan Baru"}
            </h2>
            <p className="text-xs text-slate-500">
              Kelola foto, penulis artikel, urutan, serta crop sampul 3:4 portrait.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Left Column: Form Controls (7 cols) */}
            <div className="space-y-6 lg:col-span-7">
              {/* Judul & Slug */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Judul Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Pentas Seni & Gelar Karya Siswa 2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Slug URL
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="pentas-seni-gelar-karya-2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-700 focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Tanggal Kegiatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="08 Oktober 2026"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-primary focus:outline-hidden"
                  />
                  {errors.date && (
                    <p className="mt-1 text-xs text-rose-500">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* MANDATORY Penulis / Penanggung Jawab Artikel */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4">
                <label className="block text-xs font-bold text-slate-900">
                  Penulis / Penanggung Jawab Artikel <span className="text-rose-600">* Wajib diisi</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  className="mt-1.5 w-full rounded-xl border border-amber-300/70 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-400/20"
                />
                {errors.authorName && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600">
                    ⚠️ {errors.authorName}
                  </p>
                )}
                <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                  💡 Nama orang yang bertanggung jawab atas isi artikel. Disimpan sebagai <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">authorName</code> dan ditampilkan pada detail halaman kegiatan (&ldquo;Ditulis oleh Budi Santoso&rdquo;). <strong className="text-amber-900 font-semibold">Tidak ditampilkan pada kartu galeri</strong> agar tampilan tetap sederhana.
                </p>
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Kategori Kegiatan
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-primary focus:outline-hidden"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Status Publikasi
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Terbit" | "Draf")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-primary focus:outline-hidden"
                  >
                    <option value="Terbit">Terbit (Publik)</option>
                    <option value="Draf">Draf (Internal)</option>
                  </select>
                </div>
              </div>

              {/* Artikel Singkat */}
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Artikel Singkat / Deskripsi Kegiatan
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan artikel atau ringkasan singkat kegiatan..."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Manajemen Foto & Urutan */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      Daftar Foto Kegiatan ({photos.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Atur urutan foto, pilih foto sampul, atau tambahkan foto baru.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-primary-dark transition"
                    >
                      + Upload Foto
                    </button>
                  </div>
                </div>

                {/* Sample Preset Photo Quick Adders */}
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-500">
                  <span>Tambah cepat foto contoh:</span>
                  {[
                    { label: "Siswa", url: "/images/32.webp" },
                    { label: "Kelas", url: "/images/31.webp" },
                    { label: "Perpustakaan", url: "/images/33.webp" },
                    { label: "Gedung", url: "/images/14.webp" },
                  ].map((s) => (
                    <button
                      key={s.url}
                      type="button"
                      onClick={() => handleAddSamplePhoto(s.url)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-600 hover:border-primary hover:text-primary transition"
                    >
                      + {s.label}
                    </button>
                  ))}
                </div>

                {errors.photos && (
                  <p className="mt-2 text-xs text-rose-500">{errors.photos}</p>
                )}

                {/* Photos Sequence List */}
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                  {photos.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-xs text-slate-400">
                      Belum ada foto. Silakan klik &ldquo;+ Upload Foto&rdquo; di atas.
                    </div>
                  ) : (
                    photos.map((photo, index) => {
                      const isCover = photo.id === coverPhotoId;
                      return (
                        <div
                          key={photo.id}
                          className={`flex items-center justify-between rounded-xl border p-2.5 transition ${
                            isCover
                              ? "border-primary/50 bg-primary/5 shadow-xs"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                              {index + 1}
                            </span>
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-200 border border-slate-200">
                              <Image
                                src={photo.url}
                                alt={photo.caption || `Foto ${index + 1}`}
                                fill
                                unoptimized={photo.url.startsWith("data:")}
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 truncate">
                              <p className="truncate text-xs font-semibold text-slate-800">
                                {photo.caption || `Foto Kegiatan #${index + 1}`}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setCoverPhotoId(photo.id)}
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition ${
                                    isCover
                                      ? "bg-primary text-white"
                                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                  }`}
                                >
                                  {isCover ? "★ Sampul Utama" : "Set Jadi Sampul"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Reorder & Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMovePhoto(index, "up")}
                              title="Pindahkan ke Atas"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={index === photos.length - 1}
                              onClick={() => handleMovePhoto(index, "down")}
                              title="Pindahkan ke Bawah"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id)}
                              title="Hapus Foto"
                              className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-xs text-rose-600 hover:bg-rose-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: 3:4 Cover Crop Editor & Live Preview (5 cols) */}
            <div className="space-y-6 lg:col-span-5">
              
              {/* 3:4 Cover Crop Editor Frame */}
              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide uppercase text-amber-400">
                    Editor Crop Sampul (Rasio 3:4)
                  </span>
                  <button
                    type="button"
                    onClick={() => setCropConfig({ zoom: 1.0, x: 0, y: 0 })}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Reset Crop
                  </button>
                </div>

                <p className="mt-1 text-[11px] text-slate-300">
                  Geser foto (drag/offset) dan atur zoom untuk menentukan fokus sampul 3:4 portrait.
                </p>

                {/* Interactive 3:4 Crop Frame */}
                <div
                  onMouseDown={handleMouseDownCrop}
                  onMouseMove={handleMouseMoveCrop}
                  onMouseUp={handleMouseUpCrop}
                  onMouseLeave={handleMouseUpCrop}
                  className="relative mx-auto mt-4 aspect-[3/4] w-48 overflow-hidden rounded-xl bg-slate-950 border-2 border-dashed border-amber-400/80 shadow-inner cursor-grab active:cursor-grabbing select-none group"
                >
                  <img
                    src={selectedCoverPhoto}
                    alt="Preview Crop Sampul"
                    className="h-full w-full object-cover transition-transform duration-75 origin-center pointer-events-none"
                    style={{
                      transform: `scale(${cropConfig.zoom}) translate(${cropConfig.x}%, ${cropConfig.y}%)`,
                    }}
                  />
                  {/* Grid Overlay for Composition */}
                  <div className="pointer-events-none absolute inset-0 border border-white/20">
                    <div className="h-full w-full grid grid-cols-3 grid-rows-3 border-white/10">
                      <div className="border-r border-b border-white/10" />
                      <div className="border-r border-b border-white/10" />
                      <div className="border-b border-white/10" />
                      <div className="border-r border-b border-white/10" />
                      <div className="border-r border-b border-white/10" />
                      <div className="border-b border-white/10" />
                      <div className="border-r border-white/10" />
                      <div className="border-r border-white/10" />
                      <div />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-mono text-amber-300 backdrop-blur-xs">
                    3:4 Portrait • Drag to Move
                  </span>
                </div>

                {/* Crop Precision Range Controls */}
                <div className="mt-4 space-y-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Zoom / Perbesaran</span>
                      <span className="font-mono text-amber-400">{cropConfig.zoom.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="3.0"
                      step="0.05"
                      value={cropConfig.zoom}
                      onChange={(e) =>
                        setCropConfig((prev) => ({
                          ...prev,
                          zoom: parseFloat(e.target.value),
                        }))
                      }
                      className="mt-1 w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Geser Horisontal (X)</span>
                        <span className="font-mono text-amber-400">{cropConfig.x}%</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={cropConfig.x}
                        onChange={(e) =>
                          setCropConfig((prev) => ({
                            ...prev,
                            x: parseInt(e.target.value, 10),
                          }))
                        }
                        className="mt-1 w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Geser Vertikal (Y)</span>
                        <span className="font-mono text-amber-400">{cropConfig.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={cropConfig.y}
                        onChange={(e) =>
                          setCropConfig((prev) => ({
                            ...prev,
                            y: parseInt(e.target.value, 10),
                          }))
                        }
                        className="mt-1 w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[10px] italic text-slate-400">
                  ✓ Foto asli tetap utuh untuk slider detail. Hanya parameter crop 3:4 yang disimpan.
                </p>
              </div>

              {/* Live Preview Kartu Galeri (Frontend Preview) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-800">
                    Preview Kartu Galeri (Hasil Crop 3:4)
                  </h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Live Preview
                  </span>
                </div>

                {/* Simulated Gallery Card Component */}
                <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                  {/* Card Image Container with 3:4 Aspect Ratio & Applied Crop */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                    <img
                      src={selectedCoverPhoto}
                      alt={title || "Preview Kartu"}
                      className="h-full w-full object-cover transition-transform duration-100"
                      style={{
                        transform: `scale(${cropConfig.zoom}) translate(${cropConfig.x}%, ${cropConfig.y}%)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Badge Category */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                        {category}
                      </span>
                    </div>

                    {/* Title & Date Overlay (NO AUTHOR NAME ON CARD) */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[10px] font-medium text-slate-300">
                        {date || "Tanggal Kegiatan"}
                      </p>
                      <h4 className="mt-1 text-sm font-bold leading-snug line-clamp-2 text-white">
                        {title || "Judul Kegiatan Galeri"}
                      </h4>
                    </div>
                  </div>

                  <div className="p-3 bg-white">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{photos.length} Foto Terlampir</span>
                      <span className="font-semibold text-primary">Lihat Detail →</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/60 p-2.5 text-[11px] text-blue-900">
                  ℹ️ <strong className="font-semibold">Konfirmasi Tampilan:</strong> Nama penulis (<code className="font-mono">{authorName || "Belum diisi"}</code>) disembunyikan dari kartu galeri sesuai rancangan minimalis.
                </div>
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 bg-white sticky bottom-0">
            <span className="text-xs text-slate-500">
              {photos.length} foto siap dipublikasikan
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition"
              >
                Simpan & Publikasikan Kegiatan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
