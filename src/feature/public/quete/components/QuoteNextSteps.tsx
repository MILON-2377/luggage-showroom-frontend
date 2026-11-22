import { Check } from "lucide-react";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteNextSteps({ copy }: { copy: QuoteCopy }) {
  return (
    <section className="mt-10 text-left">
      <h2 className="font-serif text-2xl">{copy.submitted.stepsTitle}</h2>
      <ol className="mt-5 space-y-4">
        {copy.submitted.steps.map((text) => (
          <li
            key={text}
            className="flex gap-3 text-sm leading-7 text-muted-foreground"
          >
            <Check className="mt-1 size-5 shrink-0 text-accent" />
            {text}
          </li>
        ))}
      </ol>
    </section>
  );
}
