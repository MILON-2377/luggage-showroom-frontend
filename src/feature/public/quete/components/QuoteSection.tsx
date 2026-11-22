"use client";
import { useLanguage } from "@/src/providers";
import QuoteHero from "./QuoteHero";
import QuoteResponseInfo from "./QuoteResponseInfo";
import QuoteJourney from "./QuoteJourney";
import QuoteForm from "./QuoteForm";
import QuoteFaq from "./QuoteFaq";
export default function QuoteSection() {
  const { t } = useLanguage();
  const copy = t.quotePage;
  return (
    <main className="w-full bg-background text-foreground">
      <QuoteHero copy={copy} />
      <QuoteResponseInfo copy={copy} />
      <QuoteJourney copy={copy} />
      <QuoteForm copy={copy} />
      <QuoteFaq copy={copy} />
    </main>
  );
}
