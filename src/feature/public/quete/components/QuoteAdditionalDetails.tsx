import type { ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import QuoteProductFields from "./QuoteProductFields";
import QuoteOrderFields from "./QuoteOrderFields";
import QuoteCustomizationFields from "./QuoteCustomizationFields";
import type { FieldProps } from "../types/quote.types";
export default function QuoteAdditionalDetails({
  children,
  ...p
}: FieldProps & { children?: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-border bg-[#efe7d6]/30 p-5">
      <summary className="flex cursor-pointer list-none items-center gap-3 font-medium focus-visible:outline-2 focus-visible:outline-ring">
        <SlidersHorizontal className="size-5 text-accent" />
        {p.copy.form.additional}
        <ChevronDown className="ml-auto size-5 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {p.copy.form.additionalNote}
      </p>
      <div className="mt-7 space-y-6">
        <QuoteProductFields {...p} />
        <QuoteOrderFields {...p} />
        <QuoteCustomizationFields {...p} />
        {children}
      </div>
    </details>
  );
}
