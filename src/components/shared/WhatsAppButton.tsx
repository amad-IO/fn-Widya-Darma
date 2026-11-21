"use client";

import { schoolContact } from "@/lib/school";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WhatsAppSymbol({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 7.5c-.5.2-1 1.1-.6 2.3.7 2.3 2.5 4.2 4.8 5.1 1.5.6 2.7.3 3.1-.4l.5-1-2.4-1.2-.8 1c-1.7-.6-2.7-1.7-3.2-3.2l.8-.7L9 7.3l-1 .2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function WhatsAppButton({
  floating = false,
  className,
}: {
  floating?: boolean;
  className?: string;
}) {
  const styling = cn(
    "rounded-xl",
    floating &&
      "fixed bottom-5 right-5 z-30 h-12 gap-2 rounded-full px-4 shadow-lg shadow-blue-950/20 sm:bottom-7 sm:right-7",
    className,
  );
  const content = (
    <>
      <WhatsAppSymbol />
      <span>{floating ? "WhatsApp" : "Tanya melalui WhatsApp"}</span>
    </>
  );
  return (
    <Button asChild className={styling}>
      <a
        href={schoolContact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    </Button>
  );
}
