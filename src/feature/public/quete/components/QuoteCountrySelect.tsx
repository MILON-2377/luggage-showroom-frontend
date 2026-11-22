import { QuoteField } from "./QuoteUi";
import type { FieldProps } from "../types/quote.types";
export default function QuoteCountrySelect(p: FieldProps) {
  return <QuoteField {...p} field="country" required />;
}
