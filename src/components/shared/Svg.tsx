import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement>;
export function Ticket({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="m3.5 15.5 12-12 2 2a2.12 2.12 0 0 0 3 3l2 2-12 12-2-2a2.12 2.12 0 0 0-3-3l-2-2Z"
        fill="currentColor"
      />
      <path
        d="m13 8 3 3m-6-1 4 4m-6-1 3 3"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Sparkle({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="m10 3 2.1 6.9L19 12l-6.9 2.1L10 21l-2.1-6.9L1 12l6.9-2.1L10 3Z"
        fill="currentColor"
      />
      <path d="m19 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" fill="currentColor" />
    </svg>
  );
}
export function Globe({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <ellipse
        cx="12"
        cy="12"
        rx="4"
        ry="9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 12h18M5 6.5h14M5 17.5h14"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
export function PartnerSymbol({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="m5 8 8-5 6 4v9l-8 5-6-4V8Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="m7 17 10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Arrow({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ArrowUpRight({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 18 18 6M6 6h12v12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Mark({ className = "h-9 w-9", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="m24 5 18 9v19l-18 10L6 33V14l18-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m14 17 10 5 10-5v14l-10 5-10-5V17Z"
        fill="currentColor"
        fillOpacity=".15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M24 22v14M14 17l10-5 10 5M6 14l18 10 18-10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
export function Flower({ className = "h-20 w-20", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M50 6C62-9 66 27 66 27S97 10 91 30c-2 9-17 19-17 19s33 9 20 20c-7 7-27 3-27 3s4 33-13 24c-9-5-12-23-12-23s-25 21-29 3c-2-10 10-23 10-23S-7 42 8 30c9-6 27 1 27 1S37 4 50 6Z"
        fill="currentColor"
      />
      <circle cx="50" cy="51" r="11" fill="white" />
    </svg>
  );
}
export function Close({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Menu({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 8h16M4 16h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Plus({ className = "h-5 w-5", ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
