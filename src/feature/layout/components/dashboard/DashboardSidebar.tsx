"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Globe } from "lucide-react";

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
  DashboardNavGroupKey,
} from "../../types/dashboard-dictionary.types";

type DashboardSidebarProps = {
  dictionary?: DashboardLayoutDictionary;
};

const NAV_GROUPS: readonly DashboardNavGroupKey[] = ["operations", "system"];

export function DashboardSidebar({ dictionary }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { locale } = useLanguage();

  const activeLocale: DashboardLocale = locale === "zh" ? "zh" : "en";
  const dict =
    dictionary ?? DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY[activeLocale];

  function isRouteActive(href: string): boolean {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
      <div>
        <div className="h-[3px] w-full bg-[var(--accent)]" />

        <div className="space-y-6 p-5">
          <div className="border-b border-[var(--border)] pb-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center border border-[var(--accent)] bg-[var(--surface-muted)] font-mono text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">
                BG
              </span>

              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-[0.22em] text-[var(--foreground)] uppercase">
                  BAGGUAGE
                </span>
                <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--muted-foreground)] uppercase">
                  {dict.brandSubtitle}
                </span>
              </div>
            </Link>
          </div>

          {NAV_GROUPS.map((groupKey, index) => {
            const items = DASHBOARD_NAV_ITEMS.filter(
              (item) => item.group === groupKey,
            );

            return (
              <div key={groupKey} className="space-y-6">
                {index > 0 && <Separator className="bg-[var(--border)]" />}

                <nav aria-label={dict.groups[groupKey]} className="space-y-2">
                  <div className="px-2 pb-1 font-mono text-[10px] font-semibold tracking-[0.24em] text-[var(--muted-foreground)] uppercase">
                    {dict.groups[groupKey]}
                  </div>

                  <ul className="space-y-1">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = isRouteActive(item.href);

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={
                              active
                                ? "group flex w-full items-center justify-between border border-[var(--primary)] bg-[var(--primary)] px-3 py-2.5 text-[var(--primary-foreground)] transition-colors"
                                : "group flex w-full items-center justify-between border border-transparent bg-transparent px-3 py-2.5 text-[var(--foreground)] transition-colors hover:border-[var(--border)] hover:bg-[var(--surface-muted)]"
                            }
                          >
                            <span className="flex items-center gap-3">
                              <Icon
                                className={
                                  active
                                    ? "size-4 text-[var(--accent)]"
                                    : "size-4 text-[var(--secondary)] transition-colors group-hover:text-[var(--accent)]"
                                }
                                aria-hidden="true"
                              />

                              <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                                {dict.nav[item.key]}
                              </span>
                            </span>

                            <span
                              className={
                                active
                                  ? "font-mono text-[10px] tracking-[0.16em] text-[var(--accent)]"
                                  : "font-mono text-[10px] tracking-[0.16em] text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                              }
                            >
                              {item.code}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-[var(--border)] bg-[var(--surface-muted)]/60 p-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[10px] font-semibold tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
            <span className="flex items-center gap-1.5">
              <Globe
                className="size-3 text-[var(--accent)]"
                aria-hidden="true"
              />
              {dict.languageLabel}
            </span>

            <span className="text-[var(--accent)]">
              {activeLocale.toUpperCase()}
            </span>
          </div>

          <LanguageSwitcher ariaLabel={dict.languageLabel} />
        </div>

        <Separator className="bg-[var(--border)]" />

        <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)] uppercase">
          <span>{dict.sessionActive}</span>
          <span className="font-mono text-[var(--muted-foreground)]">
            {dict.roleLabel}
          </span>
        </div>

        <LogoutButton />

        <Link
          href="/"
          className="flex h-10 w-full items-center justify-between border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--foreground)] uppercase transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-muted)]"
        >
          <span>{dict.storefront}</span>
          <ExternalLink
            className="size-3.5 text-[var(--muted-foreground)]"
            aria-hidden="true"
          />
        </Link>
      </div>
    </aside>
  );
}