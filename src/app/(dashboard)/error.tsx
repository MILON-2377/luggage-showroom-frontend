"use client";

import { useEffect } from "react";

import { ErrorState } from "@/src/feature/common";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardErrorPage({
  error,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <ErrorState
      title="Dashboard view failed to load"
      description="A runtime error interrupted this dashboard screen. You can retry rendering or return to a safe route."
      error={error}
      onRetry={reset}
      homeHref="/dashboard"
    />
  );
}