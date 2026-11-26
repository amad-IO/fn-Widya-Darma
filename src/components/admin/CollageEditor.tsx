"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PublicationMosaic } from "@/components/shared/PublicationGrid";
import { useCollage } from "@/hooks/useCollage";
import {
  type CollageSlot,
  type CollageText,
} from "@/lib/collage-settings";
import { cropBlob, cropGeometry, decodePhoto } from "@/lib/image-crop";
import {
  apiRequest,
  mediaUrl,
  uploadPhoto,
  saveStageLabels,
  type GalleryRecord,
  type SaveStage,
} from "@/lib/gallery-api";
import type { CropConfig } from "@/types/gallery";
import SaveFeedback from "./SaveFeedback";

const buttonClass =
  "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60";

export default function CollageEditor() {
  const { slots, loading, error, reload, updateSlot } = useCollage();
  const [photo, setPhoto] = useState<CollageSlot | null>(null);
  const [notice, setNotice] = useState("");
  return (
    <section
      aria-labelledby="collage-preview-heading"
      className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-7"
    >
      <div className="mb-6 text-center">
        <h3
          id="collage-preview-heading"
          className="text-lg font-semibold text-primary"
        >
          Kolase foto & teks
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Gunakan ikon pensil untuk mengatur foto atau teks secara terpisah.
        </p>
      </div>
      {loading && (
        <SaveFeedback stage="preparing" message="Memuat foto kolase…" />
      )}
      {error && (
        <div className="mb-4">
          <SaveFeedback stage="error" error={error} />
          <button
            type="button"
            onClick={reload}
            className="mt-2 text-sm font-semibold text-primary"
          >
            Muat ulang foto
          </button>
        </div>
      )}
      {notice && (
        <div className="mb-4">
          <SaveFeedback stage="success" message={notice} />
        </div>
      )}
      <PublicationMosaic
        compact
        slots={slots}
        onEditPhoto={
          !loading && !error
            ? (slot) => {
                if (!slot.backendId) return;
                setNotice("");
                setPhoto(slot);
              }
            : undefined
        }
      />
      {photo && (
        <CollagePhotoEditor
          key={photo.id}
          slot={photo}
          onClose={() => setPhoto(null)}
          onSaved={(slot) => {
            updateSlot(slot);
            setPhoto(null);
            setNotice("Foto kolase berhasil disimpan ke backend.");
          }}
        />
      )}
    </section>
  );
}

function CollagePhotoEditor({
  slot,
  onClose,
  onSaved,
}: {
  slot: CollageSlot;
  onClose: () => void;
  onSaved: (slot: CollageSlot) => void;
}) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<CropConfig>({ zoom: 1, x: 0, y: 0 });
  const [stage, setStage] = useState<SaveStage>("preparing");
  const [error, setError] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const busy = ["preparing", "uploading", "saving"].includes(stage);
  useEffect(() => {
    let active = true;
    fetch(slot.image)
      .then((response) => {
        if (!response.ok) throw new Error("Foto tidak dapat dimuat.");
        return response.blob();
      })
      .then(async (blob) => {
        const image = await decodePhoto(blob);
        if (active) {
          setBlob(blob);
          setImage(image);
          setStage("idle");
        }
      })
      .catch((error: Error) => {
        if (active) {
          setError(error.message);
          setStage("error");
        }
      });
    return () => {
      active = false;
    };
  }, [slot.image]);
  useEffect(() => {
    const target = canvas.current;
    const context = target?.getContext("2d");
    if (!target || !context || !image) return;
    target.width = 420;
    target.height = Math.round(420 / slot.aspect);
    const rect = cropGeometry(
      image.naturalWidth,
      image.naturalHeight,
      target.width,
      target.height,
      crop,
    );
    context.clearRect(0, 0, target.width, target.height);
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  }, [image, crop, slot.aspect]);
  async function selectFile(file?: File) {
    if (!file) return;
    setError("");
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      ) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Gunakan JPG, PNG, WebP, atau GIF, maksimal 5 MB.");
      return;
    }
    setStage("preparing");
    try {
      setImage(await decodePhoto(file));
      setBlob(file);
      setCrop({ zoom: 1, x: 0, y: 0 });
      setStage("idle");
    } catch (error) {
      setError((error as Error).message);
      setStage("error");
    }
  }
  async function save() {
    if (!blob || busy || !slot.backendId) return;
    setError("");
    try {
      setStage("preparing");
      const cropped = await cropBlob(blob, crop, slot.aspect);
      setStage("uploading");
      const path = await uploadPhoto(cropped, "collage");
      setStage("saving");
      const record = await apiRequest<GalleryRecord>(
        `/api/admin/galleries/${slot.backendId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: path,
          }),
        },
      );
      if (slot.newsId && slot.isCover) {
        await apiRequest(`/api/admin/news/${slot.newsId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: path }),
        });
      }
      onSaved({
        ...slot,
        image: mediaUrl(record.image_url),
        backendId: record.gallery_id,
      });
    } catch (error) {
      setError((error as Error).message);
      setStage("error");
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-title"
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 sm:p-7"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="crop-title" className="text-xl font-semibold">
            Atur foto kolase {slot.id + 1}
          </h2>
          <button
            aria-label="Tutup editor foto"
            type="button"
            disabled={busy}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <div className="mb-5 flex justify-center rounded-2xl bg-slate-100 p-3">
          <canvas
            ref={canvas}
            aria-label="Pratinjau hasil crop"
            className="max-h-[42dvh] max-w-full rounded-xl object-contain"
          />
        </div>
        <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
          <label className="block text-sm font-medium">
            Ganti foto
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => {
                void selectFile(event.target.files?.[0]);
                event.target.value = "";
              }}
              className="mt-2 block w-full text-sm"
            />
          </label>
          {(
            [
              ["zoom", "Zoom", 1, 3, 0.01],
              ["x", "Posisi horizontal", -100, 100, 1],
              ["y", "Posisi vertikal", -100, 100, 1],
            ] as const
          ).map(([key, label, min, max, step]) => (
            <label key={key} className="block text-sm font-medium">
              {label}
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={crop[key]}
                onChange={(event) =>
                  setCrop((current) => ({
                    ...current,
                    [key]: Number(event.target.value),
                  }))
                }
                className="mt-2 block w-full accent-primary"
              />
            </label>
          ))}
          <button
            type="button"
            onClick={() => setCrop({ zoom: 1, x: 0, y: 0 })}
            className="text-sm font-semibold text-primary"
          >
            Reset crop
          </button>
        </fieldset>
        <div className="mt-5">
          <SaveFeedback stage={stage} error={error} />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="px-4 text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={busy || !blob}
            onClick={() => void save()}
            className={buttonClass}
          >
            {saveStageLabels[stage]}
          </button>
        </div>
      </section>
    </div>
  );
}

function CollageTextEditor({
  text,
  onSave,
  onClose,
}: {
  text: CollageText;
  onSave: (text: CollageText) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(text);
  const [error, setError] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="collage-text-title"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            onSave(draft);
          } catch {
            setError(
              "Teks belum tersimpan. Penyimpanan browser tidak tersedia.",
            );
          }
        }}
        className="max-h-[90dvh] w-full max-w-xl space-y-5 overflow-y-auto rounded-3xl bg-white p-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="collage-text-title" className="text-xl font-semibold">
            Edit teks kolase
          </h2>
          <button
            type="button"
            aria-label="Tutup editor teks"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        {(
          [
            ["label", "Label"],
            ["title", "Judul utama"],
            ["accent", "Teks penekanan"],
            ["description", "Kalimat pendukung"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm font-medium">
            {label}
            <input
              required
              maxLength={
                key === "label" ? 60 : key === "description" ? 160 : 100
              }
              value={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            />
          </label>
        ))}
        <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
          Teks sementara disimpan di browser ini. Backend belum menyediakan
          penyimpanan teks kolase untuk semua pengunjung.
        </p>
        {error && <SaveFeedback stage="error" error={error} />}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 text-sm">
            Batal
          </button>
          <button type="submit" className={buttonClass}>
            Simpan teks
          </button>
        </div>
      </form>
    </div>
  );
}
