import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username wajib diisi.")
    .min(3, "Username minimal 3 karakter.")
    .max(50, "Username maksimal 50 karakter.")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Gunakan huruf, angka, titik, garis bawah, atau tanda hubung tanpa spasi.",
    ),
  password: z
    .string()
    .min(1, "Password wajib diisi.")
    .min(8, "Password minimal 8 karakter.")
    .max(128, "Password maksimal 128 karakter."),
});

export type LoginValues = z.infer<typeof loginSchema>;
