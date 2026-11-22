import { Plus } from "lucide-react";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteFaq({ copy }: { copy: QuoteCopy }) {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 font-serif text-4xl">{copy.faq.title}</h2>
        <div className="space-y-4">
          {copy.faq.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-white/70 p-6 shadow-[3px_4px_0_#d7c9ac]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium focus-visible:outline-2 focus-visible:outline-ring">
                {item.question}
                <Plus className="mt-0.5 size-5 shrink-0 text-accent transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
