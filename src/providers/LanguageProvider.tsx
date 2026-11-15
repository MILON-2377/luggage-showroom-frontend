// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// import en from "./dictionaries/en";
// import zh from "./dictionaries/zh";

// type Locale = "en" | "zh";

// const dictionaries = {
//   en,
//   zh,
// };

// type LanguageContextType = {
//   locale: Locale;
//   setLocale: (locale: Locale) => void;
//   t: typeof en;
// };

// const LanguageContext = createContext<
//   LanguageContextType | undefined
// >(undefined);

// export function LanguageProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [locale, setLocaleState] = useState<Locale>("en");

//   useEffect(() => {
//     const savedLocale = localStorage.getItem("language");

//     if (savedLocale === "en" || savedLocale === "zh") {
//       setLocaleState(savedLocale);
//     }
//   }, []);

//   const setLocale = (newLocale: Locale) => {
//     setLocaleState(newLocale);
//     localStorage.setItem("language", newLocale);
//   };

//   const value = {
//     locale,
//     setLocale,
//     t: dictionaries[locale],
//   };

//   return (
//     <LanguageContext.Provider value={value}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);

//   if (!context) {
//     throw new Error(
//       "useLanguage must be used inside LanguageProvider"
//     );
//   }

//   return context;
// }




"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import en from "./dictionaries/en";
import zh from "./dictionaries/zh";

type Locale = "en" | "zh";

const dictionaries = {
  en,
  zh,
};

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof en;
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("language");

    if (savedLocale === "en" || savedLocale === "zh") {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("language", newLocale);
  };

  // Temporary diagnostic logs
  console.log("Current locale:", locale);
  console.log("Dictionary keys:", Object.keys(dictionaries[locale]));
  console.log("About Us translations:", dictionaries[locale].aboutUs);

  const value = {
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
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
