"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import ProductFilters from "./ProductFilters";
import type { FilterProps } from "../../types/product-query.types";
export default function MobileFilterDrawer({
  open,
  onClose,
  onClear,
  query,
  onChange,
}: { open: boolean; onClose: () => void; onClear: () => void } & FilterProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useLanguage();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={t.productPage.filters}
      className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-[min(92vw,400px)] max-w-none border-l border-accent/25 bg-background p-5 backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-serif text-2xl">{t.productPage.filters}</h2>
        <Button
          autoFocus
          variant="outline"
          size="icon"
          onClick={onClose}
          aria-label={t.productPage.close}
        >
          <X className="size-4" />
        </Button>
      </div>
      <ProductFilters query={query} onChange={onChange} onClear={onClear} />
      <Button onClick={onClose} className="mt-5 w-full">
        {t.productPage.showResults}
      </Button>
    </dialog>
  );
}
