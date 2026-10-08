import { cn } from "@/lib/utils";

export default function SectionLabel({
  number,
  children,
  className,
}: {
  number?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.16em] text-primary sm:text-xs",
        className,
      )}
    >
      {number && <span className="text-primary/40">{number}</span>}
      <span className="h-px w-6 bg-current opacity-40" aria-hidden="true" />
      {children}
    </p>
  );
}
