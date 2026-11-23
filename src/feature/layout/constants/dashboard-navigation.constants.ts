import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";

import type {
  DashboardLayoutDictionary,
  DashboardLocale,
} from "../types/dashboard-dictionary.types";
import type { DashboardNavItem } from "../types/dashboard-navigation.types";

export const DASHBOARD_NAV_ITEMS: readonly DashboardNavItem[] = [
  {
    key: "overview",
    code: "01",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "operations",
  },
  {
    key: "inventory",
    code: "02",
    href: "/dashboard/inventory",
    icon: Package,
    group: "operations",
  },
  {
    key: "catalog",
    code: "03",
    href: "/dashboard/catalog",
    icon: FolderKanban,
    group: "operations",
  },
  {
    key: "orders",
    code: "04",
    href: "/dashboard/orders",
    icon: Briefcase,
    group: "operations",
  },
  {
    key: "customers",
    code: "05",
    href: "/dashboard/customers",
    icon: Users,
    group: "operations",
  },
  {
    key: "security",
    code: "SEC",
    href: "/dashboard/security",
    icon: ShieldCheck,
    group: "system",
  },
] as const;

export const DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY: Record<
  DashboardLocale,
  DashboardLayoutDictionary
> = {
  en: {
    brandSubtitle: "Operations Console",
    groups: {
      operations: "Operations",
      system: "System",
    },
    nav: {
      overview: "Overview",
      inventory: "Inventory",
      catalog: "Catalog",
      orders: "Orders",
      customers: "Customers",
      security: "Security & MFA",
    },
    sessionActive: "Session Active",
    roleLabel: "ADMIN",
    storefront: "Storefront",
    languageLabel: "Language",
    signOut: "Sign Out",
  },
  zh: {
    brandSubtitle: "运营控制台",
    groups: {
      operations: "业务运营",
      system: "系统管理",
    },
    nav: {
      overview: "总览",
      inventory: "库存管理",
      catalog: "商品目录",
      orders: "订单管理",
      customers: "客户管理",
      security: "安全与验证",
    },
    sessionActive: "会话已激活",
    roleLabel: "管理员",
    storefront: "访问前台",
    languageLabel: "语言设置",
    signOut: "退出登录",
  },
};