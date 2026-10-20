"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/shared/Reveal";
import AdminSidebar from "./AdminSidebar";
import AdminPublications from "./AdminPublications";
import StatusBadge from "./AdminStatusBadge";
import AdminIcon, { type AdminIconName } from "./AdminIcon";
import { cn } from "@/lib/utils";
import {
  adminNavigation,
  previewPublications,
  previewStaff,
  publicationCategories,
  type AdminSection,
  type PreviewPublication,
  type PublicationCategory,
} from "@/lib/admin-preview";

const panel = "rounded-2xl border border-slate-200/80 bg-white";
const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";
const editorSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi."),
  category: z.enum(publicationCategories),
  status: z.enum(["Terbit", "Draf", "Dalam tinjauan"]),
  content: z.string().trim().min(1, "Isi publikasi wajib diisi."),
});
type EditorValues = z.infer<typeof editorSchema>;

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [publications, setPublications] = useState(previewPublications);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PublicationCategory | "Semua">(
    "Semua",
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const editorRef = useRef<HTMLDialogElement>(null);
  const mobileDialogRef = useRef<HTMLDialogElement>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EditorValues>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: "",
      category: "Berita",
      status: "Draf",
      content: "",
    },
  });

  const active = adminNavigation.find((item) => item.id === section)!;
  const filtered = publications.filter(
    (item) =>
      (category === "Semua" || item.category === category) &&
      (item.title + " " + item.category)
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const published = publications.filter(
    (item) => item.status === "Terbit",
  ).length;
  const drafts = publications.filter((item) => item.status === "Draf").length;
  const review = publications.filter(
    (item) => item.status === "Dalam tinjauan",
  ).length;

  function navigate(next: AdminSection) {
    setSection(next);
    setQuery("");
    setCategory("Semua");
    setNotice("");
    mobileDialogRef.current?.close();
    setMobileMenu(false);
  }

  function openEditor(item?: PreviewPublication) {
    setEditingId(item?.id ?? null);
    reset(
      item
        ? {
            title: item.title,
            category: item.category,
            status: item.status,
            content: item.content,
          }
        : { title: "", category: "Berita", status: "Draf", content: "" },
    );
    editorRef.current?.showModal();
  }

  function savePreview(values: EditorValues) {
    setPublications((items) =>
      editingId === null
        ? [
            {
              ...values,
              id: Math.max(...items.map((item) => item.id), 0) + 1,
              date: "06 Okt 2026",
              image: "/images/31.webp",
            },
            ...items,
          ]
        : items.map((item) =>
            item.id === editingId ? { ...item, ...values } : item,
          ),
    );
    editorRef.current?.close();
    setNotice(
      "Perubahan diterapkan pada pratinjau. Data akan kembali ke contoh saat halaman dimuat ulang.",
    );
  }

  const sectionLinks: Record<
    Exclude<AdminSection, "dashboard" | "publikasi">,
    string
  > = {
    profil: "/profil",
    guru: "/guru",
    spmb: "/spmb",
    galeri: "/galeri",
    kontak: "/kontak",
  };

  return (
    <div className="min-h-dvh bg-[#f5f7fb] text-slate-700 lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 overflow-y-auto bg-gradient-to-b from-[#063b5d] to-[#052f4d] lg:block">
        <AdminSidebar
          section={section}
          publicationCount={publications.length}
          onNavigate={navigate}
          onClose={() => mobileDialogRef.current?.close()}
        />
      </aside>
      <dialog
        ref={mobileDialogRef}
        aria-label="Navigasi dashboard"
        onClose={() => setMobileMenu(false)}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] border-0 bg-[#052f4d] p-0 backdrop:bg-slate-950/50"
      >
        <AdminSidebar
          mobile
          section={section}
          publicationCount={publications.length}
          onNavigate={navigate}
          onClose={() => mobileDialogRef.current?.close()}
        />
      </dialog>

      <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur-md sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Buka menu admin"
            aria-expanded={mobileMenu}
            onClick={() => {
              mobileDialogRef.current?.showModal();
              setMobileMenu(true);
            }}
            className="rounded-lg border border-slate-200 p-2 lg:hidden"
          >
            <AdminIcon name="menu" className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">
              {active.label}
            </p>
            <p className="mt-1 hidden text-[11px] text-slate-400 sm:block">
              Panel Admin <span className="mx-2 text-slate-300">/</span>{" "}
              {active.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:border-blue-200 hover:text-primary sm:flex"
          >
            <AdminIcon name="external" className="h-3.5 w-3.5" />
            Lihat website
          </Link>
          <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
              AD
            </span>
            <div className="hidden sm:block">
              <p className="text-[12px] font-semibold text-slate-800">
                Administrator
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Pengelola sekolah
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Ruang pengelolaan sekolah
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
              {section === "dashboard"
                ? "Selamat datang, Admin."
                : active.label}
            </h1>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              {section === "dashboard"
                ? "Semua informasi sekolah, dalam satu ruang kerja."
                : active.caption}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Mode pratinjau · Data contoh
          </span>
        </div>
        {notice && (
          <div
            role="status"
            className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-6 text-blue-800"
          >
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
              className="rounded-md p-1 hover:bg-blue-100"
            >
              <AdminIcon name="close" className="h-4 w-4" />
            </button>
          </div>
        )}

        {section === "dashboard" ? (
          <>
            <Reveal>
              <section className="relative mb-6 flex items-center justify-between gap-6 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-[#e9f1ff] via-[#eef4ff] to-[#f5f8ff] px-6 py-6 sm:px-7">
                <div className="relative z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Website profil sekolah
                  </span>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-blue-950 sm:text-xl">
                    Informasi yang baik, sekolah yang lebih dekat.
                  </h2>
                  <p className="mt-2 max-w-md text-[12px] leading-6 text-slate-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-primary"
                  >
                    Pratinjau beranda
                    <AdminIcon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
                <div
                  aria-hidden="true"
                  className="relative hidden h-32 w-48 shrink-0 items-center justify-center sm:flex"
                >
                  <span className="absolute h-44 w-44 rounded-full border border-blue-200/50" />
                  <span className="absolute h-32 w-32 rounded-full border border-blue-200/50" />
                  <span className="relative flex h-20 w-20 -rotate-6 items-center justify-center rounded-2xl border border-white bg-white/80 text-primary shadow-xl shadow-blue-200/50">
                    <AdminIcon name="school" className="h-10 w-10" />
                  </span>
                  <span className="absolute right-4 top-0 flex h-8 w-8 rotate-12 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/15">
                    <AdminIcon name="check" className="h-4 w-4" />
                  </span>
                </div>
              </section>
            </Reveal>
            <section
              aria-label="Ringkasan konten contoh"
              className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4"
            >
              {[
                {
                  title: "Total publikasi",
                  value: publications.length.toString().padStart(2, "0"),
                  note: `${published} terbit · ${drafts} draf`,
                  icon: "article",
                  target: "publikasi",
                },
                {
                  title: "Profil guru",
                  value: "04",
                  note: "Tenaga pendidik",
                  icon: "people",
                  target: "guru",
                },
                {
                  title: "Album galeri",
                  value: "05",
                  note: "Prestasi & kegiatan",
                  icon: "gallery",
                  target: "galeri",
                },
                {
                  title: "Informasi SPMB",
                  value: "03",
                  note: "Jadwal, alur, persyaratan",
                  icon: "calendar",
                  target: "spmb",
                },
              ].map((item) => (
                <button
                  type="button"
                  key={item.title}
                  onClick={() => navigate(item.target as AdminSection)}
                  className={cn(
                    panel,
                    "group px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 sm:px-5",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      {item.title}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                      <AdminIcon
                        name={item.icon as AdminIconName}
                        className="h-4 w-4"
                      />
                    </span>
                  </div>
                  <p className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
                    {item.value}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-1">
                    <span className="text-[10px] text-slate-400">
                      {item.note}
                    </span>
                    <AdminIcon
                      name="arrow"
                      className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary"
                    />
                  </div>
                </button>
              ))}
            </section>
            <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_260px]">
              <AdminPublications
                category={category}
                query={query}
                filtered={filtered}
                total={publications.length}
                onNavigate={navigate}
                onCategory={setCategory}
                onQuery={setQuery}
                onEdit={openEditor}
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                <section className={cn(panel, "p-5")}>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Akses cepat
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Mulai dari yang ingin diperbarui
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      {
                        title: "Tambah publikasi",
                        note: "Berita, jurnal, atau karya",
                        icon: "plus",
                        target: "publikasi",
                      },
                      {
                        title: "Kelola profil guru",
                        note: "Direktori tenaga pendidik",
                        icon: "people",
                        target: "guru",
                      },
                      {
                        title: "Buka galeri sekolah",
                        note: "Album prestasi & kegiatan",
                        icon: "gallery",
                        target: "galeri",
                      },
                    ].map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() =>
                          item.target === "publikasi"
                            ? openEditor()
                            : navigate(item.target as AdminSection)
                        }
                        className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                          <AdminIcon
                            name={item.icon as AdminIconName}
                            className="h-4 w-4"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] font-medium text-slate-800">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-[10px] text-slate-400">
                            {item.note}
                          </span>
                        </span>
                        <AdminIcon
                          name="arrow"
                          className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-primary"
                        />
                      </button>
                    ))}
                  </div>
                </section>
                <section className={cn(panel, "overflow-hidden")}>
                  <div className="relative h-28">
                    <Image
                      src="/images/01.webp"
                      alt="Foto contoh lingkungan sekolah"
                      fill
                      sizes="(min-width: 1280px) 300px, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent" />
                    <span className="absolute bottom-3 left-5 text-[11px] font-semibold text-white">
                      SMA Widya Darma
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xs font-semibold text-slate-800">
                      Konten siap ditinjau
                    </h2>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {review} publikasi menunggu tinjauan. Pastikan informasi
                      telah disetujui sekolah.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("publikasi")}
                      className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold text-primary"
                    >
                      Buka publikasi
                      <AdminIcon name="arrow" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </>
        ) : section === "publikasi" ? (
          <>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {publications.length} publikasi · {published} terbit · {drafts}{" "}
                draf
              </p>
              <Button
                className="h-10 rounded-xl px-4 text-xs"
                onClick={() => openEditor()}
              >
                <AdminIcon name="plus" className="h-4 w-4" />
                Tambah publikasi
              </Button>
            </div>
            <AdminPublications
              full
              category={category}
              query={query}
              filtered={filtered}
              total={publications.length}
              onNavigate={navigate}
              onCategory={setCategory}
              onQuery={setQuery}
              onEdit={openEditor}
            />
          </>
        ) : (
          <>
            <div className="mb-5 flex justify-end">
              <Link
                href={sectionLinks[section]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-medium transition hover:border-blue-200 hover:text-primary"
              >
                Lihat halaman publik
                <AdminIcon name="external" className="h-3.5 w-3.5" />
              </Link>
            </div>
            {section === "profil" && (
              <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className={cn(panel, "p-6")}>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Profil sekolah
                  </h2>
                  <div className="relative mt-5 h-56 overflow-hidden rounded-xl">
                    <Image
                      src="/images/14.webp"
                      alt="Foto contoh gedung sekolah"
                      fill
                      sizes="(min-width: 1280px) 600px, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-5 space-y-4">
                    <PreviewField
                      label="Nama sekolah"
                      value="SMA Widya Darma"
                    />
                    <PreviewField
                      label="Tentang sekolah"
                      value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                      multiline
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PreviewField
                        label="Visi"
                        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                        multiline
                      />
                      <PreviewField
                        label="Misi"
                        value="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
                        multiline
                      />
                    </div>
                  </div>
                </section>
                <section className={cn(panel, "p-6")}>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Struktur organisasi
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Kepala sekolah dan jajaran pengelola
                  </p>
                  <div className="mt-6 space-y-4">
                    {previewStaff.map((person, index) => (
                      <div
                        key={person.name}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-primary">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-800">
                            {person.name}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {person.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
            {section === "guru" && (
              <section
                aria-label="Daftar contoh profil guru"
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
              >
                {previewStaff.map((person, index) => (
                  <article key={person.name} className={cn(panel, "p-5")}>
                    <div className="relative mb-5 aspect-square overflow-hidden rounded-xl bg-blue-50">
                      {index === 0 ? (
                        <Image
                          src="/images/50.webp"
                          alt="Foto contoh guru"
                          fill
                          sizes="(min-width: 1280px) 250px, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-blue-200">
                          <AdminIcon name="people" className="h-20 w-20" />
                        </div>
                      )}
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] text-primary">
                      {person.role}
                    </span>
                    <h2 className="mt-4 text-sm font-semibold text-slate-800">
                      {person.name}
                    </h2>
                    <p className="mt-2 text-[12px] text-slate-400">
                      {person.subject}
                    </p>
                    <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] leading-6 text-slate-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </article>
                ))}
              </section>
            )}
            {section === "spmb" && (
              <div className="grid gap-5 lg:grid-cols-3">
                {[
                  "Jadwal penerimaan",
                  "Persyaratan pendaftaran",
                  "Alur pendaftaran",
                ].map((title, index) => (
                  <section key={title} className={cn(panel, "p-6")}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-primary">
                      0{index + 1}
                    </span>
                    <h2 className="mt-5 text-base font-semibold text-slate-800">
                      {title}
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Tahun ajaran 2026/2027 · Contoh
                    </p>
                    <p className="mt-5 text-xs leading-7 text-slate-500">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <StatusBadge status="Draf" />
                    </div>
                  </section>
                ))}
              </div>
            )}
            {section === "galeri" && (
              <section
                aria-label="Album galeri contoh"
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {previewPublications.slice(0, 5).map((item, index) => (
                  <article
                    key={item.id}
                    className={cn(panel, "overflow-hidden")}
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={item.image}
                        alt={`Foto contoh album ${index + 1}`}
                        fill
                        sizes="(min-width: 1280px) 350px, 90vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {index % 2 === 0 ? "Prestasi" : "Ekstrakurikuler"}
                      </span>
                      <h2 className="mt-2 text-sm font-semibold text-slate-800">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-[11px] text-slate-400">
                        Foto contoh · {item.date}
                      </p>
                    </div>
                  </article>
                ))}
              </section>
            )}
            {section === "kontak" && (
              <section className={cn(panel, "max-w-3xl p-6")}>
                <h2 className="text-sm font-semibold text-slate-900">
                  Kontak & media sosial
                </h2>
                <p className="mt-2 text-[12px] leading-6 text-slate-500">
                  Informasi contoh untuk tampilan direktori kontak sekolah.
                </p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <PreviewField
                    label="Nomor WhatsApp"
                    value="0812 0000 0000 (contoh)"
                  />
                  <PreviewField label="Email" value="sekolah@example.com" />
                  <PreviewField label="Instagram" value="@loremipsum" />
                  <PreviewField
                    label="Jam layanan"
                    value="Lorem ipsum dolor sit amet"
                  />
                  <div className="sm:col-span-2">
                    <PreviewField
                      label="Alamat sekolah"
                      value="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                      multiline
                    />
                  </div>
                </div>
              </section>
            )}
          </>
        )}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-5 text-[10px] text-slate-400">
          <span>© 2026 SMA Widya Darma</span>
          <span>Panel pengelolaan konten sekolah</span>
        </footer>
      </div>

      <dialog
        ref={editorRef}
        aria-labelledby="editor-heading"
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-blue-950/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2
              id="editor-heading"
              className="text-base font-semibold text-slate-900"
            >
              {editingId === null ? "Tambah publikasi" : "Edit publikasi"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-400">
              Editor pratinjau · Data contoh
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup editor"
            onClick={() => editorRef.current?.close()}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <AdminIcon name="close" />
          </button>
        </div>
        <form
          noValidate
          onSubmit={(event) => {
            void handleSubmit(savePreview)(event);
          }}
          className="space-y-5 p-5 sm:p-6"
        >
          <div>
            <label
              htmlFor="publication-title"
              className="mb-2 block text-xs font-medium"
            >
              Judul publikasi
            </label>
            <input
              id="publication-title"
              className={field}
              placeholder="Masukkan judul publikasi"
              aria-invalid={!!errors.title}
              aria-describedby={
                errors.title ? "publication-title-error" : undefined
              }
              {...register("title")}
            />
            {errors.title && (
              <p
                id="publication-title-error"
                role="alert"
                className="mt-2 text-xs text-red-600"
              >
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="publication-category"
                className="mb-2 block text-xs font-medium"
              >
                Kategori
              </label>
              <select
                id="publication-category"
                className={field}
                {...register("category")}
              >
                {publicationCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="publication-status"
                className="mb-2 block text-xs font-medium"
              >
                Status
              </label>
              <select
                id="publication-status"
                className={field}
                {...register("status")}
              >
                <option>Draf</option>
                <option>Dalam tinjauan</option>
                <option>Terbit</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="publication-content"
              className="mb-2 block text-xs font-medium"
            >
              Isi publikasi
            </label>
            <textarea
              id="publication-content"
              rows={6}
              className={cn(field, "resize-y")}
              placeholder="Tulis isi publikasi di sini..."
              aria-invalid={!!errors.content}
              aria-describedby={
                errors.content ? "publication-content-error" : undefined
              }
              {...register("content")}
            />
            {errors.content && (
              <p
                id="publication-content-error"
                role="alert"
                className="mt-2 text-xs text-red-600"
              >
                {errors.content.message}
              </p>
            )}
          </div>
          <p className="text-[11px] leading-5 text-slate-400">
            Perubahan hanya berlaku pada pratinjau ini dan tidak mengubah konten
            website publik.
          </p>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl px-4 text-xs"
              onClick={() => editorRef.current?.close()}
            >
              Batal
            </Button>
            <Button type="submit" className="h-10 rounded-xl px-4 text-xs">
              Simpan pratinjau
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

function PreviewField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium text-slate-600">
        {label}
      </span>
      {multiline ? (
        <textarea
          readOnly
          value={value}
          rows={3}
          className={cn(field, "resize-none text-xs leading-6")}
        />
      ) : (
        <input readOnly value={value} className={cn(field, "text-xs")} />
      )}
    </label>
  );
}
