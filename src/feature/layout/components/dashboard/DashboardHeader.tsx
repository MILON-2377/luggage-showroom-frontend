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
      <span className="hidden shrink-0 rounded-lg border border-[#dbc49a] bg-gradient-to-br from-[#f9edcf] to-[#e8d7b5] px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#795b35] shadow-[0_2px_0_#d4bd94,inset_0_1px_0_#ffffff] uppercase sm:inline-block">
        {pageMeta.badge}
      </span>

      <span className="truncate text-sm font-semibold tracking-tight text-[#f2e5ce] sm:text-base">
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
      <span className="hidden shrink-0 rounded-lg border border-[#dbc49a] bg-gradient-to-br from-[#f9edcf] to-[#e8d7b5] px-2.5 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#795b35] shadow-[0_2px_0_#d4bd94,inset_0_1px_0_#ffffff] uppercase sm:inline-block">
        {defaultMeta.badge}
      </span>
      <span className="truncate text-sm font-semibold tracking-tight text-[#f2e5ce] sm:text-base">
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
    <header className="sticky top-0 z-20 rounded-b-[14px] border border-[#b19772]/25 bg-gradient-to-r from-[#282521]/95 via-[#35302a]/95 to-[#211f1d]/95 shadow-[0_6px_28px_#00000030,inset_0_1px_0_#ffffff10] backdrop-blur-xl lg:top-4 lg:mx-6 lg:rounded-[20px]">
      <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3.5">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#dbc49a] bg-gradient-to-br from-[#fff5de] to-[#e4c99c] text-[#573b32] shadow-[0_3px_0_#c3a77b] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a58b65] motion-reduce:transform-none lg:hidden">
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Open navigation menu</span>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[min(340px,92vw)] max-w-[92vw] gap-0 rounded-r-[28px] border-r border-[#d8bc82]/40 bg-[#281a2160] p-2 backdrop-blur-2xl [&>button]:z-10 [&>button]:text-[#e8d3b0]"
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
        <div className="flex max-w-[130px] min-w-0 shrink-0 items-center gap-2.5 rounded-2xl border border-[#d8c29e]/60 bg-gradient-to-br from-[#403831] to-[#27221f] p-1.5 pr-3 shadow-[0_3px_10px_#00000040,inset_0_1px_0_#ffffff15] sm:max-w-[220px]">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#c5a16e] bg-gradient-to-br from-[#63313d] to-[#2b1921] shadow-[inset_0_1px_0_#ffffff30] [&>span]:text-[#f0d7a3] [&>svg]:text-[#f0d7a3]">
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

          <span className="truncate text-xs font-semibold text-[#f0e4d1]">
            {isLoading ? "Loading..." : adminName ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}