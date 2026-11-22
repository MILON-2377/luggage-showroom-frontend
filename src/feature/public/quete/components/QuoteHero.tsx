import { buttonVariants } from "@/src/components/ui/button";
import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import QuoteHeroScene from "./QuoteHeroScene";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteHero({ copy }: { copy: QuoteCopy }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3efe3] px-5 pb-20 pt-14 sm:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 size-[600px] rounded-full border border-accent/10"
      />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Badge
            variant="outline"
            className="rounded-full border-accent/25 bg-white/60 px-4 py-2 text-accent"
          >
            {copy.hero.eyebrow}
          </Badge>
          <h1 className="mt-8 max-w-2xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
            {copy.hero.title}
            <span className="mt-2 block italic text-[#a48958]">
              {copy.hero.highlight}
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground">
            {copy.hero.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="#quote-form"
              className={buttonVariants({
                size: "lg",
                className:
                  "rounded-xl shadow-[0_4px_0_#a58b5a] transition-transform hover:-translate-y-1 motion-reduce:transform-none",
              })}
            >
              {copy.hero.cta}
            </Link>
            <Link
              href="/manufacturing"
              className={buttonVariants({
                size: "lg",
                variant: "outline",
                className: "rounded-xl",
              })}
            >
              {copy.hero.secondary}
            </Link>
          </div>
          <p className="mt-9 text-sm text-accent">{copy.company}</p>
        </div>
        <QuoteHeroScene copy={copy} />
      </div>
    </section>
  );
}
