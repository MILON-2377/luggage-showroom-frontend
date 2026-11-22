import { Label } from "@/src/components/ui/lebel";
import { QuoteField } from "./QuoteUi";
import { ChevronDown } from "lucide-react";
import type { FieldProps } from "../types/quote.types";
export default function QuoteProductFields(p: FieldProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2.5">
        <Label htmlFor="quote-category">{p.copy.form.category}</Label>
        <div className="relative">
          <select
            id="quote-category"
            className="h-12 w-full appearance-none rounded-xl border border-input bg-white px-3 pr-10 text-base focus-visible:outline-2 focus-visible:outline-ring"
            value={p.values.category}
            onChange={(e) => p.update("category", e.target.value)}
          >
            <option value="">{p.copy.form.choose}</option>
            {p.copy.categories.map((name, i) => (
              <option key={i} value={String(i)}>
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-4 size-4" />
        </div>
      </div>
      <QuoteField {...p} field="models" />
    </div>
  );
}
