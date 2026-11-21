"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAll, type NewsRecord } from "@/lib/gallery-api";
import { newsToPublication } from "@/lib/gallery-public";
import type { Publication } from "@/lib/school";

export function usePublicGallery() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchAll<NewsRecord>("/api/content/news", false)
      .then((records) => {
        if (active) setItems(records.map(newsToPublication));
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
  return { items, loading, error, reload };
}
