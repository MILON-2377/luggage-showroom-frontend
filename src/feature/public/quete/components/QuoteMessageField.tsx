import { Label } from "@/src/components/ui/lebel";
import { Textarea } from "@/src/components/ui/textarea";
import type { FieldProps } from "../types/quote.types";
export default function QuoteMessageField({
  copy,
  values,
  update,
}: FieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="quote-message">{copy.form.message} *</Label>
      <p
        id="quote-message-hint"
        className="text-sm leading-6 text-muted-foreground"
      >
        {copy.form.messageHint}
      </p>
      <Textarea
        id="quote-message"
        name="message"
        required
        maxLength={6000}
        value={values.message}
        onChange={(e) => update("message", e.target.value)}
        aria-describedby="quote-message-hint"
        placeholder={copy.form.messagePlaceholder}
        className="min-h-40 rounded-xl bg-white/80 text-base shadow-inner"
      />
    </div>
  );
}
