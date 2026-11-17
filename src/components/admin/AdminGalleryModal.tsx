"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GalleryActivity, GalleryPhoto, CropConfig } from "@/types/gallery";

interface AdminGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: GalleryActivity) => void;
  onDelete?: (id: string) => void;
  initialData?: GalleryActivity | null;
  initialCategory?: string;
}

const DEFAULT_CATEGORIES = [
  "Kreativitas & Seni",
  "Jurnal Karya",
  "Prestasi Akademik",
  "Kegiatan Sosial",
  "Ekstrakurikuler",
  "Pramuka & Olahraga",
];

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function toDateInputValue(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const match = value.match(/^(\d{1,2})\s+([^\s]+)\s+(\d{4})$/);
  if (!match) return "";

  const month = INDONESIAN_MONTHS.findIndex(
    (item) => item.toLowerCase() === match[2].toLowerCase(),
  );
  if (month < 0) return "";

  return `${match[3]}-${String(month + 1).padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function formatEventDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;

  return `${match[3]} ${INDONESIAN_MONTHS[Number(match[2]) - 1]} ${match[1]}`;
}

function toLocalDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return new Date();

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminGalleryModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  initialCategory = "Kreativitas & Seni",
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isActivityDeleteOpen, setIsActivityDeleteOpen] = useState(false);
  const [photoPendingDeletion, setPhotoPendingDeletion] = useState<string | null>(null);
  const [pendingDate, setPendingDate] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

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
      setDate(toDateInputValue(initialData.date || ""));
      setAuthorName(initialData.authorName || "");
      setCategory(initialData.category || "Kreativitas & Seni");
      setContent(initialData.content || "");
      const sortedPhotos = [...(initialData.photos || [])].sort(
        (a, b) => a.order - b.order,
      );
      setPhotos(sortedPhotos);
      setCoverPhotoId(initialData.coverPhotoId || (sortedPhotos[0]?.id ?? ""));
      setCropConfig(initialData.cropConfig || { zoom: 1.0, x: 0, y: 0 });
      setStatus(initialData.status || "Terbit");
    } else {
      // New Activity Defaults
      setTitle("");
      setSlug("");
      setDate(new Date().toISOString().slice(0, 10));
      setAuthorName("");
      setCategory(initialCategory);
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
    setIsActivityDeleteOpen(false);
    setPhotoPendingDeletion(null);
  }, [initialData, initialCategory, isOpen]);

  if (!isOpen) return null;

  // Handle title change & auto slug creation if slug hasn't been manually customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const openDatePicker = () => {
    const selectedDate = date ? toLocalDate(date) : new Date();
    setPendingDate(date || toDateValue(selectedDate));
    setCalendarMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
    setIsDatePickerOpen(true);
  };

  const calendarDays = (() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const day = index - firstWeekday + 1;
      return day > 0 && day <= daysInMonth ? new Date(year, month, day) : null;
    });
  })();

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
      Math.min(50, initialCropPos.current.x + deltaX * sensitivity),
    );
    const newY = Math.max(
      -50,
      Math.min(50, initialCropPos.current.y + deltaY * sensitivity),
    );

    setCropConfig((prev) => ({
      ...prev,
      x: Math.round(newX),
      y: Math.round(newY),
    }));
  };

  const handleMouseUpCrop = () => {
    setIsDraggingImage(false);
  };

  const handleDeleteActivity = () => {
    if (!initialData || !onDelete) return;
    setIsActivityDeleteOpen(true);
  };

  const confirmDeleteActivity = () => {
    if (!initialData || !onDelete) return;
    onDelete(initialData.id);
    setIsActivityDeleteOpen(false);
    onClose();
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
      date: formatEventDate(date.trim()),
      authorName: authorName.trim(), // REQUIRED authorName
      category,
      content: content.trim(),
      photos: photos.map((p, idx) => ({ ...p, order: idx + 1 })),
      coverPhotoId: currentCover ? currentCover.id : photos[0]?.id || "",
      cropConfig,
      status,
      createdAt:
        initialData?.createdAt || new Date().toISOString().split("T")[0],
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
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">
            {initialData ? "Edit Galeri Kegiatan" : "Tambah Kegiatan Baru"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto p-6"
        >
          <div className="mx-auto w-full max-w-2xl space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Judul Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul kegiatan"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Tanggal Kegiatan <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={openDatePicker}
                className="mt-1 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-left text-sm text-slate-800 transition hover:border-primary/50 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                <span>{date ? formatEventDate(date) : "Pilih tanggal"}</span>
                <span className="text-base leading-none text-slate-400">⌄</span>
              </button>
              {errors.date && (
                <p className="mt-1 text-xs text-rose-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Nama Penulis <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Masukkan nama penulis"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
              {errors.authorName && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.authorName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Kategori Kegiatan
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
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
                Caption Kegiatan
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Masukkan caption kegiatan"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <section className="border-t border-slate-200 pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-800">Edit Foto</h3>
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
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-primary-dark"
                >
                  + Upload Foto
                </button>
              </div>
              {errors.photos && (
                <p className="mt-2 text-xs text-rose-500">{errors.photos}</p>
              )}

              {/* Photos Sequence List */}
              <div className="mt-1 space-y-2 max-h-60 overflow-y-auto pr-1">
                {photos.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-xs text-slate-400">
                    Belum ada foto.
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
                            onClick={() => setPhotoPendingDeletion(photo.id)}
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
            </section>

            {photos.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Atur Foto Sampul
                  </span>
                  <button
                    type="button"
                    onClick={() => setCropConfig({ zoom: 1.0, x: 0, y: 0 })}
                    className="text-xs text-slate-300 underline hover:text-white"
                  >
                    Reset Crop
                  </button>
                </div>

                <div
                  onMouseDown={handleMouseDownCrop}
                  onMouseMove={handleMouseMoveCrop}
                  onMouseUp={handleMouseUpCrop}
                  onMouseLeave={handleMouseUpCrop}
                  className="relative mx-auto mt-4 aspect-[3/4] w-48 overflow-hidden rounded-xl bg-slate-950 border-2 border-dashed border-amber-400/80 shadow-inner cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    src={selectedCoverPhoto}
                    alt="Preview Crop Sampul"
                    className="h-full w-full object-cover transition-transform duration-75 origin-center pointer-events-none"
                    style={{
                      transform: `scale(${cropConfig.zoom}) translate(${cropConfig.x}%, ${cropConfig.y}%)`,
                    }}
                  />
                </div>

                <div className="mt-4 space-y-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/50">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Zoom / Perbesaran</span>
                      <span className="font-mono text-amber-400">
                        {cropConfig.zoom.toFixed(2)}x
                      </span>
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

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300">
                        <span>Geser Horisontal (X)</span>
                        <span className="font-mono text-amber-400">
                          {cropConfig.x}%
                        </span>
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
                        <span className="font-mono text-amber-400">
                          {cropConfig.y}%
                        </span>
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
              </section>
            )}
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 bg-white sticky bottom-0">
            <span className="text-xs text-slate-500">{photos.length} Foto</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              {initialData && onDelete && (
                <button
                  type="button"
                  onClick={handleDeleteActivity}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                >
                  Hapus
                </button>
              )}
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>

      {isDatePickerOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setIsDatePickerOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="date-picker-title"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3
                id="date-picker-title"
                className="text-lg font-bold text-slate-900"
              >
                Pilih Tanggal
              </h3>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                Tutup
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() - 1,
                          1,
                        ),
                    )
                  }
                  aria-label="Bulan sebelumnya"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-primary/40 hover:text-primary"
                >
                  ←
                </button>
                <span className="text-sm font-bold text-slate-800">
                  {INDONESIAN_MONTHS[calendarMonth.getMonth()]}{" "}
                  {calendarMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + 1,
                          1,
                        ),
                    )
                  }
                  aria-label="Bulan berikutnya"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-primary/40 hover:text-primary"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                  (day) => (
                    <span
                      key={day}
                      className={day === "Min" ? "text-rose-500" : ""}
                    >
                      {day}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-3 grid grid-cols-7 gap-y-1">
                {calendarDays.map((calendarDate, index) => {
                  if (!calendarDate) return <span key={`empty-${index}`} />;

                  const value = toDateValue(calendarDate);
                  const isSelected = value === pendingDate;
                  const isToday = value === toDateValue(new Date());

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPendingDate(value)}
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : isToday
                            ? "border border-primary/40 text-primary"
                            : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {calendarDate.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setDate(pendingDate);
                  setIsDatePickerOpen(false);
                }}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Pilih Tanggal
              </button>
            </div>
          </div>
        </div>
      )}

      {isActivityDeleteOpen && initialData && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Tutup konfirmasi hapus publikasi"
            onClick={() => setIsActivityDeleteOpen(false)}
            className="absolute inset-0 cursor-default"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Hapus publikasi?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Anda yakin ingin menghapus &ldquo;{initialData.title}&rdquo;?
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsActivityDeleteOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteActivity}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {photoPendingDeletion && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Tutup konfirmasi hapus foto"
            onClick={() => setPhotoPendingDeletion(null)}
            className="absolute inset-0 cursor-default"
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Hapus foto?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Anda yakin ingin menghapus foto ini dari publikasi?
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setPhotoPendingDeletion(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeletePhoto(photoPendingDeletion);
                  setPhotoPendingDeletion(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
