"use client";

import { DepthCard } from "./About3D";

import { CheckCircle2, Flag, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/src/providers";

export interface CompanyMilestone {
  year: string;
  title: string;
  description: string;
}

export interface CompanyMilestonesProps {
  milestones: CompanyMilestone[];
}

export default function CompanyMilestones({
  milestones,
}: CompanyMilestonesProps) {
  const { t } = useLanguage();
  const translations = t.aboutUs.milestones;

  if (milestones.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-48 -z-10 size-[500px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:gap-28">
          {/* Section introduction */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full border border-accent/25 bg-surface/70 text-accent">
                <Flag
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
                {translations.eyebrow}
              </span>
            </div>

            <h2 className="max-w-md break-words font-serif text-4xl font-normal leading-[1.15] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {translations.title}
            </h2>

            <div
              aria-hidden="true"
              className="my-7 h-px w-20 bg-accent/60"
            />

            <p className="max-w-md text-sm leading-8 text-secondary sm:text-base">
              {translations.description}
            </p>

            {/* Decorative journey marker */}
            <div
              aria-hidden="true"
              className="mt-10 hidden items-center gap-4 lg:flex"
            >
              <span className="size-2 rounded-full bg-accent" />

              <span className="h-px w-24 bg-gradient-to-r from-accent/60 to-accent/10" />

              <span className="size-2 rounded-full border border-accent/50" />

              <span className="h-px w-12 bg-accent/20" />

              <ArrowUpRight
                className="size-5 text-accent"
                strokeWidth={1.2}
              />
            </div>
          </div>

          {/* Chronological timeline */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-accent/60 via-accent/30 to-accent/10 sm:left-[23px]"
            />

            <ol className="space-y-6 sm:space-y-8">
              {milestones.map((milestone, index) => {
                const isFirst = index === 0;

                return (
                  <li
                    key={`${milestone.year}-${index}`}
                    className="group relative flex items-start gap-4 sm:gap-6"
                  >
                    {/* Timeline node */}
                    <div
                      className={`relative z-10 mt-7 flex size-10 shrink-0 items-center justify-center rounded-full border-[5px] border-background transition-colors duration-300 sm:size-12 ${
                        isFirst
                          ? "bg-primary text-background"
                          : "bg-surface text-accent ring-1 ring-inset ring-accent/25 group-hover:bg-accent/15"
                      }`}
                    >
                      <CheckCircle2
                        className="size-4 sm:size-[18px]"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Milestone card */}
                    <DepthCard as="article"
                      className={`relative min-w-0 flex-1 overflow-hidden rounded-2xl border p-6 transition-all duration-300  motion-reduce:transform-none motion-reduce:transition-none sm:p-8 ${
                        isFirst
                          ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/10"
                          : "border-border bg-surface/80 text-primary hover:border-accent/35 hover:shadow-xl hover:shadow-primary/5"
                      }`}
                    >
                      {isFirst && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border border-accent/20"
                        />
                      )}

                      <div className="relative flex items-center justify-between gap-4">
                        <span
                          className={`inline-flex rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-[0.12em] ${
                            isFirst
                              ? "border-accent/35 bg-accent/10 text-accent"
                              : "border-accent/20 bg-accent/5 text-accent"
                          }`}
                        >
                          {milestone.year}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`font-serif text-sm italic ${
                            isFirst
                              ? "text-primary-foreground/35"
                              : "text-secondary/50"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="relative mt-5 break-words font-serif text-2xl font-normal leading-snug tracking-tight sm:text-3xl">
                        {milestone.title}
                      </h3>

                      <p
                        className={`relative mt-3 text-sm leading-7 ${
                          isFirst
                            ? "text-primary-foreground/65"
                            : "text-secondary"
                        }`}
                      >
                        {milestone.description}
                      </p>

                      <div
                        aria-hidden="true"
                        className={`relative mt-6 h-px w-12 transition-all duration-300 group-hover:w-20 motion-reduce:transition-none ${
                          isFirst
                            ? "bg-accent/50"
                            : "bg-accent/30"
                        }`}
                      />
                    </DepthCard>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}