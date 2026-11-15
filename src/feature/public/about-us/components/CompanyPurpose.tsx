"use client";

import { Eye, HeartHandshake, Layers3, Workflow } from "lucide-react";
import { useLanguage } from "@/src/providers";
import { DepthCard } from "./About3D";

export default function CompanyPurpose() {
  const { t } = useLanguage();
  const copy = t.aboutUs.purpose;

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 -z-10 size-[500px] rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 border-t border-border pt-7">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">{copy.eyebrow}</p>
        </div>
        <div className="mt-7 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-20">
          <h2 className="max-w-xl font-serif text-4xl leading-[1.15] tracking-tight text-primary sm:text-5xl">{copy.title}</h2>
          <p className="max-w-xl text-sm leading-8 text-secondary">{copy.description}</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-7">
          <DepthCard as="article" className="group overflow-hidden rounded-[28px] border border-accent/25 bg-primary p-7 text-primary-foreground sm:p-10">
            <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full border border-accent/20" />
            <div className="relative flex items-start justify-between gap-5">
              <HeartHandshake className="size-10 text-accent" strokeWidth={1} aria-hidden="true" />
              <span aria-hidden="true" className="font-serif text-6xl italic text-accent/20">01</span>
            </div>
            <h3 className="relative mt-8 font-serif text-3xl sm:text-4xl">{copy.missionTitle}</h3>
            <p className="relative mt-5 max-w-lg text-sm leading-8 text-primary-foreground/75">{copy.mission}</p>
            <div aria-hidden="true" className="mt-8 h-px w-16 bg-accent/60" />
          </DepthCard>

          <DepthCard as="article" className="group overflow-hidden rounded-[28px] border border-accent/25 bg-surface p-7 sm:p-10">
            <div aria-hidden="true" className="absolute -bottom-32 -right-16 size-72 rounded-full border border-accent/20" />
            <div className="relative flex items-start justify-between gap-5">
              <Eye className="size-10 text-accent" strokeWidth={1} aria-hidden="true" />
              <span aria-hidden="true" className="font-serif text-6xl italic text-accent/30">02</span>
            </div>
            <h3 className="relative mt-8 font-serif text-3xl text-primary sm:text-4xl">{copy.visionTitle}</h3>
            <p className="relative mt-5 max-w-lg text-sm leading-8 text-secondary">{copy.vision}</p>
            <div aria-hidden="true" className="mt-8 h-px w-16 bg-accent/60" />
          </DepthCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[24px] border border-border bg-surface/60 p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <Layers3 className="size-5 text-accent" strokeWidth={1.3} aria-hidden="true" />
              <h3 className="font-serif text-2xl text-primary">{copy.materialsTitle}</h3>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {copy.materials.map((material) => (
                <li key={material} className="rounded-full border border-accent/25 bg-background px-5 py-2.5 text-xs tracking-wide text-primary">{material}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-border bg-surface/60 p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <Workflow className="size-5 text-accent" strokeWidth={1.3} aria-hidden="true" />
              <h3 className="font-serif text-2xl text-primary">{copy.processTitle}</h3>
            </div>
            <ol className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {copy.process.map((step, index) => (
                <li key={step} className="border-l border-accent/30 pl-3">
                  <span aria-hidden="true" className="font-serif text-xl italic text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-xs leading-6 text-secondary">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
