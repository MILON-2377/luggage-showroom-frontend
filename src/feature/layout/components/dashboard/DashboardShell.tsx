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
    <aside className="flex h-full w-[248px] shrink-0 flex-col justify-between rounded-[26px] border border-[#d8bc82]/30 bg-[#351c23]">
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
    <header className="sticky top-0 z-20 rounded-[24px] border border-[#b19772]/25 bg-[#28231f]/95 shadow-sm lg:top-4 lg:mx-6">
      <div className="flex h-20 items-center justify-between gap-4 px-5 lg:px-8">
        <div className="h-5 w-40 rounded bg-[var(--surface-muted)]" />
        <div className="h-9 w-28 rounded-full bg-[var(--surface-muted)]" />
      </div>
    </header>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { dictionary } = useDashboardLayout();

  return (
    <div className="relative isolate flex min-h-screen bg-[#191615] bg-[radial-gradient(ellipse_at_0%_65%,#512931_0%,transparent_40%),radial-gradient(ellipse_at_70%_0%,#363028_0%,#211e1b_45%,#151515_100%)] text-[#efe4d0] selection:bg-[#63313d] selection:text-[#fff0d3]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[url(/surface.webp)] bg-cover bg-center opacity-100" />
      <div className="sticky top-0 hidden h-dvh shrink-0 p-4 pr-0 lg:flex">
        <Suspense fallback={<SidebarFallback />}>
          <DashboardSidebar dictionary={dictionary.layout} />
        </Suspense>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Suspense fallback={<HeaderFallback />}>
          <DashboardHeader dictionary={dictionary} />
        </Suspense>

        <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}