"use client";
import { useEffect, useRef } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import ProductCardGallery from "./ProductCardGallery";
import type { Product, ProductCopy } from "./types/product.types";
export default function ProductQuickView({
  product,
  copy,
  onClose,
  onInquire,
}: {
  product: Product | null;
  copy?: ProductCopy;
  onClose: () => void;
  onInquire: (product: Product) => void;
}) {
  const { t } = useLanguage();
  const c = t.productPage;
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
    if (!product) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [product]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={copy?.name || c.quickView}
      className="fixed inset-0 m-auto max-h-[92dvh] w-[94vw] max-w-4xl overflow-y-auto rounded-[30px] border border-accent/30 bg-background p-5 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md sm:p-8"
    >
      <div className="mb-5 flex justify-end">
        <Button
          autoFocus
          variant="outline"
          size="icon"
          onClick={onClose}
          aria-label={c.close}
          className="rounded-full"
        >
          <X className="size-4" />
        </Button>
      </div>
      {product && copy && (
        <div className="grid items-center gap-8 md:grid-cols-2">
          <ProductCardGallery
            key={product.id}
            images={product.images}
            name={copy.name}
          />
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-accent">
              {c.concept} / {product.id.toUpperCase()}
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight">
              {copy.name}
            </h2>
            <p className="mt-5 text-sm leading-8 text-secondary">
              {copy.description}
            </p>
            <dl className="mt-6 space-y-5 border-y border-border py-5">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-accent">
                  {c.materialsTitle}
                </dt>
                <dd className="mt-2 text-sm">
                  {product.materials
                    .map((id) => c.materials.find((m) => m.id === id)?.label)
                    .join(" / ")}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-accent">
                  {c.customizationTitle}
                </dt>
                <dd className="mt-2 text-sm leading-7">
                  {product.customization
                    .map(
                      (id) => c.customization.find((m) => m.id === id)?.label,
                    )
                    .join(" · ")}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs leading-6 text-secondary">
              {c.draftNotice}
            </p>
            <Button
              size="lg"
              onClick={() => onInquire(product)}
              className="mt-6 w-full gap-5 rounded-xl"
            >
              {c.inquire}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
