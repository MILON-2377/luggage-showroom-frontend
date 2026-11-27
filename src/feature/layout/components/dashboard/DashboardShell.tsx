"use client";

import { Suspense, type ReactNode } from "react";

import { useDashboardLayout } from "../../hooks/useDashboardLayout";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardShellProps = {
  children: ReactNode;
};

function SidebarFallback() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)]">
      <div className="h-16 border-b border-[var(--border)] px-4" />
      <div className="flex-1 space-y-4 p-4">
        <div className="h-4 w-24 rounded bg-[var(--surface-muted)]" />
        <div className="h-8 w-full rounded bg-[var(--surface-muted)]" />
        <div className="h-8 w-full rounded bg-[var(--surface-muted)]" />
      </div>
      <div className="h-28 border-t border-[var(--border)] p-3" />
    </aside>
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
        <div className="h-5 w-40 rounded bg-[var(--surface-muted)]" />
        <div className="h-9 w-28 rounded-full bg-[var(--surface-muted)]" />
      </div>
    </header>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { dictionary } = useDashboardLayout();

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-[var(--background)]">
      <div className="hidden lg:flex">
        <Suspense fallback={<SidebarFallback />}>
          <DashboardSidebar dictionary={dictionary.layout} />
        </Suspense>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <DashboardHeader dictionary={dictionary} />
        </Suspense>

        <main className="flex-1 px-5 py-8 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}