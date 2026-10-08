"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Mark } from "./Svg";
const schema = z.object({
  name: z.string().trim().min(2, "Lorem ipsum dolor sit amet."),
  email: z.email("Lorem ipsum dolor sit amet."),
  topic: z.enum(["lorem", "ipsum", "dolor"]),
  message: z.string().trim().min(10, "Consectetur adipiscing elit."),
});
type ContactValues = z.infer<typeof schema>;
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: "lorem" },
  });
  if (submitted)
    return (
      <div
        role="status"
        className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] border border-blue-200 bg-mist p-8 text-center"
      >
        <Mark className="mb-6 h-16 w-16 text-primary" />
        <h2 className="text-3xl font-medium">Lorem ipsum dolor.</h2>
        <p className="body-copy mt-4 max-w-xs">
          Consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
        >
          Lorem ipsum
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    );
  return (
    <form
      noValidate
      onSubmit={handleSubmit(() => setSubmitted(true))}
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-xs font-semibold"
          >
            Lorem ipsum *
          </label>
          <input
            id="contact-name"
            autoComplete="name"
            placeholder="Lorem ipsum"
            className="field"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-xs font-semibold"
          >
            Dolor sit amet *
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="lorem@ipsum.com"
            className="field"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="contact-topic"
          className="mb-2 block text-xs font-semibold"
        >
          Consectetur
        </label>
        <select id="contact-topic" className="field" {...register("topic")}>
          <option value="lorem">Lorem ipsum dolor</option>
          <option value="ipsum">Sit amet consectetur</option>
          <option value="dolor">Adipiscing elit</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-xs font-semibold"
        >
          Adipiscing elit *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Lorem ipsum dolor sit amet…"
          className="field resize-y"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-xs text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xs text-[10px] leading-5 text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          Lorem ipsum
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
