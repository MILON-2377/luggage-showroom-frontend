
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/src/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-lg border p-4",
    "[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "[&>svg+div]:translate-y-[-3px] [&>svg~div]:pl-7",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-foreground",
        success:
          "border-green-200 bg-green-50 text-green-900",
        warning:
          "border-amber-200 bg-amber-50 text-amber-900",
        destructive:
          "border-red-200 bg-red-50 text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"h5">) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-sm leading-relaxed opacity-90", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
