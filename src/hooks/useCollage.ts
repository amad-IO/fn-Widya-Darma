"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  collageSlotAspects,
  collageTextKey,
  defaultCollageText,
  parseCollageText,
  type CollageSlot,
  type CollageText,
} from "@/lib/collage-settings";
import { fetchAll, mediaUrl, type NewsRecord } from "@/lib/gallery-api";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("collage-text-updated", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("collage-text-updated", onChange);
  };
}
function textSnapshot() {
  try {
    return localStorage.getItem(collageTextKey);
  } catch {
    return null;
  }
}

export function useCollageText() {
  const raw = useSyncExternalStore(subscribe, textSnapshot, () => null);
  const text = raw ? parseCollageText(raw) : defaultCollageText;
  function saveText(next: CollageText) {
    localStorage.setItem(collageTextKey, JSON.stringify(next));
    window.dispatchEvent(new Event("collage-text-updated"));
  }
  return { text, saveText };
}

export function useCollage(enabled = true) {
  const [slots, setSlots] = useState<CollageSlot[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const refreshAfterGalleryChange = () => reload();
    window.addEventListener("gallery-collage-updated", refreshAfterGalleryChange);
    return () => {
      window.removeEventListener(
        "gallery-collage-updated",
        refreshAfterGalleryChange,
      );
    };
  }, [reload]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    setError("");
    fetchAll<NewsRecord>("/api/content/news", false)
      .then((records) => {
        if (!active) return;
        const photos = records
          .flatMap((record) =>
            (record.galleries || []).map((photo) => ({
              ...photo,
              newsId: record.news_id,
              fallbackCaption: record.title,
            })),
          )
          .sort(
            (first, second) =>
              (first.collage_order ?? Number.MAX_SAFE_INTEGER) -
              (second.collage_order ?? Number.MAX_SAFE_INTEGER),
          );
        setSlots(
          photos.slice(0, collageSlotAspects.length).map((photo, index) => ({
            id: index,
            image: mediaUrl(photo.image_url),
            aspect: collageSlotAspects[index] || 1,
            backendId: photo.gallery_id,
            newsId: photo.newsId,
            isCover: photo.is_cover,
            caption: photo.caption || photo.fallbackCaption,
            collageOrder: photo.collage_order ?? undefined,
          })),
        );
      })
      .catch((error: Error) => {
        if (active) setError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled, revision]);
  function updateSlot(next: CollageSlot) {
    setSlots((current) =>
      current.map((slot) => (slot.id === next.id ? next : slot)),
    );
  }
  function replaceSlots(next: CollageSlot[]) {
    setSlots(next);
  }
  return { slots, loading, error, reload, updateSlot, replaceSlots };
}
