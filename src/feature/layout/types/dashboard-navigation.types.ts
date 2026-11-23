import type { LucideIcon } from "lucide-react";

import type {
  DashboardNavGroupKey,
  DashboardNavKey,
} from "./dashboard-dictionary.types";

export type DashboardNavItem = {
  key: DashboardNavKey;
  code: string;
  href: string;
  icon: LucideIcon;
  group: DashboardNavGroupKey;
};