"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ArrowUpRight, Globe, ShoppingBag } from "lucide-react";

import { Separator } from "@/src/components/ui/seperator";
import { LogoutButton } from "@/src/feature/auth/logout/components/LogoutButton";
import { LanguageSwitcher } from "@/src/feature/common/components/LanguageSwitcher";
import { useLanguage } from "@/src/providers";

import {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY,
} from "../../constants/dashboard-navigation.constants";
import type {
  DashboardLayoutDictionary,
  DashboardLocale,
} from "../../types/dashboard-dictionary.types";
import type { DashboardNavGroupKey } from "../../types/dashboard-navigation.types";

type DashboardSidebarProps = {
  dictionary?: DashboardLayoutDictionary;
  onNavigate?: () => void;
};

const NAV_GROUPS: readonly DashboardNavGroupKey[] = ["operations", "system"];

type DashboardSidebarNavProps = {
  dict: DashboardLayoutDictionary;
  pathname: string;
  onNavigate?: () => void;
};

function DashboardSidebarNavContent({
  dict,
  pathname,
  onNavigate,
}: DashboardSidebarNavProps) {
  const [manuallyExpanded, setManuallyExpanded] = useState<
    Record<string, boolean>
  >({});

  function isRouteActive(href: string, exact = false): boolean {
    if (!pathname) return false;
    if (exact || href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isGroupExpanded(itemHref: string): boolean {
    if (typeof manuallyExpanded[itemHref] === "boolean") {
      return manuallyExpanded[itemHref];
    }

    return isRouteActive(itemHref);
  }

  function toggleGroup(itemHref: string) {
    setManuallyExpanded((prev) => ({
      ...prev,
      [itemHref]: !isGroupExpanded(itemHref),
    }));
  }

  return (
    <div className="space-y-8 px-4 py-7">
      {NAV_GROUPS.map((groupKey, groupIndex) => {
        const items = DASHBOARD_NAV_ITEMS.filter(
          (item) => item.group === groupKey,
        );

        return (
          <div key={groupKey}>
            {groupIndex > 0 && (
              <Separator className="mb-6 bg-[#d5b581]/15" />
            )}

            <nav aria-label={dict.groups[groupKey]}>
              <div className="mb-4 px-3 text-[9px] font-semibold tracking-[0.24em] text-[#c9ae94] uppercase">
                {dict.groups[groupKey]}
              </div>

              <ul className="space-y-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = Boolean(item.children?.length);
                  const active = isRouteActive(item.href);
                  const expanded = hasChildren && isGroupExpanded(item.href);
                  const hasActiveChild = item.children?.some((sub) =>
                    isRouteActive(sub.href, sub.exact),
                  );

                  return (
                    <li key={item.href}>
                      {hasChildren ? (
                        <div className="space-y-2">
                          <div
                            className={`group flex items-center justify-between rounded-2xl border border-transparent transition-[background-color,box-shadow,transform] duration-200 motion-reduce:transition-none ${
                              active && !hasActiveChild
                                ? "border-[#f1cf8b]/60 bg-[radial-gradient(ellipse_at_30%_0%,#a65b52_0%,#5b2733_50%,#301821_100%)] font-semibold text-[#fff0d8] shadow-[0_3px_12px_#00000055,inset_0_1px_0_#f7d29899,inset_0_-1px_0_#d0a26166]"
                                : active
                                  ? "bg-white/[0.07] font-medium text-[#f5e6cd]"
                                  : "text-[#d9c5b8] hover:translate-x-1 hover:bg-white/[0.08] hover:text-[#fff4df] hover:shadow-[inset_0_1px_0_#e9ce9b26,0_6px_12px_#160b1226] motion-reduce:transform-none"
                            }`}
                          >
                            <Link
                              href={item.href}
                              onClick={onNavigate}
                              aria-current={
                                pathname === item.href ? "page" : undefined
                              }
                              className="relative flex min-h-12 min-w-0 flex-1 items-center gap-3 py-2.5 pr-1.5 pl-3 text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c98e] rounded-xl"
                            >
                              {active && !hasActiveChild && (
                                <span
                                  aria-hidden="true"
                                  className="absolute top-5 bottom-5 left-0 w-[3px] rounded-r bg-[#f2d295] shadow-[0_0_12px_#dfb77399]"
                                />
                              )}

                              <Icon
                                className={`size-8 shrink-0 rounded-full border border-current/20 bg-gradient-to-br from-white/10 to-black/10 p-[7px] shadow-[inset_0_1px_0_#fff1ce1a] transition-colors ${
                                  active
                                    ? "text-current"
                                    : "text-[#c8a57c] group-hover:text-[#ffe5ae]"
                                }`}
                                aria-hidden="true"
                              />

                              <span className="truncate">
                                {dict.nav[item.key]}
                              </span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => toggleGroup(item.href)}
                              aria-expanded={expanded}
                              aria-label={`Toggle ${dict.nav[item.key]} menu`}
                              className="mr-2 inline-flex size-8 shrink-0 items-center justify-center rounded-xl text-current transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c98e]"
                            >
                              <ChevronRight
                                className={`size-3.5 transition-transform duration-200 ${
                                  expanded ? "rotate-90" : "rotate-0"
                                }`}
                                aria-hidden="true"
                              />
                            </button>
                          </div>

                          {expanded && item.children && (
                            <ul className="mt-3 ml-7 space-y-2 border-l border-[#d9b57a]/25 pl-3">
                              {item.children.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const subActive = isRouteActive(
                                  subItem.href,
                                  subItem.exact,
                                );

                                return (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      onClick={onNavigate}
                                      aria-current={
                                        subActive ? "page" : undefined
                                      }
                                      className={`group flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c98e] ${
                                        subActive
                                          ? "bg-[#ecd3a0]/15 font-semibold text-[#ffe4ad] ring-1 ring-inset ring-[#e2c28b]/20"
                                          : "text-[#d9c5b8] hover:bg-white/[0.07] hover:text-[#fff4df]"
                                      }`}
                                    >
                                      {SubIcon ? (
                                        <SubIcon
                                          className={`size-3.5 shrink-0 ${
                                            subActive
                                              ? "text-current"
                                              : "text-[#c8a57c] group-hover:text-[#ffe5ae]"
                                          }`}
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <span
                                          className={`size-1.5 shrink-0 rounded-full ${
                                            subActive
                                              ? "bg-[#e1c18b]"
                                              : "bg-[#c8a57c]/40"
                                          }`}
                                        />
                                      )}

                                      <span className="truncate">
                                        {dict.nav[subItem.key]}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={`group relative flex min-h-12 items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-[13px] transition-[background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c98e] motion-reduce:transition-none ${
                            active
                              ? "border-[#f1cf8b]/60 bg-[radial-gradient(ellipse_at_30%_0%,#a65b52_0%,#5b2733_50%,#301821_100%)] font-semibold text-[#fff0d8] shadow-[0_3px_12px_#00000055,inset_0_1px_0_#f7d29899,inset_0_-1px_0_#d0a26166]"
                              : "text-[#d9c5b8] hover:translate-x-1 hover:bg-white/[0.08] hover:text-[#fff4df] hover:shadow-[inset_0_1px_0_#e9ce9b26,0_6px_12px_#160b1226] motion-reduce:transform-none"
                          }`}
                        >
                          {active && (
                            <span
                              aria-hidden="true"
                              className="absolute top-5 bottom-5 left-0 w-[3px] rounded-r bg-[#f2d295] shadow-[0_0_12px_#dfb77399]"
                            />
                          )}

                          <Icon
                            className={`size-8 shrink-0 rounded-full border border-current/20 bg-gradient-to-br from-white/10 to-black/10 p-[7px] shadow-[inset_0_1px_0_#fff1ce1a] transition-colors ${
                              active
                                ? "text-current"
                                : "text-[#c8a57c] group-hover:text-[#ffe5ae]"
                            }`}
                            aria-hidden="true"
                          />

                          <span className="truncate">
                            {dict.nav[item.key]}
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        );
      })}
    </div>
  );
}

function DashboardSidebarActiveNav({
  dict,
  onNavigate,
}: {
  dict: DashboardLayoutDictionary;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <DashboardSidebarNavContent
      dict={dict}
      pathname={pathname}
      onNavigate={onNavigate}
    />
  );
}

export function DashboardSidebar({
  dictionary,
  onNavigate,
}: DashboardSidebarProps) {
  const { locale } = useLanguage();

  const activeLocale: DashboardLocale = locale === "zh" ? "zh" : "en";
  const fallbackDict = DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY[activeLocale];

  const dict: DashboardLayoutDictionary = dictionary
    ? {
        ...fallbackDict,
        ...dictionary,
        groups: {
          ...fallbackDict.groups,
          ...dictionary.groups,
        },
        nav: {
          ...fallbackDict.nav,
          ...dictionary.nav,
        },
      }
    : fallbackDict;

  return (
    <aside className="relative flex h-full min-h-0 w-full shrink-0 flex-col justify-between overflow-y-auto overscroll-contain rounded-[26px] border border-[#e2c387]/45 bg-[linear-gradient(155deg,#60323a70,#261d2270_45%,#141113aa)] backdrop-blur-2xl backdrop-saturate-150 supports-[not(backdrop-filter:blur(1px))]:bg-[#2b1921] text-[#f6ecda] shadow-[inset_0_0_0_3px_#20171d66,inset_0_0_0_4px_#e0c18b14,8px_15px_45px_#00000060] [scrollbar-width:thin] [scrollbar-color:#9d7858_transparent] lg:w-[248px]">
      <div className="flex flex-col">
        {/* Top Brand Header */}
        <div className="flex min-h-36 items-center justify-start border-b border-[#d5b581]/20 px-5 py-6">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex min-w-0 items-center gap-3 rounded-xl py-1 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c98e]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#f5dfae] bg-gradient-to-br from-[#f3e2b8] to-[#b28b53] font-serif text-lg font-semibold text-[#522e2b] shadow-[2px_4px_0_#795633,inset_0_1px_0_#fff9e6]">
              <ShoppingBag className="size-5" strokeWidth={1.3} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="truncate font-serif text-[20px] font-medium tracking-[0.08em] text-[#fff2dc]">
                BAGGUAGE
              </div>
              <div className="mt-1 truncate text-[10px] text-[#c7ad98]">
                {dict.brandSubtitle}
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Groups */}
        <Suspense
          fallback={
            <DashboardSidebarNavContent
              dict={dict}
              pathname=""
              onNavigate={onNavigate}
            />
          }
        >
          <DashboardSidebarActiveNav dict={dict} onNavigate={onNavigate} />
        </Suspense>
      </div>

      {/* Bottom Utility Footer */}
      <div className="space-y-4 border-t border-[#d5b581]/20 bg-black/10 p-5">
        <div className="rounded-xl border border-[#e5c997]/15 bg-[#fff0d3]/[0.06] p-3 shadow-[inset_0_1px_0_#ffebc00d]">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#cbb5a1]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Globe
                className="size-3.5 text-[#e6c995]"
                aria-hidden="true"
              />
              {dict.languageLabel}
            </span>

            <span className="font-mono text-[10px] font-semibold text-[#e6c995]">
              {activeLocale.toUpperCase()}
            </span>
          </div>

          <LanguageSwitcher ariaLabel={dict.languageLabel} />
        </div>

        <div className="flex items-center justify-between px-1.5 text-[11px] text-[#cbb5a1]">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-emerald-500"
            />
            {dict.sessionActive}
          </span>

          <span className="rounded-full border border-[#d5b581]/20 bg-white/5 px-2 py-1 text-[9px] font-medium text-[#ead9bc]">
            {dict.roleLabel}
          </span>
        </div>

        <div className="space-y-2 pt-0.5 [&_button[data-slot=button]]:rounded-xl [&_button[data-slot=button]]:border-[#d5b581]/25 [&_button[data-slot=button]]:bg-white/5 [&_button[data-slot=button]]:text-[#f6e8d1] [&_button[data-slot=button]:hover]:bg-white/10">
          <LogoutButton />

          <Link
            href="/"
            onClick={onNavigate}
            className="group flex h-12 w-full items-center justify-between rounded-full border border-[#ebd4a3]/35 bg-gradient-to-br from-[#e4cda0] to-[#bc985f] px-3 text-xs font-semibold text-[#36241f] shadow-[0_3px_0_#765437] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4c98e] motion-reduce:transform-none"
          >
            <span>{dict.storefront}</span>
            <span className="flex size-8 items-center justify-center rounded-full border border-[#f7e3b5] bg-gradient-to-br from-[#fff0c7] to-[#aa7e46] text-[#48291f] shadow-[0_2px_0_#805c33,inset_0_1px_0_white]"><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" /></span>
          </Link>
        </div>
      </div>
    </aside>
  );
}