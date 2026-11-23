export type DashboardLocale = "en" | "zh";

export type DashboardNavKey =
  | "overview"
  | "inventory"
  | "catalog"
  | "orders"
  | "customers"
  | "security";

export type DashboardNavGroupKey = "operations" | "system";

export type DashboardLayoutDictionary = {
  brandSubtitle: string;
  groups: Record<DashboardNavGroupKey, string>;
  nav: Record<DashboardNavKey, string>;
  sessionActive: string;
  roleLabel: string;
  storefront: string;
  languageLabel: string;
  signOut: string;
};

export type DashboardPageMetaDictionary = {
  badge: string;
  title: string;
  description: string;
};

export type DashboardDictionary = {
  layout: DashboardLayoutDictionary;
  overview: DashboardPageMetaDictionary;
  inventory: DashboardPageMetaDictionary;
  catalog: DashboardPageMetaDictionary;
  orders: DashboardPageMetaDictionary;
  customers: DashboardPageMetaDictionary;
  security: DashboardPageMetaDictionary;
};