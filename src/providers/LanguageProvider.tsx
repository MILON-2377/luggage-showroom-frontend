"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import en from "./dictionaries/en";
import zh from "./dictionaries/zh";

type Locale = "en" | "zh";

const dictionaries = {
  en,
  zh,
} as const;

const STORAGE_KEY = "language";
const LOCALE_CHANGE_EVENT = "bagguage-language-change";

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): Locale {
  try {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY);
    return savedLocale === "en" || savedLocale === "zh" ? savedLocale : "en";
  } catch {
    return "en";
  }
}

function getServerSnapshot(): Locale {
  return "en";
}

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setLocale = useCallback((newLocale: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, newLocale);
      window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, []);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t: dictionaries[locale],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}