"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Reveal from "@/components/shared/Reveal";
import { Globe, Sparkle } from "@/components/shared/Svg";
import { useSchoolChat } from "@/hooks/useSchoolChat";
import { questionSchema, type QuestionValues } from "@/lib/chat";
import { cn } from "@/lib/utils";

export default function SchoolChat() {
  const questions = useSchoolChat((state) => state.questions);
  const addQuestion = useSchoolChat((state) => state.addQuestion);
  const conversation = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: { question: "" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (conversation.current)
      conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [questions.length]);

  function submit(values: QuestionValues) {
    addQuestion(values.question);
    reset();
    setFocus("question");
  }

  return (
    <section
      aria-labelledby="ai-heading"
      className="ai-workspace relative isolate overflow-hidden px-6 sm:px-10"
    >
      {/* Background foto abu-abu putih & transparan (berbeda dari Beranda) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Image
          src="/images/31.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale opacity-45 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6f7f9]/55 via-white/50 to-[#f6f7f9]/95" />
      </div>

      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col">
        <div
          className={cn(
            "mx-auto flex w-full max-w-3xl flex-1 flex-col",
            questions.length === 0
              ? "justify-center pb-10 pt-8 sm:pb-12 sm:pt-10"
              : "justify-end pb-10 pt-6",
          )}
        >
          {questions.length === 0 ? (
            <Reveal className="text-center">
              <div
                aria-hidden="true"
                className="ai-orb mx-auto mb-7 h-16 w-16"
              />
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                SMA Widya Darma
              </p>
              <h1
                id="ai-heading"
                className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[34px]"
              >
                Selamat datang.
                <br />
                <span className="mt-1.5 inline-block">
                  Apa yang ingin{" "}
                  <span className="ai-heading-accent">kamu ketahui?</span>
                </span>
              </h1>
              <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-muted sm:text-sm">
                Ruang untuk bertanya dan mengenal sekolah lebih dekat.
              </p>
            </Reveal>
          ) : (
            <>
              <h1 id="ai-heading" className="sr-only">
                Percakapan Tanya AI
              </h1>
              <div
                ref={conversation}
                role="log"
                aria-label="Percakapan dengan asisten sekolah"
                aria-live="polite"
                aria-relevant="additions"
                className="mb-6 max-h-[48svh] space-y-7 overflow-y-auto px-1 py-4"
              >
                {questions.map((item) => (
                  <div key={item.id} className="space-y-5">
                    <div className="flex justify-end">
                      <div className="max-w-[90%] rounded-2xl rounded-br-md bg-blue-50 px-5 py-3.5 text-sm leading-7 text-blue-950 sm:max-w-[80%]">
                        <span className="sr-only">Kamu: </span>
                        <p className="whitespace-pre-wrap break-words">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white"
                      >
                        <Sparkle className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-xs font-semibold text-ink">
                          Tanya AI{" "}
                          <span className="ml-2 text-[10px] font-normal text-muted">
                            Pratinjau
                          </span>
                        </p>
                        <p className="text-sm leading-7 text-slate-600">
                          Layanan AI belum terhubung. Untuk sementara, kamu bisa
                          melihat informasi sekolah melalui halaman berikut.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-primary">
                          <Link
                            href="/profil"
                            className="underline-offset-4 hover:underline"
                          >
                            Profil sekolah
                          </Link>
                          <Link
                            href="/spmb"
                            className="underline-offset-4 hover:underline"
                          >
                            Informasi SPMB
                          </Link>
                          <Link
                            href="/kontak"
                            className="underline-offset-4 hover:underline"
                          >
                            Kontak sekolah
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <form
            noValidate
            onSubmit={handleSubmit(submit)}
            className={cn(
              "ai-composer relative overflow-hidden rounded-2xl border bg-white p-4 transition duration-300 focus-within:border-blue-200 focus-within:shadow-lg focus-within:shadow-primary/8 sm:rounded-3xl sm:p-5",
              questions.length === 0 && "mt-8",
              errors.question ? "border-red-300" : "border-slate-200/80",
            )}
          >
            <div className="flex items-start gap-3">
              <Sparkle className="mt-1 h-4 w-4 shrink-0 text-primary" />
              <label htmlFor="ai-question" className="sr-only">
                Pertanyaan untuk AI
              </label>
              <textarea
                id="ai-question"
                rows={3}
                maxLength={2000}
                placeholder="Tulis pertanyaanmu tentang sekolah di sini..."
                className="min-h-24 w-full resize-none bg-transparent text-sm leading-7 text-ink outline-none placeholder:text-slate-400 focus-visible:outline-none"
                aria-invalid={!!errors.question}
                aria-describedby={
                  errors.question
                    ? "ai-question-error ai-preview-note"
                    : "ai-preview-note"
                }
                {...register("question")}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    (event.ctrlKey || event.metaKey) &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    void handleSubmit(submit)();
                  }
                }}
              />
            </div>
            {errors.question && (
              <p
                id="ai-question-error"
                role="alert"
                className="mb-3 pl-7 text-xs text-red-600"
              >
                {errors.question.message}
              </p>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 py-2 text-[10px] text-slate-500 sm:text-xs">
                <Globe className="h-3.5 w-3.5" />
                Informasi sekolah
              </span>
              <div className="flex items-center gap-3">
                <span className="hidden text-[10px] text-slate-400 sm:block">
                  <kbd className="font-sans">Ctrl + Enter</kbd> untuk kirim
                </span>
                <button
                  type="submit"
                  aria-label="Kirim pertanyaan"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/15 transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline-offset-4"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 19V5m-6 6 6-6 6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <p
            id="ai-preview-note"
            className="mt-4 text-center text-[10px] leading-5 text-slate-400 sm:text-xs"
          >
            Tampilan pratinjau. Layanan AI belum terhubung.
          </p>
        </div>
      </div>
    </section>
  );
}
