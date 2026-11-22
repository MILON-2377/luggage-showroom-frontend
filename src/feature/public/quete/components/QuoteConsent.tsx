import Link from "next/link";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/lebel";
import { quoteConfig } from "../data/quote.config";
import type { FieldProps } from "../types/quote.types";
export default function QuoteConsent({ copy, values, update }: FieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Checkbox
          id="quote-consent"
          checked={values.consent}
          onCheckedChange={(checked) => update("consent", checked === true)}
          aria-required="true"
          className="mt-1"
        />
        <Label
          htmlFor="quote-consent"
          className="text-sm font-normal leading-6"
        >
          {copy.form.consent}
        </Label>
      </div>
      {quoteConfig.privacyHref ? (
        <Link href={quoteConfig.privacyHref} className="text-sm underline">
          {copy.form.privacy}
        </Link>
      ) : (
        <p className="text-xs leading-6 text-muted-foreground">
          {copy.form.privacyPending}
        </p>
      )}
    </div>
  );
}
