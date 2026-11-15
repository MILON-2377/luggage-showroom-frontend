"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function AiSuggestedQuestions({
  onSelect,
  disabled = false,
}: {
  onSelect: (question: string) => void;
  disabled?: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-secondary">
        {t.faq.ai.suggestionsLabel}
      </p>

      {t.faq.ai.suggestions.map((question) => (
        <Button
          key={question}
          variant="outline"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="h-auto min-h-11 w-full justify-between gap-3 rounded-xl py-3 text-left text-xs whitespace-normal"
        >
          <span className="min-w-0 flex-1 leading-5">{question}</span>

          <ArrowUpRight
            className="size-3.5 text-accent"
            aria-hidden="true"
          />
        </Button>
      ))}
    </div>
  );
}