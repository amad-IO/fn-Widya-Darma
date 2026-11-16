"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getStoredTeachers,
  initialTeachers,
  saveStoredTeachers,
} from "@/lib/teacher-data";
import type { Teacher } from "@/types/teacher";

let teacherSnapshot: Teacher[] | undefined;

function getTeacherSnapshot() {
  if (!teacherSnapshot) {
    teacherSnapshot = getStoredTeachers();
  }
  return teacherSnapshot;
}

function subscribeToTeachers(onStoreChange: () => void) {
  const handleUpdate = (event: Event) => {
    const nextTeachers = (event as CustomEvent<Teacher[]>).detail;
    teacherSnapshot = nextTeachers || getStoredTeachers();
    onStoreChange();
  };

  window.addEventListener("widya_darma_teachers_updated", handleUpdate);
  return () =>
    window.removeEventListener("widya_darma_teachers_updated", handleUpdate);
}

function getServerTeachers() {
  return initialTeachers;
}

export function useAdminTeachers() {
  const teachers = useSyncExternalStore(
    subscribeToTeachers,
    getTeacherSnapshot,
    getServerTeachers,
  );

  const saveTeacher = useCallback((teacher: Teacher) => {
    const current = getStoredTeachers();
    const nextTeachers = current.some((item) => item.id === teacher.id)
      ? current.map((item) => (item.id === teacher.id ? teacher : item))
      : [teacher, ...current];
    saveStoredTeachers(nextTeachers);
  }, []);

  const removeTeacher = useCallback((id: string) => {
    saveStoredTeachers(
      getStoredTeachers().filter((teacher) => teacher.id !== id),
    );
  }, []);

  return { teachers, saveTeacher, removeTeacher };
}
