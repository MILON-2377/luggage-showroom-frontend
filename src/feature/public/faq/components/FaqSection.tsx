"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/src/providers";
import FaqHero from "./FaqHero";
import FaqSearch from "./FaqSearch";
import FaqCategoryTabs from "./FaqCategoryTabs";
import PopularQuestions from "./PopularQuestions";
import FaqAccordion from "./FaqAccordion";
import AiAssistantCard from "./AiAssistantCard";
import AiChatPanel from "./AiChatPanel";
import FaqContactCta from "./FaqContactCta";

export default function FaqSection() {
  const { t, locale } = useLanguage(); const c = t.faq;
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null); const [chatOpen, setChatOpen] = useState(false);
  const answers = useRef<HTMLDivElement>(null); const chat = useRef<HTMLElement>(null); const opener = useRef<HTMLElement | null>(null);
  useEffect(() => { setQuery(""); setCategory("all"); setOpenId(null); }, [locale]);
  useEffect(() => { if (chatOpen) chat.current?.focus({ preventScroll: true }); }, [chatOpen]);
  const search = query.trim().toLocaleLowerCase();
  const items = c.items.filter(item => (category === "all" || item.category === category) && `${item.question} ${item.answer}`.toLocaleLowerCase().includes(search));
  function openChat() {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setChatOpen(true);
    chat.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  function selectQuestion(id: string) {
    setCategory("all"); setQuery(""); setOpenId(id);
    answers.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return <main className="w-full bg-background text-foreground"><FaqHero onAsk={openChat} /><div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><FaqSearch value={query} onChange={setQuery} /><PopularQuestions items={c.items.filter(item => c.popularIds.includes(item.id))} onSelect={selectQuestion} /><div className="mt-14 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12"><div ref={answers} className="min-w-0 scroll-mt-28"><h2 className="mb-6 font-serif text-3xl text-primary">{c.questionsTitle}</h2><FaqCategoryTabs categories={c.categories} selected={category} onSelect={setCategory} /><p role="status" className="my-5 text-xs text-secondary">{c.resultsLabel}: {items.length}</p><FaqAccordion items={items} openId={openId} onToggle={id => setOpenId(previous => previous === id ? null : id)} /></div><aside ref={chat} tabIndex={-1} aria-label={c.ai.assistant} className="min-w-0 scroll-mt-28 rounded-[28px] outline-none focus-visible:ring-2 focus-visible:ring-accent/50 lg:sticky lg:top-24">{chatOpen ? <AiChatPanel key={locale} onClose={() => { setChatOpen(false); opener.current?.focus({ preventScroll: true }); }} /> : <AiAssistantCard onOpen={openChat} />}</aside></div></div><FaqContactCta /></main>;
}
