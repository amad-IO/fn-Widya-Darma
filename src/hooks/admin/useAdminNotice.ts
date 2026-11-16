"use client";

import { useCallback, useState } from "react";

export function useAdminNotice() {
  const [notice, setNotice] = useState("");

  const clearNotice = useCallback(() => setNotice(""), []);

  return {
    notice,
    setNotice,
    clearNotice,
  };
}
