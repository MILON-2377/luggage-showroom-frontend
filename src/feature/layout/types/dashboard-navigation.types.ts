import type { LucideIcon } from "lucide-react";

export type DashboardNavGroup = "operations" | "system";

export type DashboardNavKey =
  | "overview"
  | "inventory"
  | "catalog"
  | "orders"
  | "customers"
  | "security";

export type DashboardCatalogSubKey =
  | "catalogOverview"
  | "catalogProducts"
  | "catalogCategories"
  | "catalogAttributes";

export type DashboardSubNavItem = {
  key: DashboardCatalogSubKey;
  href: string;
  icon?: LucideIcon;
  exact?: boolean;
};

export type DashboardNavItem = {
  key: DashboardNavKey;
  code: string;
  href: string;
  icon: LucideIcon;
  group: DashboardNavGroup;
  children?: readonly DashboardSubNavItem[];
};


export type DashboardNavGroupKey = "operations" | "system";