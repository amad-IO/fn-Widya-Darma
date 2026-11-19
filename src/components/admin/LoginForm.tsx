"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginValues } from "@/lib/login";
import { loginAdmin } from "@/lib/admin-auth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  async function submit(values: LoginValues) {
    try {
      await loginAdmin(values);
      router.replace("/admin/dashboard");
    } catch (error) {
      setError("root.service", {
        message:
          error instanceof Error ? error.message : "Login gagal. Silakan coba lagi.",
      });
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      onChange={() => clearErrors("root")}
      className="mt-6 space-y-4"
    >
      {/* Email Field */}
      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-xs font-semibold text-slate-800"
        >
          Email
        </label>
        <div className="group relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
            >
              <circle cx="10" cy="6.5" r="3.25" />
              <path
                d="M4 16.5c1.2-2.6 3.4-4 6-4s4.8 1.4 6 4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            placeholder="Masukkan email admin"
            className="h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-10 pr-4 text-xs text-slate-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15 sm:text-sm"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "login-email-error" : undefined
            }
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p
            id="login-email-error"
            role="alert"
            className="mt-1.5 text-[11px] font-medium leading-5 text-red-600"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-xs font-semibold text-slate-800"
        >
          Password
        </label>
        <div className="group relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-4 w-4"
            >
              <rect x="4" y="9" width="12" height="8" rx="2.5" />
              <path
                d="M6.75 9V6.5a3.25 3.25 0 0 1 6.5 0V9"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Masukkan password"
            className="h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-10 pr-11 text-xs text-slate-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15 sm:text-sm"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            aria-controls="login-password"
            aria-pressed={showPassword}
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {showPassword && <path d="m3 3 18 18" />}
            </svg>
          </button>
        </div>
        {errors.password && (
          <p
            id="login-password-error"
            role="alert"
            className="mt-1.5 text-[11px] font-medium leading-5 text-red-600"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Service Alert */}
      {errors.root?.service && (
        <div
          role="alert"
          className="rounded-xl border border-blue-200 bg-blue-50/90 px-3.5 py-2.5 text-xs leading-5 text-blue-900"
        >
          {errors.root.service.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl bg-gradient-to-b from-blue-500 to-primary text-xs font-semibold text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)] transition hover:brightness-105 active:scale-[0.99] sm:text-sm"
        >
          {isSubmitting ? "Memproses…" : "Masuk ke Panel Admin"}
        </Button>
      </div>

      <div className="border-t border-slate-100 pt-4 text-center">
        <p className="text-[11px] leading-5 text-slate-400">
          Kendala akses akun? Hubungi administrator IT sekolah.
        </p>
      </div>
    </form>
  );
}
