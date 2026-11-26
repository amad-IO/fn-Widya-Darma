"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import type { Teacher, TeacherCategory, TeacherStatus } from "@/types/teacher";

type TeacherRecord = {
  teacher_id: number | string;
  name: string;
  code?: string | null;
  role?: string | null;
  category?: string | null;
  subject?: string | null;
  nip?: string | null;
  nuptk?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  image?: string | null;
  expertise?: string[] | null;
  education?: string[] | null;
  bio?: string | null;
  status?: string | null;
  sort_order?: number | null;
};

type PaginatedTeachers = { data: TeacherRecord[] };

const DEFAULT_IMAGE = "/images/teachers/teacher-1.jpg";

function backendImageUrl(image?: string | null) {
  if (!image) return undefined;
  if (/^https?:\/\//i.test(image) || image.startsWith("data:")) return image;
  if (!image.startsWith("/storage/")) return image;

  return `/api/media?path=${encodeURIComponent(image)}`;
}

function asTeacher(record: TeacherRecord, fallbackImage?: string): Teacher {
  return {
    id: String(record.teacher_id),
    name: record.name,
    code: record.code || undefined,
    role: record.role || "Guru Mata Pelajaran",
    category: (record.category || "Lainnya") as TeacherCategory,
    subject: record.subject || "-",
    nip: record.nip || undefined,
    nuptk: record.nuptk || undefined,
    email: record.email || "-",
    phone: record.phone || undefined,
    address: record.address || undefined,
    image: backendImageUrl(record.image) || fallbackImage || DEFAULT_IMAGE,
    expertise: record.expertise || undefined,
    education: record.education || undefined,
    bio: record.bio || undefined,
    status: (record.status || "Guru Tetap") as TeacherStatus,
    order: record.sort_order || undefined,
  };
}

function generatedEmail(teacher: Teacher) {
  const slug = teacher.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .slice(0, 42);
  return `${slug || "guru"}.${Date.now()}@widyadarma.sch.id`;
}

function teacherFormData(teacher: Teacher, imagePath?: string, isUpdate = false) {
  const formData = new FormData();
  if (isUpdate) formData.set("_method", "PUT");

  formData.set("name", teacher.name);
  formData.set(
    "email",
    teacher.email && teacher.email !== "-" ? teacher.email : generatedEmail(teacher),
  );
  formData.set("subject", teacher.subject || "");
  formData.set("bio", teacher.bio || "");
  formData.set("role", teacher.role || "Guru Mata Pelajaran");
  formData.set("category", teacher.category || "Lainnya");
  formData.set("status", teacher.status || "Guru Tetap");
  formData.set("sort_order", String(teacher.order || 1));

  if (teacher.education?.[0]) formData.append("education[]", teacher.education[0]);
  if (imagePath) formData.set("image", imagePath);

  return formData;
}

async function uploadTeacherImage(imageFile: File) {
  const formData = new FormData();
  formData.set("folder", "teachers");
  formData.set("image", imageFile);
  const result = await adminApi<{ image_url?: string; path?: string }>("/upload", {
    method: "POST",
    body: formData,
  });
  const path = result.image_url || result.path;
  if (!path) throw new Error("Server tidak mengembalikan alamat gambar.");
  return path;
}

export function useAdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshTeachers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminApi<PaginatedTeachers>("/teachers?per_page=100");
      setTeachers(response.data.map((teacher) => asTeacher(teacher)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Data guru gagal dimuat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTeachers();
  }, [refreshTeachers]);

  const saveTeacher = useCallback(
    async (teacher: Teacher, imageFile?: File) => {
      const isUpdate = !teacher.id.startsWith("guru-");
      const imagePath = imageFile ? await uploadTeacherImage(imageFile) : undefined;
      const response = await adminApi<TeacherRecord>(
        isUpdate ? `/teachers/${teacher.id}` : "/teachers",
        {
          // Laravel menerima multipart update lewat POST + _method=PUT.
          method: "POST",
          body: teacherFormData(teacher, imagePath, isUpdate),
        },
      );
      const savedTeacher = asTeacher(
        response,
        imagePath ? backendImageUrl(imagePath) : teacher.image,
      );
      setTeachers((current) =>
        isUpdate
          ? current.map((item) => (item.id === savedTeacher.id ? savedTeacher : item))
          : [savedTeacher, ...current],
      );
      return savedTeacher;
    },
    [],
  );

  const removeTeacher = useCallback(async (id: string) => {
    await adminApi<null>(`/teachers/${id}`, { method: "DELETE" });
    setTeachers((current) => current.filter((teacher) => teacher.id !== id));
  }, []);

  return { teachers, isLoading, error, refreshTeachers, saveTeacher, removeTeacher };
}
