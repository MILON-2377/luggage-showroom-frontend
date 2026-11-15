"use client";
import { RotateCcw } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ClearFiltersButton({
  onClear,
  disabled = false,
}: {
  onClear: () => void;
  disabled?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      disabled={disabled}
      className="gap-2 px-0 text-xs"
    >
      <RotateCcw className="size-3.5" aria-hidden="true" />
      {t.productPage.clearFilters}
    </Button>
  );
}
