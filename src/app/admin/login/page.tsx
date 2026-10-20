import Image from "next/image";
import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import Reveal from "@/components/shared/Reveal";

export const metadata: Metadata = { title: "Login Admin" };

export default function LoginPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col justify-between overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-10 lg:px-14">
      {/* Background Image with Soft Blur & Rich Gradient Overlay */}
      <Image
        src="/images/01.webp"
        alt="Lingkungan SMA Widya Darma"
        fill
        priority
        sizes="100vw"
        className="-z-20 scale-105 object-cover blur-[2px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-slate-950/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-blue-950/30 to-slate-950/50"
      />

      {/* Center Auth Card */}
      <div className="my-auto flex items-center justify-center py-8">
        <Reveal className="w-full max-w-[420px]">
          <section
            aria-labelledby="login-heading"
            className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/95 p-7 text-ink shadow-[0_25px_60px_-15px_rgba(8,15,35,0.45)] ring-1 ring-black/5 backdrop-blur-2xl sm:p-9"
          >
            {/* Subtle Top Accent Glow inside Card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-blue-400/15 blur-2xl"
            />

            {/* Header Icon, ADMINISTRATOR & School Name */}
            <div className="relative flex flex-col items-center text-center">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-12 w-12 text-primary/85"
                aria-hidden="true"
              >
                <path
                  d="M10 2.5 4 5v4.5c0 4.1 2.5 7.6 6 8.5 3.5-.9 6-4.4 6-8.5V5l-6-2.5Z"
                  className="fill-primary/15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m7.75 10 1.5 1.5 3.25-3.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                ADMINISTRATOR
              </p>

              <h1
                id="login-heading"
                className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-[26px]"
              >
                SMA Widya Darma
              </h1>
            </div>

            <LoginForm />
          </section>
        </Reveal>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] leading-5 text-white/60">
        © 2026 SMA Widya Darma · Akses khusus pengelola resmi
      </footer>
    </div>
  );
}
