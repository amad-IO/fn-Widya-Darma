"use client";

import { useCallback, useEffect, useState } from "react";
import {
  apiRequest,
  fetchAll,
  fromNews,
  saveNews,
  type NewsRecord,
  type SaveStage,
} from "@/lib/gallery-api";
import type { GalleryActivity } from "@/types/gallery";

export function useAdminGallery() {
  const [activities, setActivities] = useState<GalleryActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchAll<NewsRecord>("/api/admin/news")
      .then((records) => {
        if (active) setActivities(records.map(fromNews));
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
  }, [revision]);
  const saveActivity = useCallback(
    async (activity: GalleryActivity, onStage: (stage: SaveStage) => void) => {
      const saved = await saveNews(activity, onStage);
      setActivities((current) =>
        current.some((item) => item.id === saved.id)
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...current],
      );
      window.dispatchEvent(new Event("gallery-collage-updated"));
      return saved;
    },
    [],
  );
  const removeActivity = useCallback(async (id: string) => {
    await apiRequest(`/api/admin/news/${id}`, { method: "DELETE" });
    setActivities((current) =>
      current.filter((activity) => activity.id !== id),
    );
    window.dispatchEvent(new Event("gallery-collage-updated"));
  }, []);
  return { activities, saveActivity, removeActivity, loading, error, reload };
}
