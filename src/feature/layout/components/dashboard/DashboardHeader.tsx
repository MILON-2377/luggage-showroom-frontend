"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, UserRound } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useLanguage } from "@/src/providers";
import { useAuth } from "@/src/providers/AuthProvider";

import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY,
} from "../../constants/dashboard-navigation.constants";
import type {
  DashboardDictionary,
  DashboardLocale,
} from "../../types/dashboard-dictionary.types";
import type { DashboardNavKey } from "../../types/dashboard-navigation.types";
import { DashboardSidebar } from "./DashboardSidebar";

type DashboardHeaderProps = {
  dictionary: DashboardDictionary;
};

function DashboardHeaderBreadcrumb({
  dictionary,
}: {
  dictionary: DashboardDictionary;
}) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  const activeLocale: DashboardLocale = locale === "zh" ? "zh" : "en";
  const fallbackNav = DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY[activeLocale].nav;

  const activeNav =
    DASHBOARD_NAV_ITEMS.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? DASHBOARD_NAV_ITEMS[0];

  const activeSubNav = activeNav.children?.find((subItem) =>
    subItem.exact
      ? pathname === subItem.href
      : pathname === subItem.href || pathname.startsWith(`${subItem.href}/`),
  );

  const activeKey: DashboardNavKey = activeNav.key;
  const pageMeta = dictionary[activeKey];
  const subNavLabel = activeSubNav
    ? (dictionary.layout?.nav?.[activeSubNav.key] ??
      fallbackNav[activeSubNav.key])
    : null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="hidden shrink-0 border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)] uppercase sm:inline-block">
        {pageMeta.badge}
      </span>

      <span className="truncate text-xs font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase sm:text-sm">
        {pageMeta.title}
      </span>

      {subNavLabel && (
        <>
          <span
            aria-hidden="true"
            className="font-mono text-xs text-[var(--muted-foreground)]"
          >
            /
          </span>
          <span className="truncate font-mono text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
            {subNavLabel}
          </span>
        </>
      )}
    </div>
  );
}

function DashboardHeaderBreadcrumbFallback({
  dictionary,
}: {
  dictionary: DashboardDictionary;
}) {
  const defaultMeta = dictionary[DASHBOARD_NAV_ITEMS[0].key];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="hidden shrink-0 border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)] uppercase sm:inline-block">
        {defaultMeta.badge}
      </span>
      <span className="truncate text-xs font-semibold tracking-[0.18em] text-[var(--foreground)] uppercase sm:text-sm">
        {defaultMeta.title}
      </span>
    </div>
  );
}

export function DashboardHeader({ dictionary }: DashboardHeaderProps) {
  const { user, isLoading } = useAuth();
  const [imgError, setImgError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="flex min-w-0 items-center gap-3.5">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="inline-flex size-9 shrink-0 items-center justify-center border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface)] lg:hidden">
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

              <Suspense fallback={null}>
                <DashboardSidebar
                  dictionary={dictionary.layout}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </Suspense>
            </SheetContent>
          </Sheet>

          <Suspense
            fallback={
              <DashboardHeaderBreadcrumbFallback dictionary={dictionary} />
            }
          >
            <DashboardHeaderBreadcrumb dictionary={dictionary} />
          </Suspense>
        </div>

        {/* Google-style profile pill */}
        <div className="flex max-w-[220px] min-w-0 shrink-0 items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] py-1 pr-3.5 pl-1 transition-colors hover:border-[var(--accent)]">
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