
import { cn } from "@/src/lib/utils";

function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-surface-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
