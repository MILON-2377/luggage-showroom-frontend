"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/src/providers";
import { buttonVariants } from "@/src/components/ui/button";
import { receiptStorageKey } from "../data/quote.config";
import type { DemoReceipt } from "../types/quote.types";
import QuoteReferenceCard from "./QuoteReferenceCard";
import QuoteNextSteps from "./QuoteNextSteps";
export default function QuoteSubmittedSection() {
  const { t } = useLanguage();
  const copy = t.quotePage;
  const [receipt, setReceipt] = useState<DemoReceipt | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(receiptStorageKey);
      const value: unknown = raw ? JSON.parse(raw) : null;
      if (
        value &&
        typeof value === "object" &&
        "reference" in value &&
        typeof value.reference === "string" &&
        value.reference.startsWith("DEMO-") &&
        "createdAt" in value &&
        typeof value.createdAt === "string" &&
        "type" in value &&
        ["product", "sample", "custom"].includes(String(value.type))
      )
        setReceipt(value as DemoReceipt);
    } catch {}
  }, []);
  return (
    <main className="min-h-[80vh] bg-background px-5 py-20 text-foreground">
      <div className="mx-auto max-w-2xl rounded-[36px] border border-white bg-gradient-to-br from-white to-[#f0e7d4] p-7 text-center shadow-[7px_9px_0_#bda77c] sm:p-12">
        <p className="text-xs uppercase tracking-widest text-accent">
          {copy.submitted.eyebrow}
        </p>
        <h1 className="mt-6 font-serif text-4xl">{copy.submitted.title}</h1>
        <p className="mt-6 text-base leading-8 text-muted-foreground">
          {receipt ? copy.submitted.description : copy.submitted.empty}
        </p>
        {receipt && <QuoteReferenceCard copy={copy} receipt={receipt} />}
        <QuoteNextSteps copy={copy} />
        <Link
          href="/quote"
          className={buttonVariants({ className: "mt-9 rounded-xl" })}
        >
          {copy.submitted.back}
        </Link>
      </div>
    </main>
  );
}
