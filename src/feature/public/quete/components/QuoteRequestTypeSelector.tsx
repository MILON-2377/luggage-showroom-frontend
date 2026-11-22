import QuoteRequestTypeCard from "./QuoteRequestTypeCard";
import type { FieldProps } from "../types/quote.types";
export default function QuoteRequestTypeSelector({
  copy,
  values,
  update,
}: FieldProps) {
  return (
    <fieldset>
      <legend className="mb-5 text-base font-medium">
        {copy.form.request} *
      </legend>
      <div className="grid gap-4 xl:grid-cols-3">
        {copy.types.map((item, index) => (
          <QuoteRequestTypeCard
            key={item.id}
            item={item}
            index={index}
            selected={values.type === item.id}
            onSelect={(id) => update("type", id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
