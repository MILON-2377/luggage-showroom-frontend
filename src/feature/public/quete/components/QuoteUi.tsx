import type { ReactNode } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import type { FieldProps, TextField } from "../types/quote.types";
export const panel =
  "rounded-[28px] border border-white/80 bg-gradient-to-br from-white to-[#f3eddf] shadow-[6px_8px_0_#cfbd96,0_22px_45px_-24px_#45351c66]";
export function QuoteField({
  copy,
  values,
  update,
  field,
  type = "text",
  required = false,
  children,
}: {
  field: TextField;
  type?: string;
  required?: boolean;
  children?: ReactNode;
} & FieldProps) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor={"quote-" + field}>
        {copy.form[field]}{" "}
        <span className="text-xs font-normal text-muted-foreground">
          {required ? "*" : copy.form.optional}
        </span>
      </Label>
      {children || (
        <Input
          id={"quote-" + field}
          name={field}
          type={type}
          required={required}
          value={values[field]}
          onChange={(e) => update(field, e.target.value)}
          maxLength={300}
          step={field === "price" ? "any" : undefined}
          autoComplete={
            field === "name"
              ? "name"
              : field === "email"
                ? "email"
                : field === "company"
                  ? "organization"
                  : field === "phone"
                    ? "tel"
                    : undefined
          }
          className="h-12 rounded-xl bg-white/80 text-base shadow-inner"
        />
      )}
    </div>
  );
}
