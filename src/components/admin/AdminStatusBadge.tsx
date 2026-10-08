import { cn } from "@/lib/utils";
import type { PublicationStatus } from "@/lib/admin-preview";

export default function StatusBadge({ status }: { status: PublicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium",
        {
          "bg-emerald-50 text-emerald-700": status === "Terbit",
          "bg-slate-100 text-slate-600": status === "Draf",
          "bg-amber-50 text-amber-700": status === "Dalam tinjauan",
        },
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
