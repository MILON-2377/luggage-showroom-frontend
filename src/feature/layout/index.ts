import { LanguageSwitcher } from '@/src/feature/common/components/LanguageSwitcher';
export { DashboardHeader } from "./components/dashboard/DashboardHeader";
export { DashboardShell } from "./components/dashboard/DashboardShell";
export { DashboardSidebar } from "./components/dashboard/DashboardSidebar";
export { LanguageSwitcher }
export {
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_SIDEBAR_FALLBACK_DICTIONARY,
} from "./constants/dashboard-navigation.constants";
export { useDashboardLayout } from "./hooks/useDashboardLayout";
export type {
  DashboardDictionary,
  DashboardLayoutDictionary,
  DashboardLocale,
  DashboardPageMeta,
} from "./types/dashboard-dictionary.types";

export type {
  DashboardNavItem,
  DashboardNavGroupKey,
  DashboardNavKey,
} from "./types/dashboard-navigation.types";