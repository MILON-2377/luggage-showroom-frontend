import { QuoteField } from "./QuoteUi";
import type { FieldProps } from "../types/quote.types";
import { Input } from "@/src/components/ui/input";
export default function QuoteOrderFields(p: FieldProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <QuoteField {...p} field="quantity" type="number" />
      <QuoteField {...p} field="price" type="number" />
      <QuoteField {...p} field="currency" />
      <QuoteField {...p} field="delivery" type="date" />
    </div>
  );
}
