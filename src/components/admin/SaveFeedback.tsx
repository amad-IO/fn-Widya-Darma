"use client";

import { CheckCircle2, LoaderCircle, CircleAlert } from "lucide-react";
import { saveStageLabels, type SaveStage } from "@/lib/gallery-api";

export default function SaveFeedback({
  stage,
  error = "",
  message,
}: {
  stage: SaveStage;
  error?: string;
  message?: string;
}) {
  if (stage === "idle" && !error) return null;
  const failed = !!error || stage === "error";
  const Icon = failed
    ? CircleAlert
    : stage === "success"
      ? CheckCircle2
      : LoaderCircle;
  return (
    <div
      role={failed ? "alert" : "status"}
      aria-live="polite"
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${failed ? "border-rose-200 bg-rose-50 text-rose-700" : stage === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-blue-200 bg-blue-50 text-primary"}`}
    >
      <Icon
        aria-hidden="true"
        size={18}
        className={`mt-0.5 shrink-0 ${!failed && stage !== "success" ? "animate-spin" : ""}`}
      />
      <span>{error || message || saveStageLabels[stage]}</span>
    </div>
  );
}
