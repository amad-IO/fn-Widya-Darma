"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  collageSlotTitle,
  collageTextKey,
  defaultCollageSlots,
  defaultCollageText,
  parseCollageText,
  type CollageSlot,
  type CollageText,
} from "@/lib/collage-settings";
import { fetchAll, mediaUrl, type GalleryRecord } from "@/lib/gallery-api";

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
  const [slots, setSlots] = useState(defaultCollageSlots);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLoading(true);
    setError("");
    fetchAll<GalleryRecord>("/api/content/galleries", false)
      .then((records) => {
        if (!active) return;
        setSlots(
          defaultCollageSlots.map((slot) => {
            const record = records.find(
              (record) =>
                !record.news_id && record.title === collageSlotTitle(slot.id),
            );
            return record
              ? {
                  ...slot,
                  backendId: record.gallery_id,
                  image: mediaUrl(record.image_url),
                }
              : slot;
          }),
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
  return { slots, loading, error, reload, updateSlot };
}
