"use client";
import { ArrowDown, Layers3 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductHero() {
  const { t } = useLanguage();
  const c = t.productPage;
  return (
    <section className="relative isolate overflow-hidden px-4 pb-14 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div
        aria-hidden="true"
        className="absolute -right-32 top-0 -z-10 size-[500px] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="mx-auto max-w-7xl border-t border-border pt-7">
        <p className="flex items-center gap-3 text-[10px] uppercase tracking-[.25em] text-secondary">
          <Layers3 className="size-4 text-accent" aria-hidden="true" />
          {c.eyebrow}
        </p>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {c.title}
              <span className="block italic text-accent">{c.highlight}</span>
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-8 text-secondary">
              {c.description}
            </p>
            <Button
              variant="outline"
              onClick={() =>
                document
                  .getElementById("product-collection")
                  ?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion:reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  })
              }
              className="mt-7 gap-6 rounded-full"
            >
              {c.browse}
              <ArrowDown className="size-4 text-accent" aria-hidden="true" />
            </Button>
          </div>
          <div className="relative mx-auto w-full max-w-md [perspective:1000px]">
            <div
              aria-hidden="true"
              className="absolute inset-5 translate-x-4 translate-y-4 rounded-t-[120px] rounded-b-3xl border border-accent/30"
            />
            <div className="relative overflow-hidden rounded-t-[130px] rounded-b-3xl border border-accent/30 bg-primary px-7 pb-6 pt-9 shadow-[0_30px_65px_-30px_rgba(0,0,0,0.45)] motion-safe:[transform:rotateY(-7deg)_rotateX(3deg)]">
              <div className="relative -mx-7 -mt-9 mb-6 overflow-hidden rounded-t-[130px] bg-primary">
                <img
                  src="/product-hero-3d.png"
                  alt=""
                  aria-hidden="true"
                  fetchPriority="high"
                  className="h-72 w-full object-contain sm:h-80"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-primary to-transparent"
                />
              </div>
              <div className="border-t border-primary-foreground/15 pt-5">
                <p className="text-[10px] uppercase tracking-widest text-accent">
                  {c.heroLabel}
                </p>
                <p className="mt-3 font-serif text-2xl text-primary-foreground">
                  {c.heroTitle}
                </p>
                <p className="mt-3 text-xs leading-6 text-primary-foreground/60">
                  {c.draftNotice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
