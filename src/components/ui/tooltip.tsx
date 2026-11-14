
"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/src/lib/utils";

function TooltipProvider(
  props: React.ComponentProps<typeof TooltipPrimitive.Provider>
) {
  return <TooltipPrimitive.Provider {...props} />;
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

function TooltipTrigger(
  props: React.ComponentProps<typeof TooltipPrimitive.Trigger>
) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 rounded-md bg-foreground px-3 py-1.5",
            "text-xs font-medium text-background shadow-md",
            "outline-none",
            "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
            "transition-all duration-150",
            className
          )}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
};
