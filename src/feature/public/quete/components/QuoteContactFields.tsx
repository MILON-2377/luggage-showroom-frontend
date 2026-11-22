import { QuoteField } from "./QuoteUi";
import QuoteCountrySelect from "./QuoteCountrySelect";
import type { FieldProps } from "../types/quote.types";
export default function QuoteContactFields(p: FieldProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <QuoteField {...p} field="name" required />
      <QuoteField {...p} field="company" required />
      <QuoteField {...p} field="email" type="email" required />
      <QuoteCountrySelect {...p} />
    </div>
  );
}
