"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";
import { motion, useSpring } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Layers3, LoaderCircle, Pause, Play, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/providers";

const ProductEngineeringSwiper = dynamic(() => import("./ProductEngineeringSwiper"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="absolute inset-0 z-20 flex items-center justify-center"><LoaderCircle className="size-8 text-accent motion-safe:animate-spin" /></div>,
});

const productImages: Record<string, string> = {
  suitcase: "/1.png",
  "business-luggage": "/2.png",
  backpack: "/3.png",
  "duffel-bag": "/4.png",
  handbag: "/5.png",
};

export default function ProductEngineering() {
  const { t } = useLanguage();
  const c = t.productEngineering;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const rotateX = useSpring(3, { stiffness: 115, damping: 24 });
  const rotateY = useSpring(-5, { stiffness: 115, damping: 24 });

  const bagCategories = c.categories.map(category => ({ ...category, image: productImages[category.key] }));
  const index = Math.min(selectedIndex, bagCategories.length - 1);
  const selectedBag = bagCategories[index];

  useEffect(() => {
    let frame = 0;
    function updateAutoplay() {
      const swiper = swiperRef.current;
      if (!swiper) { frame = requestAnimationFrame(updateAutoplay); return; }
      if (paused || reduceMotion) swiper.autoplay?.stop();
      else swiper.autoplay?.start();
    }
    updateAutoplay();
    return () => cancelAnimationFrame(frame);
  }, [paused, reduceMotion]);

  function handleCategoryChange(next: number) {
    setSelectedIndex(next);
    swiperRef.current?.slideToLoop(next, reduceMotion ? 0 : 900);
  }

  return (
    <section ref={sectionRef} id="product-engineering" className="relative isolate overflow-hidden bg-background px-5 py-20 text-primary md:px-8 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-52 top-52 -z-10 size-[650px] rounded-full bg-accent/[0.07] blur-[100px]" />

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface/70 px-4 py-2 text-[10px] uppercase leading-5 tracking-[0.22em] text-accent shadow-[0_4px_12px_-8px_rgba(70,50,20,0.3)]"><Sparkles className="size-3.5" aria-hidden="true" />{c.eyebrow}</span>
          <h2 className="mt-6 font-serif text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">{c.title}<span className="mt-1 block italic text-accent">{c.highlight}</span></h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-secondary sm:text-base">{c.description}</p>
        </header>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 [perspective:1200px]">
            <div className="relative px-1 pt-1 pb-4">
              <div aria-hidden="true" className="absolute inset-1 translate-x-2 translate-y-3 rounded-t-[150px] rounded-b-[30px] bg-accent/30" />
              <motion.div
                style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY }}
                onPointerMove={event => {
                  if (reduceMotion || event.pointerType !== "mouse" || event.buttons) return;
                  const rect = event.currentTarget.getBoundingClientRect();
                  rotateX.set(3 - ((event.clientY - rect.top) / rect.height - 0.5) * 8);
                  rotateY.set(-5 + ((event.clientX - rect.left) / rect.width - 0.5) * 10);
                }}
                onPointerLeave={() => { rotateX.set(3); rotateY.set(-5); }}
                onPointerCancel={() => { rotateX.set(3); rotateY.set(-5); }}
                className="relative h-[450px] rounded-t-[150px] rounded-b-[30px] border border-accent/35 bg-[#1c1a17] shadow-[0_35px_60px_-25px_rgba(35,25,15,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] sm:h-[540px]"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-t-[150px] rounded-b-[30px] bg-[radial-gradient(ellipse_at_28%_12%,rgba(193,157,96,0.27),transparent_65%)]">
                  <div className="absolute left-1/2 top-[42%] size-[320px] rounded-full border border-[#d6b776]/25 [transform:translate(-50%,-50%)_rotateY(-25deg)]" />
                  <div className="absolute left-1/2 top-[42%] size-[260px] rounded-full border border-[#d6b776]/20 [transform:translate(-50%,-50%)_rotateX(60deg)]" />
                </div>

                <div className="pointer-events-none absolute inset-x-8 top-8 z-30 flex items-center justify-between gap-3 text-[8px] uppercase tracking-[0.18em] text-[#c4aa7b]"><span>{c.stageLabel}</span><Layers3 className="size-4" strokeWidth={1.2} aria-hidden="true" /></div>

                {/* Existing Swiper retained; its cards receive dimensional styling here. */}
                <div className="absolute inset-x-0 top-14 bottom-[95px] [&_.swiper-wrapper]:items-center [&_.swiper-slide>div]:rounded-t-[120px] [&_.swiper-slide>div]:rounded-b-[24px] [&_.swiper-slide>div]:border-accent/25 [&_.swiper-slide>div]:bg-[radial-gradient(ellipse_at_30%_10%,#fffdf7,#eee7db_80%)] [&_.swiper-slide>div]:shadow-[8px_16px_25px_rgba(0,0,0,0.3),inset_0_1px_0_white] [&_.swiper-slide_img]:drop-shadow-[0_18px_10px_rgba(0,0,0,0.25)]">
                  <ProductEngineeringSwiper bagCategories={bagCategories} swiperRef={swiperRef} setSelectedIndex={setSelectedIndex} />
                </div>

                <div aria-hidden="true" className="pointer-events-none absolute bottom-[83px] left-1/2 h-7 w-[60%] -translate-x-1/2 rounded-[50%] border border-[#c6a775]/55 bg-[#141310] shadow-[0_10px_0_#090908,0_20px_20px_rgba(0,0,0,0.3)]" />

                <div className="absolute inset-x-6 bottom-5 z-30 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <div className="text-xs tabular-nums text-[#e4d4b9]">{String(index + 1).padStart(2, "0")}<span className="mx-2 text-[#8a7a60]">/</span>{String(bagCategories.length).padStart(2, "0")}</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label={paused || reduceMotion ? c.resume : c.pause} aria-pressed={paused || Boolean(reduceMotion)} disabled={Boolean(reduceMotion)} onClick={() => setPaused(value => !value)} className="rounded-full border border-[#b69c6e]/30 bg-white/5 text-[#e2cda5] hover:bg-white/10 hover:text-white">{paused || reduceMotion ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}</Button>
                    <Button variant="ghost" size="icon" aria-label={c.previous} onClick={() => swiperRef.current?.slidePrev(reduceMotion ? 0 : 900)} className="rounded-full border border-[#b69c6e]/30 bg-white/5 text-[#e2cda5] hover:bg-white/10 hover:text-white"><ChevronLeft className="size-4" aria-hidden="true" /></Button>
                    <Button variant="ghost" size="icon" aria-label={c.next} onClick={() => swiperRef.current?.slideNext(reduceMotion ? 0 : 900)} className="rounded-full border border-[#b69c6e]/30 bg-white/5 text-[#e2cda5] hover:bg-white/10 hover:text-white"><ChevronRight className="size-4" aria-hidden="true" /></Button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div role="group" aria-label={c.categoryLabel} className="mt-6 flex flex-wrap justify-center gap-2">
              {bagCategories.map((bag, next) => <Button key={bag.key} variant={index === next ? "default" : "outline"} size="sm" aria-pressed={index === next} onClick={() => handleCategoryChange(next)} className={cn("h-auto min-h-9 max-w-full whitespace-normal rounded-full px-4 py-2 text-[11px] leading-5", index === next && "shadow-[0_4px_0_rgba(165,139,101,0.35)]")}>{bag.name}</Button>)}
            </div>
          </div>

          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-surface px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-accent"><span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />{selectedBag.name}</span>
            <motion.div key={selectedBag.key} initial={false} animate={{ opacity: 1, y: 0 }}>
              <h3 className="mt-6 font-serif text-3xl font-normal leading-tight tracking-tight sm:text-4xl">{selectedBag.title}</h3>
              <p className="mt-5 text-sm leading-8 text-secondary">{selectedBag.description}</p>
              <div className="mt-8 border-t border-accent/20 pt-6">
                <h4 className="mb-5 text-[10px] uppercase tracking-[0.2em] text-accent">{c.highlights}</h4>
                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
                  {selectedBag.details.map((detail, number) => <div key={detail} className="group relative h-full [perspective:800px]">
                    <div aria-hidden="true" className="absolute inset-0 translate-x-1 translate-y-1 rounded-2xl bg-accent/15" />
                    <div className="relative flex h-full items-start gap-3 rounded-2xl border border-accent/20 bg-surface p-4 shadow-[0_12px_20px_-16px_rgba(70,50,20,0.35),inset_0_1px_0_white] transition-transform duration-300 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#e4cea2] bg-[linear-gradient(135deg,#f5e7c7,#c4a16a)] font-serif text-xs text-[#604b2a] shadow-[2px_3px_0_#9c804f]">{String(number + 1).padStart(2, "0")}</span>
                      <span className="pt-1 text-xs leading-6">{detail}</span>
                    </div>
                  </div>)}
                </div>
              </div>
              <Link href="/engineering" className={cn(buttonVariants({variant:"default"}),"mt-9 h-auto min-h-12 max-w-full justify-between gap-6 whitespace-normal rounded-xl px-6 py-4 text-left text-xs leading-5 shadow-[0_5px_0_rgba(165,139,101,0.3)]")}>{c.cta}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" /></Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
