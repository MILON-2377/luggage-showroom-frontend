"use client";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductColorSelector({
  colors,
  selected,
  onSelect,
}: {
  colors: { id: string; hex: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const labels: Record<string, string> = c.colorNames;
  return (
    <div className="border-y border-border py-5">
      <p className="text-[10px] uppercase tracking-widest text-secondary">
        {c.colors}
      </p>
      {colors.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((color) => (
            <Button
              key={color.id}
              variant="outline"
              size="sm"
              aria-pressed={selected === color.id}
              onClick={() => onSelect(color.id)}
              className={
                "gap-2 rounded-full text-xs " +
                (selected === color.id
                  ? "border-accent ring-1 ring-accent/25"
                  : "")
              }
            >
              <span
                aria-hidden="true"
                style={{ backgroundColor: color.hex }}
                className="size-3 rounded-full border border-primary/15"
              />
              {labels[color.id] || color.id}
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-7 text-secondary">
          {c.colorsPending}
        </p>
      )}
    </div>
  );
}
