"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink, Globe } from "lucide-react";

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
    <div className="space-y-6 px-3 py-4">
      {NAV_GROUPS.map((groupKey, groupIndex) => {
        const items = DASHBOARD_NAV_ITEMS.filter(
          (item) => item.group === groupKey,
        );

        return (
          <div key={groupKey}>
            {groupIndex > 0 && (
              <Separator className="mb-5 bg-[var(--border)]/70" />
            )}

            <nav aria-label={dict.groups[groupKey]}>
              <div className="mb-2 px-2.5 text-[11px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                {dict.groups[groupKey]}
              </div>

              <ul className="space-y-0.5">
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
                        <div className="space-y-0.5">
                          <div
                            className={`group flex items-center justify-between rounded-lg transition-colors ${
                              active && !hasActiveChild
                                ? "bg-[var(--accent)]/12 text-[var(--foreground)] font-medium"
                                : active
                                  ? "text-[var(--foreground)] font-medium"
                                  : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                            }`}
                          >
                            <Link
                              href={item.href}
                              onClick={onNavigate}
                              aria-current={
                                pathname === item.href ? "page" : undefined
                              }
                              className="relative flex min-w-0 flex-1 items-center gap-2.5 py-2 pr-1.5 pl-3 text-[13px]"
                            >
                              {active && !hasActiveChild && (
                                <span
                                  aria-hidden="true"
                                  className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r bg-[var(--accent)]"
                                />
                              )}

                              <Icon
                                className={`size-4 shrink-0 transition-colors ${
                                  active
                                    ? "text-[var(--accent)]"
                                    : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
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
                              className="mr-1.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
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
                            <ul className="mt-1 ml-5 space-y-0.5 border-l border-[var(--border)] pl-2.5">
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
                                      className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] transition-colors ${
                                        subActive
                                          ? "bg-[var(--accent)]/12 font-medium text-[var(--accent)]"
                                          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)]/70 hover:text-[var(--foreground)]"
                                      }`}
                                    >
                                      {SubIcon ? (
                                        <SubIcon
                                          className={`size-3.5 shrink-0 ${
                                            subActive
                                              ? "text-[var(--accent)]"
                                              : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                                          }`}
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <span
                                          className={`size-1.5 shrink-0 rounded-full ${
                                            subActive
                                              ? "bg-[var(--accent)]"
                                              : "bg-[var(--muted-foreground)]/40"
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
                          className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors ${
                            active
                              ? "bg-[var(--accent)]/12 font-medium text-[var(--foreground)]"
                              : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          {active && (
                            <span
                              aria-hidden="true"
                              className="absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r bg-[var(--accent)]"
                            />
                          )}

                          <Icon
                            className={`size-4 shrink-0 transition-colors ${
                              active
                                ? "text-[var(--accent)]"
                                : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
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
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
      <div className="flex flex-col">
        {/* Top Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex min-w-0 items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-[var(--surface-muted)]"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/15 font-mono text-xs font-bold text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
              BG
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-wider text-[var(--foreground)]">
                BAGGUAGE
              </div>
              <div className="truncate text-[11px] text-[var(--muted-foreground)]">
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
      <div className="space-y-3 border-t border-[var(--border)] p-3">
        <div className="rounded-lg bg-[var(--surface-muted)]/60 p-2.5">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Globe
                className="size-3.5 text-[var(--accent)]"
                aria-hidden="true"
              />
              {dict.languageLabel}
            </span>

            <span className="font-mono text-[10px] font-semibold text-[var(--accent)]">
              {activeLocale.toUpperCase()}
            </span>
          </div>

          <LanguageSwitcher ariaLabel={dict.languageLabel} />
        </div>

        <div className="flex items-center justify-between px-1.5 text-[11px] text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-emerald-500"
            />
            {dict.sessionActive}
          </span>

          <span className="rounded bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--foreground)]">
            {dict.roleLabel}
          </span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          <LogoutButton />

          <Link
            href="/"
            onClick={onNavigate}
            className="flex h-9 w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <span>{dict.storefront}</span>
            <ExternalLink
              className="size-3.5 text-[var(--muted-foreground)]"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}