import { QuoteField } from "./QuoteUi";
import { Textarea } from "@/src/components/ui/textarea";
import type { FieldProps } from "../types/quote.types";
export default function QuoteCustomizationFields(p: FieldProps) {
  return (
    <div className="space-y-6">
      <QuoteField {...p} field="phone" type="tel" />
      <QuoteField {...p} field="customization">
        <Textarea
          id="quote-customization"
          value={p.values.customization}
          maxLength={6000}
          onChange={(e) => p.update("customization", e.target.value)}
          placeholder={p.copy.form.customHint}
          className="rounded-xl bg-white text-base"
        />
      </QuoteField>
    </div>
  );
}
