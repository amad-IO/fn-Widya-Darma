"use client";

import { create } from "zustand";

type Question = { id: string; text: string };
type SchoolChatState = {
  questions: Question[];
  addQuestion: (text: string) => void;
  newConversation: () => void;
};

export const useSchoolChat = create<SchoolChatState>((set) => ({
  questions: [],
  addQuestion: (text) =>
    set((state) => ({
      questions: [...state.questions, { id: crypto.randomUUID(), text }],
    })),
  newConversation: () => set({ questions: [] }),
}));
