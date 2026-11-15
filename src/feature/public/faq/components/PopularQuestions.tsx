"use client";

import { ArrowUpRight, Box, Layers3, Timer } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import type { FaqItem } from "./faq.types";

export default function PopularQuestions({ items, onSelect }: { items: FaqItem[]; onSelect: (id: string) => void }) {
  const { t } = useLanguage();
  const icons = [Box, Layers3, Timer];
  return <section aria-labelledby="popular-faq-title" className="mt-12"><h2 id="popular-faq-title" className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">{t.faq.popularTitle}</h2><div className="grid gap-4 sm:grid-cols-3">{items.map((item,index) => { const Icon = icons[index % icons.length]; return <article key={item.id} className="group relative flex min-w-0 flex-col rounded-2xl border border-accent/20 bg-surface p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-500 hover:border-accent/50 hover:shadow-xl motion-safe:hover:[transform:perspective(1000px)_rotateX(3deg)_rotateY(-3deg)_translateY(-5px)]"><Icon className="size-6 text-accent" strokeWidth={1.2} aria-hidden="true" /><h3 className="mt-5 flex-1 font-serif text-xl leading-snug text-primary">{item.question}</h3><Button variant="ghost" size="sm" onClick={() => onSelect(item.id)} className="mt-5 justify-between gap-2 px-0 text-xs">{t.faq.readAnswer}<ArrowUpRight className="size-4 text-accent" aria-hidden="true" /></Button></article>; })}</div></section>;
}
