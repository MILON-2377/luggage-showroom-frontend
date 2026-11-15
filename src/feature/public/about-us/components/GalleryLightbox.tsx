"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/src/providers";
import type { GalleryImage } from "./FactoryOfficeGallery";

interface GalleryLightboxProps {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function GalleryLightbox({ images, activeIndex, onClose, onChange }: GalleryLightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { t } = useLanguage();
  const copy = t.aboutUs.gallery;
  const isOpen = activeIndex !== null && Boolean(images[activeIndex]);

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    if (isOpen && !modal.open) modal.showModal();
    if (!isOpen && modal.open) modal.close();
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const image = activeIndex === null ? undefined : images[activeIndex];
  const previous = () => activeIndex !== null && onChange((activeIndex - 1 + images.length) % images.length);
  const next = () => activeIndex !== null && onChange((activeIndex + 1) % images.length);

  return (
    <dialog
      ref={dialog}
      aria-label={copy.title}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event) => {
        if (images.length < 2) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
        if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      }}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[94vw] max-w-6xl overflow-y-auto rounded-3xl border border-accent/30 bg-primary p-0 text-primary-foreground shadow-2xl backdrop:bg-black/85 backdrop:backdrop-blur-md"
    >
      {image && (
        <div className="relative">
          <header className="flex items-center justify-between gap-5 border-b border-primary-foreground/10 px-5 py-4">
            <p className="text-xs tracking-wide text-primary-foreground/70">{image.category || copy.title}</p>
            <button type="button" autoFocus onClick={onClose} aria-label={copy.closeImage} className="flex size-11 items-center justify-center rounded-full border border-accent/30 text-accent transition-colors hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>
          <div className="flex min-h-40 items-center justify-center bg-black/20 p-3 sm:p-6">
            <img src={image.src} alt={image.alt || copy.imageAlt} className="max-h-[65dvh] w-auto max-w-full rounded-lg object-contain" />
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7">
            <p className="max-w-xl font-serif text-xl">{image.alt || copy.imageAlt}</p>
            <div className="flex items-center gap-4">
              {images.length > 1 && <button type="button" onClick={previous} aria-label={copy.previousImage} className="flex size-11 items-center justify-center rounded-full border border-accent/30 text-accent hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-accent"><ChevronLeft className="size-5" aria-hidden="true" /></button>}
              <span className="text-xs tabular-nums text-primary-foreground/65" aria-live="polite">{(activeIndex ?? 0) + 1} / {images.length}</span>
              {images.length > 1 && <button type="button" onClick={next} aria-label={copy.nextImage} className="flex size-11 items-center justify-center rounded-full border border-accent/30 text-accent hover:bg-accent/15 focus-visible:outline-2 focus-visible:outline-accent"><ChevronRight className="size-5" aria-hidden="true" /></button>}
            </div>
          </footer>
        </div>
      )}
    </dialog>
  );
}
