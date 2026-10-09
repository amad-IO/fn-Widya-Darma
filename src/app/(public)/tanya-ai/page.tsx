import type { Metadata } from "next";
import ChatExperience from "@/components/chatbot/ChatExperience";
import "./chat.css";

export const metadata: Metadata = {
  title: "Tanya AI",
  description: "Asisten informasi SMA Widya Darma.",
};

export default function AskAiPage() {
  return <ChatExperience />;
}
