"use client";

import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

type LanguageSwitcherProps = {
  ariaLabel?: string;
};

export function LanguageSwitcher({
  ariaLabel = "Language",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid grid-cols-2 border border-[var(--border)] bg-[var(--surface)]"
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={
          locale === "en"
            ? "h-8 rounded-none bg-[var(--primary)] font-mono text-[11px] font-semibold tracking-[0.18em] text-[var(--primary-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
            : "h-8 rounded-none bg-transparent font-mono text-[11px] font-semibold tracking-[0.18em] text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
        }
      >
        EN
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setLocale("zh")}
        aria-pressed={locale === "zh"}
        className={
          locale === "zh"
            ? "h-8 rounded-none border-l border-[var(--border)] bg-[var(--primary)] font-mono text-[11px] font-semibold tracking-[0.18em] text-[var(--primary-foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]"
            : "h-8 rounded-none border-l border-[var(--border)] bg-transparent font-mono text-[11px] font-semibold tracking-[0.18em] text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
        }
      >
        中文
      </Button>
    </div>
  );
}