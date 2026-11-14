
"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/src/lib/utils";

type SheetSide = "left" | "right" | "top" | "bottom";

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function SheetTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return <DialogPrimitive.Trigger {...props} />;
}

function SheetClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return <DialogPrimitive.Close {...props} />;
}

function SheetContent({
  side = "right",
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & {
  side?: SheetSide;
  showCloseButton?: boolean;
}) {
  const sideClasses: Record<SheetSide, string> = {
    right:
      "inset-y-0 right-0 h-full w-[85%] max-w-sm border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
    left:
      "inset-y-0 left-0 h-full w-[85%] max-w-sm border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
    top:
      "inset-x-0 top-0 w-full max-h-[85vh] border-b data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
    bottom:
      "inset-x-0 bottom-0 w-full max-h-[85vh] border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
  };

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/45",
          "transition-opacity duration-300",
          "data-[starting-style]:opacity-0",
          "data-[ending-style]:opacity-0"
        )}
      />

      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 flex flex-col gap-4",
          "border-border bg-surface p-6 text-foreground shadow-xl",
          "outline-none transition-transform duration-300",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            aria-label="Close panel"
            className={cn(
              "absolute right-4 top-4 rounded-sm p-1",
              "text-muted-foreground transition-colors",
              "hover:bg-surface-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring/20"
            )}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
