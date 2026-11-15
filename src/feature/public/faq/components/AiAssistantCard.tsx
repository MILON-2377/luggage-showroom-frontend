"use client";

import { ArrowUpRight, Bot, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

interface AiAssistantCardProps {
  onOpen: () => void;
}

export default function AiAssistantCard({
  onOpen,
}: AiAssistantCardProps) {
  const { t } = useLanguage();
  const translations = t.faq.ai;

  return (
    <article className="relative isolate overflow-hidden rounded-[28px] border border-accent/35 bg-primary p-7 text-primary-foreground shadow-[0_25px_60px_-35px_rgba(0,0,0,0.6)] sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 -z-10 size-64 rounded-full border border-accent/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 -z-10 size-44 rounded-full border border-accent/15"
      />

      <div
        aria-hidden="true"
        className="mb-9 flex size-18 items-center justify-center rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/30 to-accent/5 shadow-lg motion-safe:[transform:perspective(600px)_rotateY(-12deg)_rotateX(8deg)]"
      >
        <Bot
          className="size-8 text-accent"
          strokeWidth={1.2}
        />
      </div>

      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent">
        <Sparkles className="size-3" aria-hidden="true" />
        {translations.eyebrow}
      </p>

      <h2 className="mt-4 font-serif text-3xl leading-tight">
        {translations.title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-primary-foreground/65">
        {translations.description}
      </p>

      <Button
        variant="accent"
        onClick={onOpen}
        className="mt-7 w-full justify-between"
      >
        {translations.open}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Button>

      <p className="mt-5 border-t border-primary-foreground/10 pt-4 text-xs leading-6 text-primary-foreground/50">
        {translations.note}
      </p>
    </article>
  );
}