"use client";
import { Package, FlaskConical, Sparkles, Check } from "lucide-react";
import type { QuoteCopy, RequestType } from "../types/quote.types";
export default function QuoteRequestTypeCard({
  item,
  selected,
  onSelect,
  index,
}: {
  item: QuoteCopy["types"][number];
  selected: boolean;
  onSelect: (id: RequestType) => void;
  index: number;
}) {
  const Icon = [Package, FlaskConical, Sparkles][index % 3];
  return (
    <label
      className={
        "group relative block cursor-pointer rounded-2xl border p-5 transition-all duration-300 motion-reduce:transition-none " +
        (selected
          ? "border-[#b2955e] bg-[#f4ecd9] shadow-[3px_5px_0_#b59b6c]"
          : "border-border bg-white hover:-translate-y-1 hover:shadow-[3px_5px_0_#ddcfb2]")
      }
    >
      <input
        className="peer sr-only"
        type="radio"
        name="requestType"
        value={item.id}
        checked={selected}
        onChange={() => onSelect(item.id as RequestType)}
        required
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-xl border border-[#b89a62]/40 bg-gradient-to-br from-[#f8e6b8] to-[#b59762] p-3 text-[#49391f] shadow-[2px_3px_0_#8d754b]">
          <Icon className="size-6" strokeWidth={1.4} />
        </span>
        <span
          className={
            "flex size-6 items-center justify-center rounded-full border " +
            (selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border")
          }
        >
          {selected && <Check className="size-4" />}
        </span>
      </div>
      <h3 className="font-serif text-xl">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {item.description}
      </p>
    </label>
  );
}
