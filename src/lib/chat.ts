import { z } from "zod";

export const questionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Tulis pertanyaan terlebih dahulu.")
    .max(2000, "Pertanyaan maksimal 2.000 karakter."),
});

export type QuestionValues = z.infer<typeof questionSchema>;
