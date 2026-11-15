"use client";

import { useId } from "react";
import { Plus, SearchX } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import type { FaqItem } from "../types/faq.types";

export default function FaqAccordion({
  items,
  openId,
  onToggle,
}: {
  items: FaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  const { t } = useLanguage();
  const prefix = useId();

  if (!items.length)
    return (
      <div className="rounded-2xl border border-dashed border-accent/30 p-10 text-center">
        <SearchX
          className="mx-auto size-8 text-accent"
          aria-hidden="true"
        />
        <h3 className="mt-5 font-serif text-2xl">{t.faq.emptyTitle}</h3>
        <p className="mt-3 text-sm leading-7 text-secondary">
          {t.faq.emptyDescription}
        </p>
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const expanded = openId === item.id;
        const answerId = `${prefix}-${item.id}`;
        const buttonId = `${answerId}-button`;

        return (
          <article
            key={item.id}
            className={`overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-300 ${
              expanded
                ? "border-accent/45 bg-surface shadow-[0_16px_40px_-30px_rgba(0,0,0,0.4)]"
                : "border-border bg-surface/60"
            }`}
          >
            <h3>
              <Button
                id={buttonId}
                variant="ghost"
                aria-expanded={expanded}
                aria-controls={answerId}
                onClick={() => onToggle(item.id)}
                className="h-auto min-h-20 w-full justify-between gap-4 rounded-2xl px-5 py-5 text-left whitespace-normal sm:px-6"
              >
                <span
                  aria-hidden="true"
                  className="font-serif text-xs italic text-accent"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 text-sm font-medium leading-6">
                  {item.question}
                </span>

                <Plus
                  aria-hidden="true"
                  className={`size-5 text-accent transition-transform motion-reduce:transition-none ${
                    expanded ? "rotate-45" : ""
                  }`}
                />
              </Button>
            </h3>

            <div
              id={answerId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
              className="px-6 pb-6 sm:pl-14"
            >
              <p className="border-t border-border pt-5 text-sm leading-8 text-secondary">
                {item.answer}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}