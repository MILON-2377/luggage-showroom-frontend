"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function FaqContactCta() {
  const router = useRouter();
  const { t } = useLanguage();
  const c = t.faq.contact;

  return (
    <section className="border-t border-border bg-surface-muted px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-[28px] border border-accent/20 bg-background p-7 shadow-sm sm:p-10 lg:flex-row lg:items-center">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent">
            <MessageCircle className="size-4" aria-hidden="true" />
            {c.eyebrow}
          </p>

          <h2 className="mt-4 font-serif text-3xl text-primary sm:text-4xl">
            {c.title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-secondary">
            {c.description}
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => router.push("/contact-us")}
          className="shrink-0 gap-6"
        >
          {c.button}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}