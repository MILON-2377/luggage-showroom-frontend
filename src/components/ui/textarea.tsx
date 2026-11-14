
import * as React from "react";

import { cn } from "@/src/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-28 w-full min-w-0 rounded-md border border-input",
        "bg-surface px-3 py-3 text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors duration-200",
        "outline-none resize-y",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
