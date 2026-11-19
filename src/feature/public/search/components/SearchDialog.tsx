"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import SearchSection from "./SearchSection";

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-3xl border border-accent/20 bg-background p-0 text-foreground shadow-2xl backdrop:bg-primary/60 backdrop:backdrop-blur-sm"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-8">
        <h2
          id={titleId}
          className="font-serif text-xl text-primary sm:text-2xl"
        >
          {t.search.dialogTitle}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={t.search.close}
          className="shrink-0 rounded-full"
        >
          <X className="size-5" aria-hidden="true" />
        </Button>
      </div>

      {open && (
        <div className="p-5 sm:p-8">
          <SearchSection
            compact
            autoFocus
            onNavigate={onClose}
          />
        </div>
      )}
    </dialog>
  );
}