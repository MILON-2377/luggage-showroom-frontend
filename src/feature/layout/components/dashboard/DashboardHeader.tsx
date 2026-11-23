"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, UserRound } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useAuth } from "@/src/providers/AuthProvider";

import { DASHBOARD_NAV_ITEMS } from "../../constants/dashboard-navigation.constants";
import type {
  DashboardDictionary,
  DashboardNavKey,
} from "../../types/dashboard-dictionary.types";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardHeaderProps = {
  dictionary: DashboardDictionary;
};

export function DashboardHeader({ dictionary }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [imgError, setImgError] = useState(false);

  const activeNav =
    DASHBOARD_NAV_ITEMS.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? DASHBOARD_NAV_ITEMS[0];

  const activeKey: DashboardNavKey = activeNav.key;
  const pageMeta = dictionary[activeKey];

  const adminName = user
    ? user.profile.display_name ||
      [user.profile.first_name, user.profile.last_name]
        .filter(Boolean)
        .join(" ") ||
      user.email
    : null;

  const avatarUrl =
    user && "avatar_url" in user.profile
      ? (user.profile.avatar_url as string | null | undefined)
      : null;

  const initials = adminName
    ? adminName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
        <div className="flex items-center gap-3.5">
          <Sheet>
            <SheetTrigger className="inline-flex size-9 items-center justify-center border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface)] lg:hidden">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Open navigation menu</span>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-64 rounded-none border-r border-[var(--border)] bg-[var(--surface)] p-0"
            >
              <SheetTitle className="sr-only">
                BAGGUAGE Navigation
              </SheetTitle>

              <DashboardSidebar dictionary={dictionary.layout} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <span className="hidden border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)] uppercase sm:inline-block">
              {pageMeta.badge}
            </span>

            <span className="text-xs font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase sm:text-sm">
              {pageMeta.title}
            </span>
          </div>
        </div>

        {/* Google-style profile pill */}
        <div className="flex max-w-[220px] min-w-0 items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] py-1 pr-3.5 pl-1 transition-colors hover:border-[var(--accent)]">
          <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)]">
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={adminName ?? "Admin avatar"}
                onError={() => setImgError(true)}
                className="size-full object-cover"
              />
            ) : initials ? (
              <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--accent)]">
                {initials}
              </span>
            ) : (
              <UserRound
                className="size-4 text-[var(--accent)]"
                aria-hidden="true"
              />
            )}
          </div>

          <span className="truncate text-xs font-semibold text-[var(--foreground)]">
            {isLoading ? "Loading..." : adminName ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}