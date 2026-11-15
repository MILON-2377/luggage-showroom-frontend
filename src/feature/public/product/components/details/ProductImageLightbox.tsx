"use client";
import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductImageLightbox({
  images,
  name,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  name: string;
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const ref = useRef<HTMLDialogElement>(null);
  const open = index !== null && Boolean(images[index]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [open]);
  function step(delta: number) {
    if (index !== null && images.length)
      onIndex((index + delta + images.length) % images.length);
  }
  return (
    <dialog
      ref={ref}
      aria-label={name}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        }
      }}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[94vw] max-w-5xl overflow-auto rounded-3xl border border-accent/30 bg-background p-5 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-md"
    >
      <header className="flex items-center justify-between gap-5">
        <p className="font-serif text-xl">{name}</p>
        <Button
          autoFocus
          variant="outline"
          size="icon"
          onClick={onClose}
          aria-label={c.close}
          className="shrink-0 rounded-full"
        >
          <X className="size-4" />
        </Button>
      </header>
      {open && (
        <img
          src={images[index!]}
          alt={name}
          className="mx-auto my-5 max-h-[70dvh] w-full object-contain"
        />
      )}
      <footer className="flex items-center justify-center gap-5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => step(-1)}
          disabled={images.length < 2}
          aria-label={c.previous}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span aria-live="polite" className="text-xs tabular-nums">
          {(index ?? 0) + 1} / {images.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => step(1)}
          disabled={images.length < 2}
          aria-label={c.next}
        >
          <ChevronRight className="size-4" />
        </Button>
      </footer>
    </dialog>
  );
}
