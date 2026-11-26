"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, type DashboardStats } from "@/lib/admin-api";

export function useAdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    setIsLoading(true);
    try {
      setStats(await adminApi<DashboardStats>("/dashboard/stats"));
    } catch {
      // Dashboard tetap bisa dipakai ketika backend sedang dimatikan.
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshStats();
  }, [refreshStats]);

  return { stats, isLoading, refreshStats };
}
