
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center",
    "whitespace-nowrap rounded-md border px-2 py-0.5",
    "text-xs font-medium",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring/20",
    "[&>svg]:size-3 [&>svg]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",

        secondary:
          "border-transparent bg-surface-muted text-foreground",

        outline:
          "border-border bg-transparent text-foreground",

        accent:
          "border-transparent bg-accent text-accent-foreground",

        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
