"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Compass, Home } from "lucide-react";

import { Button } from "@/src/components/ui/button";

type NotFoundStateProps = {
  code?: string;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  backHref?: string;
  backLabel?: string;
};

export function NotFoundState({
  code = "404",
  title = "Page not found",
  description = "The page or resource you are looking for does not exist or may have been moved.",
  primaryHref = "/dashboard",
  primaryLabel = "Go to Dashboard",
  backHref,
  backLabel = "Go Back",
}: NotFoundStateProps) {
  const router = useRouter();

  function handleBack() {
    if (backHref) {
      router.push(backHref);
      return;
    }
    router.back();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6 text-center">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--accent)]">
          <Compass className="size-5" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <p className="font-mono text-xs font-semibold tracking-wider text-[var(--muted-foreground)] uppercase">
            Error {code}
          </p>
          <h1 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h1>
          <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <Button
            type="button"
            size="sm"
            onClick={() => router.push(primaryHref)}
          >
            <Home className="mr-1.5 size-3.5" aria-hidden="true" />
            {primaryLabel}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-1.5 size-3.5" aria-hidden="true" />
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
