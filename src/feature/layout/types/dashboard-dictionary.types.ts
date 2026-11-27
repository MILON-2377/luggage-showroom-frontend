import type { DashboardNavKey } from "./dashboard-navigation.types";

export type DashboardLocale = "en" | "zh";

export type DashboardPageMeta = {
  badge: string;
  title: string;
};

export type DashboardLayoutDictionary = {
  brandSubtitle: string;
  groups: {
    operations: string;
    system: string;
  };
  nav: {
    overview: string;
    inventory: string;
    catalog: string;
    catalogOverview: string;
    catalogProducts: string;
    catalogCategories: string;
    catalogAttributes: string;
    orders: string;
    customers: string;
    security: string;
  };
  sessionActive: string;
  roleLabel: string;
  storefront: string;
  languageLabel: string;
  signOut: string;
};

export type DashboardDictionary = Record<DashboardNavKey, DashboardPageMeta> & {
  layout: DashboardLayoutDictionary;
};