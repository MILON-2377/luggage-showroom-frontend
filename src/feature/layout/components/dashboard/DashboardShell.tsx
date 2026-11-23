"use client";

import type { ReactNode } from "react";

import { useDashboardLayout } from "../../hooks/useDashboardLayout";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const { dictionary } = useDashboardLayout();

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-[var(--background)]">
      <div className="hidden lg:flex">
        <DashboardSidebar dictionary={dictionary.layout} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader dictionary={dictionary} />

        <main className="flex-1 px-5 py-8 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}