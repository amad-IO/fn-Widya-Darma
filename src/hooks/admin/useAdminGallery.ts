"use client";

import { useCallback, useState } from "react";
import { initialGalleryActivities } from "@/lib/gallery-data";
import type { GalleryActivity } from "@/types/gallery";

export function useAdminGallery() {
  const [activities, setActivities] = useState<GalleryActivity[]>(
    initialGalleryActivities,
  );

  const saveActivity = useCallback((activity: GalleryActivity) => {
    let didUpdate = false;
    setActivities((current) => {
      didUpdate = current.some((item) => item.id === activity.id);
      return didUpdate
        ? current.map((item) => (item.id === activity.id ? activity : item))
        : [activity, ...current];
    });
    return didUpdate;
  }, []);

  const removeActivity = useCallback((id: string) => {
    setActivities((current) =>
      current.filter((activity) => activity.id !== id),
    );
  }, []);

  return { activities, saveActivity, removeActivity };
}
