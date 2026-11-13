
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/src/providers";

export default function QualityAssuranceTesting() {
  const { t } = useLanguage();
  const data = t.qa;
  const [activeTab, setActiveTab] = useState(0);

  const currentTab = data.tabs[activeTab] || data.tabs[0];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {data.eyebrow}
            </span>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-primary md:text-5xl">
              {data.title}
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm leading-7 text-secondary md:text-base">
              {data.description}
            </p>
            <span className="mt-3 inline-block text-xs font-medium text-accent">
              💡 {data.interactiveHint}
            </span>
          </div>
        </div>

        {/* Impact Metrics Bar */}
        <div className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {data.stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-primary/40"
            >
              <div className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wider text-secondary">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Lab Testing Hub (Tabs + Media Showcase) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          
          {/* Left Navigation Tabs (5 Cols) */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {data.tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`group text-left rounded-2xl border p-5 transition-all duration-300 flex items-center justify-between ${
                    isActive
                      ? "border-primary bg-primary text-white shadow-lg"
                      : "border-border bg-surface text-primary hover:border-primary/40 hover:bg-surface-muted"
                  }`}
                >
                  <div>
                    <div className={`text-xs font-bold tracking-widest uppercase ${isActive ? "text-accent" : "text-accent"}`}>
                      Stage 0{index + 1}
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {tab.title}
                    </div>
                    <div className={`mt-1 text-xs line-clamp-1 ${isActive ? "text-white/80" : "text-secondary"}`}>
                      {tab.subtitle}
                    </div>
                  </div>

                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isActive ? "bg-white/10 text-white rotate-90" : "bg-surface-muted text-primary group-hover:translate-x-1"}`}>
                    →
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Lab Showcase Card (7 Cols) */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 md:p-8 lg:col-span-7 shadow-sm">
            <div>
              {/* Top Banner inside showcase */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
                <div>
                  <span className="text-xs font-bold tracking-wider text-accent uppercase">
                    Stage 0{activeTab + 1} Protocol
                  </span>
                  <h3 className="mt-1 text-2xl font-semibold text-primary">
                    {currentTab.title}
                  </h3>
                </div>
                <span className="rounded-full border border-border bg-surface-muted px-4 py-1.5 text-xs font-medium text-primary">
                  {currentTab.benchmark}
                </span>
              </div>

              {/* Real Testing Photography */}
              <div className="relative mt-6 h-64 w-full overflow-hidden rounded-xl bg-surface-muted md:h-72">
                <Image
                  src={currentTab.image}
                  alt={currentTab.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/40 backdrop-blur-md p-3 text-xs text-white">
                  <span className="font-bold text-accent">Focus: </span>
                  {currentTab.subtitle}
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm leading-7 text-secondary">
                {currentTab.description}
              </p>

              {/* Key Metrics Grid */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {currentTab.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="rounded-xl border border-border bg-surface-muted p-3 text-center"
                  >
                    <div className="text-[11px] font-medium text-secondary">
                      {metric.label}
                    </div>
                    <div className="mt-1 text-sm font-bold text-primary">
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Quality Dossier Callout Banner */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-8 md:flex-row md:p-10">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Wholesale Assurance
            </span>
            <h3 className="mt-2 text-xl font-semibold text-primary md:text-2xl">
              {data.ctaTitle}
            </h3>
            <p className="mt-2 text-sm text-secondary">
              {data.ctaDescription}
            </p>
          </div>

          <Link
            href="/contact-factory"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium text-white transition hover:bg-accent shrink-0 shadow-md"
          >
            {data.ctaButton}
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}