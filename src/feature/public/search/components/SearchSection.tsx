"use client";

import Image from "next/image";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
} from "react";

import {
  ArrowDown,
  Layers3,
  Search as SearchIcon,
  Sparkles,
} from "lucide-react";

import { Search } from "@/src/components/ui/search";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useLanguage } from "@/src/providers";

import { useSearch } from "../hooks/useSearch";
import { useRecentSearches } from "../hooks/useRecentSearches";

import RecentSearches from "./RecentSearches";
import PopularSearches from "./PopularSearches";
import SearchSuggestions from "./SearchSuggestions";
import SearchCategoryList from "./SearchCategoryList";
import SearchResults from "./SearchResults";
import SearchEmptyState from "./SearchEmptyState";
import SearchLoadingState from "./SearchLoadingState";
import SearchErrorState from "./SearchErrorState";
export interface SearchSectionProps {
  compact?: boolean;
  autoFocus?: boolean;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  onNavigate?: () => void;
}

export default function SearchSection({
  compact = false,
  autoFocus = false,
  loading = false,
  error = false,
  onRetry,
  onNavigate,
}: SearchSectionProps) {
  const { t } = useLanguage();
  const c = t.search;

  const checkboxId = useId();

  const resultsRef = useRef<HTMLDivElement>(null);
  const sculptureRef = useRef<HTMLDivElement>(null);

  const bagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bag = bagRef.current;
    const container = bag?.parentElement;

    if (!bag || !container || compact) return;

    const preference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let frame = 0;
    let previousTime: number | null = null;
    let angle = -Math.PI / 2;
    let radius = 0;

    function updatePosition() {
      if (!bag) return;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.53;
      const depth = Math.sin(angle) * radius * 1.5;

      bag.style.transform =
        `translate3d(${x}px, ${y}px, ${depth}px) rotate(-10deg) rotateY(${((angle + Math.PI / 2) * 180) / Math.PI}deg)`;
    }

    function measure() {
      if (!container) return;
      radius = Math.min(container.clientWidth * 0.22, 85);
      if (!preference.matches) updatePosition();
    }

    function animate(time: number) {
      if (document.hidden) {
        previousTime = null;
      } else {
        if (previousTime !== null) {
          const elapsed = Math.min(time - previousTime, 50);
          angle += (elapsed / 16000) * Math.PI * 2;
        }

        previousTime = time;
        updatePosition();
      }

      frame = requestAnimationFrame(animate);
    }

    function updateMotion() {
      cancelAnimationFrame(frame);
      previousTime = null;

      if (preference.matches) {
        bag?.style.removeProperty("transform");
      } else {
        updatePosition();
        frame = requestAnimationFrame(animate);
      }
    }

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    measure();
    preference.addEventListener("change", updateMotion);
    updateMotion();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      preference.removeEventListener("change", updateMotion);
      bag.style.removeProperty("transform");
    };
  }, [compact]);


  const [query, setQuery] = useState("");
  const [productsOnly, setProductsOnly] = useState(false);

  const { products, categories } = useSearch(query);

  const {
    recent,
    remember,
    clearHistory,
  } = useRecentSearches();

  const hasQuery = Boolean(query.trim());

  const visibleCategories = productsOnly ? [] : categories;

  const empty =
    products.length === 0 &&
    visibleCategories.length === 0;

  function moveSculpture(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    if (!bounds.width || !bounds.height) return;

    const x =
      (event.clientX - bounds.left) / bounds.width - 0.5;

    const y =
      (event.clientY - bounds.top) / bounds.height - 0.5;

    if (sculptureRef.current) {
      sculptureRef.current.style.transform =
        `rotateX(${-y * 12}deg) rotateY(${x * 18}deg)`;
    }
  }

  function resetSculpture() {
    if (sculptureRef.current) {
      sculptureRef.current.style.transform =
        "rotateX(0deg) rotateY(0deg)";
    }
  }

  function scrollToResults() {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    resultsRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function selectTerm(value: string) {
    setQuery(value);
    remember(value);
  }

  return (
    <section
      className={
        compact
          ? "relative isolate bg-background text-foreground"
          : "relative isolate overflow-hidden bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8 lg:py-24"
      }
    >
      {/* Atmospheric background */}
      {!compact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -left-40 top-24 size-[480px] rounded-full bg-accent/10 blur-[100px]" />

          <div className="absolute -right-40 top-0 size-[560px] rounded-full bg-accent/10 blur-[120px]" />

          <div className="absolute left-1/2 top-20 size-[600px] -translate-x-1/2 rounded-full border border-accent/10" />

          <div className="absolute left-1/2 top-36 size-[470px] -translate-x-1/2 rounded-full border border-accent/10" />
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        {!compact && (
          <header className="grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24">
            {/* Introduction */}
            <div className="relative z-10 max-w-2xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-surface/80 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-accent shadow-[0_6px_16px_-10px_rgba(0,0,0,0.3)]">
                <Sparkles
                  className="size-3.5"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />

                {c.eyebrow}
              </p>

              <h1 className="mt-7 font-serif text-5xl leading-[1.06] tracking-tight text-primary sm:text-6xl xl:text-7xl">
                {c.title}

                <span className="mt-2 block italic text-accent">
                  {c.highlight}
                </span>
              </h1>

              <div
                aria-hidden="true"
                className="mt-7 h-px w-20 bg-gradient-to-r from-accent to-accent/10"
              />

              <p className="mt-6 max-w-lg text-sm leading-8 text-secondary sm:text-base">
                {c.description}
              </p>

              <Button
                variant="outline"
                onClick={scrollToResults}
                className="mt-8 rounded-full border-accent/30 bg-surface/60"
              >
                {c.reset}

                <ArrowDown
                  className="size-4 text-accent"
                  aria-hidden="true"
                />
              </Button>
            </div>

            {/* Interactive 3D bag showcase */}
            <div
              onPointerMove={moveSculpture}
              onPointerLeave={resetSculpture}
              onPointerCancel={resetSculpture}
              aria-hidden="true"
              className="relative mx-auto w-full max-w-[470px] [perspective:1200px]"
            >
              {/* Raised backplate */}
              <div className="absolute inset-0 translate-x-3 translate-y-4 rounded-t-[180px] rounded-b-[32px] bg-accent/20 sm:translate-x-4 sm:translate-y-5" />

              <div className="relative overflow-hidden rounded-t-[180px] rounded-b-[32px] border border-accent/30 bg-[#171717] shadow-[0_40px_75px_-30px_rgba(23,23,23,0.65),inset_0_1px_0_rgba(255,255,255,0.15)]">
                {/* Studio lighting */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_15%,rgba(195,166,117,0.22),transparent_60%)]" />

                <div className="pointer-events-none absolute inset-x-12 top-10 h-36 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative aspect-[1/1.08] [perspective:1200px]">
                  <div
                    ref={sculptureRef}
                    className="absolute inset-7 flex items-center justify-center transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none sm:inset-10"
                  >
                    {/* Gold rings */}
                    <div className="absolute size-[260px] rounded-full border border-accent/40 shadow-[0_0_35px_rgba(165,139,101,0.08)] [transform:rotateX(20deg)_rotateY(-25deg)] sm:size-[310px]" />

                    <div className="absolute size-[230px] rounded-full border border-accent/20 [transform:rotateX(55deg)_rotateY(25deg)] sm:size-[280px]" />

                    {/* Floating icon tiles */}
                    <div className="absolute left-0 top-[25%] z-20 flex size-14 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-[#39352d] to-[#191919] text-[#d6bf95] shadow-[8px_12px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] [transform:translateZ(55px)_rotate(-14deg)] sm:left-2">
                      <Layers3
                        className="size-6"
                        strokeWidth={1.2}
                      />
                    </div>

                    <div className="absolute right-0 top-[18%] z-20 flex size-12 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-[#39352d] to-[#191919] text-[#d6bf95] shadow-[8px_12px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] [transform:translateZ(70px)_rotate(14deg)] sm:right-3">
                      <SearchIcon
                        className="size-5"
                        strokeWidth={1.4}
                      />
                    </div>

                    {/* Your own bag photo */}
                    <div ref={bagRef} className="pointer-events-none absolute inset-x-[8%] top-[8%] bottom-[22%] [transform-style:preserve-3d] will-change-transform [transform:translateZ(75px)_rotate(-10deg)]">
                      {/* Backlight */}
                      <div className="absolute inset-[12%] rounded-full bg-accent/20 blur-3xl" />

                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:translateZ(0.5px)]">
<Image
                        src="/5.png"
                        alt=""
                        fill
                        sizes="(max-width: 640px) 65vw, 320px"
                        draggable={false}
                        className="select-none object-contain drop-shadow-[12px_24px_14px_rgba(0,0,0,0.5)]"
                      />
</div>
<div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0.5px)]">
<Image
                        src="/5.png"
                        alt=""
                        fill
                        sizes="(max-width: 640px) 65vw, 320px"
                        draggable={false}
                        className="select-none object-contain drop-shadow-[12px_24px_14px_rgba(0,0,0,0.5)]"
                      />
</div>
                    </div>

                    {/* Pedestal */}
                    <div className="absolute bottom-0 h-16 w-56 sm:w-64">
                      <div className="absolute inset-x-0 bottom-0 h-11 rounded-[50%] bg-[#080808] shadow-[0_15px_20px_rgba(0,0,0,0.55)]" />

                      <div className="absolute inset-x-0 top-0 h-11 rounded-[50%] border-2 border-[#c7ab77] bg-gradient-to-br from-[#38332b] via-[#151515] to-[#28231b] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" />

                      <div className="absolute inset-x-8 top-2 h-5 rounded-[50%] bg-accent/10 blur-md" />
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="relative mx-7 border-t border-white/10 py-6 sm:mx-9">
                  <p className="text-[9px] uppercase tracking-[0.24em] text-[#c7ab77]">
                    {c.eyebrow}
                  </p>

                  <p className="mt-3 font-serif text-2xl text-[#f3f0e5]">
                    {c.dialogTitle}
                  </p>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Search workspace */}
        <div
          ref={resultsRef}
          className={
            compact
              ? "relative scroll-mt-24"
              : "relative scroll-mt-24 rounded-[30px] border border-accent/20 bg-surface/75 p-5 shadow-[0_30px_65px_-35px_rgba(50,40,25,0.4),0_6px_0_-2px_rgba(165,139,101,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl sm:p-8 lg:p-10"
          }
        >
          <div className="rounded-[22px] bg-primary/[0.025] p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]">
            <Search
              value={query}
              onChange={setQuery}
              onSubmit={selectTerm}
              label={c.label}
              placeholder={c.placeholder}
              clearLabel={c.clear}
              submitLabel={c.submit}
              autoFocus={autoFocus}
              className="border-accent/25 bg-surface shadow-[0_8px_20px_-12px_rgba(23,23,23,0.3)]"
            />
          </div>

          <div className="mt-5 flex items-center gap-2.5">
            <Checkbox
              id={checkboxId}
              checked={productsOnly}
              onCheckedChange={(checked) =>
                setProductsOnly(checked === true)
              }
            />

            <label
              htmlFor={checkboxId}
              className="cursor-pointer text-xs text-secondary"
            >
              {c.productsOnly}
            </label>
          </div>

          {!hasQuery && !loading && !error && (
            <div className="mt-6 rounded-2xl border border-accent/10 bg-background/60 px-4 pb-5 sm:px-6">
              <RecentSearches
                items={recent}
                onSelect={selectTerm}
                onClear={clearHistory}
              />

              <PopularSearches onSelect={selectTerm} />
            </div>
          )}

          {loading ? (
            <SearchLoadingState />
          ) : error ? (
            <SearchErrorState onRetry={onRetry} />
          ) : (
            <>
              {hasQuery && (
                <SearchSuggestions
                  items={products}
                  onSelect={selectTerm}
                />
              )}

              <SearchCategoryList
                items={visibleCategories}
                onNavigate={onNavigate}
              />

              {empty ? (
                <SearchEmptyState
                  onReset={() => {
                    setQuery("");
                    setProductsOnly(false);
                  }}
                />
              ) : products.length > 0 ? (
                <SearchResults
                  items={products}
                  onNavigate={() => {
                    remember(query);
                    onNavigate?.();
                  }}
                />
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}