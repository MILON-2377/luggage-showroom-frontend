"use client";

import { useId, type PointerEvent } from "react";
import { ArrowUpRight, Bot, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function FaqHero({ onAsk }: { onAsk: () => void }) {
  const { t } = useLanguage();
  const c = t.faq.hero;
  const gradientId = useId();
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !matchMedia("(hover:hover) and (pointer:fine)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = (0.5 - (event.clientY - rect.top) / rect.height) * 10;
    event.currentTarget.style.setProperty("--faq-rx", `${y}deg`);
    event.currentTarget.style.setProperty("--faq-ry", `${x}deg`);
  }
  return (
    <section className="relative isolate overflow-hidden bg-background px-4 pb-16 pt-16 text-foreground sm:px-6 lg:px-8 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 -z-10 size-[600px] rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl border-t border-border pt-7">
        <div className="mb-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary"><span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />{c.eyebrow}<span aria-hidden="true" className="ml-auto font-serif italic text-accent">FAQ</span></div>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-surface/70 px-4 py-2 text-xs text-secondary"><Sparkles className="size-3.5 text-accent" aria-hidden="true" />{c.badge}</p>
            <h1 className="max-w-2xl font-serif text-5xl font-normal leading-[1.08] tracking-tight text-primary sm:text-6xl lg:text-7xl">{c.title}<span className="block italic text-accent">{c.highlight}</span></h1>
            <p className="mt-7 max-w-xl text-sm leading-8 text-secondary sm:text-base">{c.description}</p>
            <Button size="lg" onClick={onAsk} className="mt-8 gap-4"><Bot className="size-4" aria-hidden="true" />{c.cta}<ArrowUpRight className="size-4" aria-hidden="true" /></Button>
          </div>
          <div onPointerMove={tilt} onPointerLeave={(e) => { e.currentTarget.style.removeProperty("--faq-rx"); e.currentTarget.style.removeProperty("--faq-ry"); }} onPointerCancel={(e) => { e.currentTarget.style.removeProperty("--faq-rx"); e.currentTarget.style.removeProperty("--faq-ry"); }} className="relative mx-auto w-full max-w-md rounded-t-[160px] rounded-b-3xl border border-accent/30 bg-primary px-7 pb-7 pt-10 text-primary-foreground shadow-[0_30px_70px_-35px_rgba(0,0,0,0.6)] transition-transform duration-300 motion-safe:[transform:perspective(1000px)_rotateX(var(--faq-rx,0deg))_rotateY(var(--faq-ry,0deg))] motion-reduce:transform-none">
            <div aria-hidden="true" className="relative flex h-64 items-center justify-center [perspective:900px]">
              <div className="absolute size-60 rounded-full border border-accent/20" />
              <div className="absolute size-48 rounded-full border border-dashed border-accent/25 motion-safe:animate-[spin_45s_linear_infinite]" />
              <svg viewBox="0 0 160 160" className="absolute size-44 drop-shadow-2xl"><defs><radialGradient id={gradientId} cx="32%" cy="25%" r="75%"><stop stopColor="#e2d3b8" /><stop offset="0.32" stopColor="#a58b65" /><stop offset="0.75" stopColor="#514735" /><stop offset="1" stopColor="#191815" /></radialGradient></defs><circle cx="80" cy="80" r="72" fill={`url(#${gradientId})`} /><ellipse cx="80" cy="80" rx="72" ry="23" fill="none" stroke="#eadcc3" strokeOpacity="0.25" transform="rotate(-25 80 80)" /></svg>
              <Bot className="relative size-16 text-primary" strokeWidth={1.1} />
              <span className="absolute bottom-7 right-6 flex size-12 rotate-12 items-center justify-center rounded-2xl border border-accent/30 bg-primary shadow-xl"><Layers3 className="size-5 text-accent" strokeWidth={1.3} /></span>
            </div>
            <div className="relative border-t border-primary-foreground/15 pt-6"><p className="text-[10px] uppercase tracking-[0.2em] text-accent">{c.visualEyebrow}</p><p className="mt-3 font-serif text-2xl">{c.visualTitle}</p><p className="mt-3 text-xs leading-6 text-primary-foreground/60">{c.visualDescription}</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
