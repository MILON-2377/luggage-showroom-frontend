
"use client";

import Image from "next/image";
import { useLanguage } from "@/src/providers";

const navItems = [
  "Home",
  "About Us",
  "Products",
  "Manufacturing",
  "Quality",
  "Contact",
];

export default function Navbar() {
  const { locale, setLocale } = useLanguage();

  return (
    <header className="w-full bg-black text-white">

      {/* Top Language Bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-end px-6 lg:px-10">
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`transition-colors duration-300 ${
                locale === "en"
                  ? "font-semibold text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              EN
            </button>

            <span className="text-white/30">|</span>

            <button
              type="button"
              onClick={() => setLocale("zh")}
              className={`transition-colors duration-300 ${
                locale === "zh"
                  ? "font-semibold text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <div className="relative h-14 w-40 shrink-0">
          <Image
            src="/logo.svg"
            alt="Company Logo"
            fill
            priority
            sizes="160px"
            className="object-contain object-left"
          />
        </div>

        {/* Non-clickable Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <span
              key={item}
              className="cursor-default whitespace-nowrap text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Right Side Label */}
        <div className="hidden shrink-0 lg:block">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            Premium Manufacturing
          </span>
        </div>

      </nav>
    </header>
  );
}
