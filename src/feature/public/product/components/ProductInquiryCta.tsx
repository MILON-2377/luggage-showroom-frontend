"use client";
import { useRouter } from "next/navigation";
import { ArrowUpRight, PenTool } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductInquiryCta() {
  const { t } = useLanguage();
  const router = useRouter();
  const c = t.productPage;
  return (
    <section className="border-t border-border bg-surface-muted px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-[28px] border border-accent/25 bg-background p-8 sm:p-12 lg:flex-row lg:items-center">
        <div>
          <PenTool
            className="size-6 text-accent"
            strokeWidth={1}
            aria-hidden="true"
          />
          <h2 className="mt-5 font-serif text-3xl sm:text-4xl">{c.ctaTitle}</h2>
          <p className="mt-4 max-w-xl text-sm leading-8 text-secondary">
            {c.ctaDescription}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push("/quote")}
          className="shrink-0 gap-6 rounded-full"
        >
          {c.ctaButton}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
