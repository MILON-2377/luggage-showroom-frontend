"use client";

import { useLanguage } from "@/src/providers";


export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLocale("en")}
        className={`text-sm font-medium transition-colors ${
          locale === "en"
            ? "text-black"
            : "text-gray-400 hover:text-black"
        }`}
      >
        EN
      </button>

      <span className="text-gray-300">|</span>

      <button
        onClick={() => setLocale("zh")}
        className={`text-sm font-medium transition-colors ${
          locale === "zh"
            ? "text-black"
            : "text-gray-400 hover:text-black"
        }`}
      >
        中文
      </button>
    </div>
  );
}