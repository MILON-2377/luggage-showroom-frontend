"use client";

import { Bot, UserRound } from "lucide-react";
import { useLanguage } from "@/src/providers";
import type { ChatMessage } from "../types/faq.types";

export default function AiChatMessage({ message }: { message: ChatMessage }) {
  const { t } = useLanguage();
  const user = message.role === "user";
  const Icon = user ? UserRound : Bot;

  return (
    <div className={`flex items-start gap-3 ${user ? "flex-row-reverse" : ""}`}>
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-background text-accent"
      >
        <Icon className="size-4" />
      </span>
      <div
        className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 ${
          user
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm border border-border bg-background text-primary"
        }`}
      >
        <p
          className={`mb-1 text-[10px] font-medium ${
            user ? "text-primary-foreground/65" : "text-accent"
          }`}
        >
          {user ? t.faq.ai.you : t.faq.ai.assistant}
        </p>
        <p className="whitespace-pre-wrap break-words text-sm leading-7 [overflow-wrap:anywhere]">
          {message.content}
        </p>
      </div>
    </div>
  );
}