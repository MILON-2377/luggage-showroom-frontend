"use client";
import { ChevronDown } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/lebel";
import { useId } from "react";
import type { Option } from "../types/product.types";
export default function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: Option[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const id = useId();
  return (
    <details open className="group border-b border-border py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium uppercase tracking-widest text-primary [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-4 text-accent transition-transform group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <fieldset className="mt-5 max-h-72 space-y-3 overflow-y-auto overscroll-contain pr-2">
        <legend className="sr-only">{title}</legend>
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-3">
            <Input
              id={id + option.id}
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="size-4 shrink-0 cursor-pointer accent-accent"
            />
            <Label
              htmlFor={id + option.id}
              className="cursor-pointer text-xs font-normal leading-6 text-secondary"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </fieldset>
    </details>
  );
}
