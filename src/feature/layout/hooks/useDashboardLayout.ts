"use client";

import { useLanguage } from "@/src/providers";

import en from "@/src/providers/dictionaries/en";
import zh from "@/src/providers/dictionaries/zh";

import type {
  DashboardDictionary,
  DashboardLocale,
} from "../types/dashboard-dictionary.types";

export function useDashboardLayout() {
  const { locale } = useLanguage();

  const activeLocale: DashboardLocale = locale === "zh" ? "zh" : "en";

  const dictionary: DashboardDictionary =
    activeLocale === "zh" ? zh.dashboardPage : en.dashboardPage;

  return {
    locale: activeLocale,
    dictionary,
  };
}