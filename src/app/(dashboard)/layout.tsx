import type { ReactNode } from "react";

import { AuthProvider } from "@/src/providers/AuthProvider";
import { DashboardShell } from "@/src/feature/layout";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}