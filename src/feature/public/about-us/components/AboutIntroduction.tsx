"use client";

import { DepthCard, SculptedBag } from "./About3D";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Factory,
  Globe2,
  Package,
  CalendarDays,
  UsersRound,
  Check,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export interface AboutIntroductionProps {
  companyName: string;
  specialization: string;
  establishmentYear?: string;
  factoryLocation?: string;
  productFamilies: string[];
  customerTypes: string[];
  description?: string;
}

export default function AboutIntroduction({
  companyName,
  specialization,
  establishmentYear,
  factoryLocation,
  productFamilies,
  customerTypes,
  description,
}: AboutIntroductionProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const translations = t.aboutUs.introduction;

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-28">
      {/* Soft architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 -z-10 size-[620px] rounded-full bg-accent/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 bottom-0 -z-10 size-[420px] rounded-full border border-accent/10"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-12 flex items-center gap-4 border-t border-border pt-6 lg:mb-20">
          <span className="size-1.5 shrink-0 rounded-full bg-accent" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
            {translations.eyebrow}
          </span>

          <span
            aria-hidden="true"
            className="ml-auto font-serif text-sm italic text-accent"
          >
            01
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
          {/* Company introduction */}
          <div className="min-w-0">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-accent/25 bg-surface/60 py-2 pl-2 pr-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Factory
                  className="size-4"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-secondary">
                {translations.title}
              </span>
            </div>

            <h1 className="max-w-2xl break-words font-serif text-4xl font-normal leading-[1.15] tracking-tight text-primary sm:text-5xl xl:text-6xl">
              {companyName}
            </h1>

            <div
              aria-hidden="true"
              className="my-7 h-px w-20 bg-accent/60"
            />

            <p className="max-w-xl text-lg font-medium leading-relaxed text-primary/85 sm:text-xl">
              {specialization}
            </p>

            {description && (
              <p className="mt-5 max-w-xl text-sm leading-8 text-secondary sm:text-base">
                {description}
              </p>
            )}

            {(establishmentYear || factoryLocation) && (
              <div className="mt-9 grid gap-5 border-y border-border py-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                {establishmentYear && (
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      className="mt-1 size-[18px] shrink-0 text-accent"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-secondary">
                        {translations.established}
                      </p>

                      <p className="mt-1 font-serif text-2xl text-primary">
                        {establishmentYear}
                      </p>
                    </div>
                  </div>
                )}

                {factoryLocation && (
                  <div className="flex items-start gap-3">
                    <Globe2
                      className="mt-1 size-[18px] shrink-0 text-accent"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <p className="max-w-xs text-sm leading-7 text-secondary">
                      {factoryLocation}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                size="lg"
                onClick={() => router.push("/quote")}
                className="group gap-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none"
              >
                {translations.requestQuote}

                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/manufacturing")}
                className="group gap-3 bg-transparent"
              >
                {translations.exploreManufacturing}

                <Factory
                  className="size-4 text-accent"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>

          {/* Product and customer showcase */}
          <div className="relative min-w-0 pb-7 pl-0 [perspective:1400px] sm:pl-5">
            {/* Offset frame */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 bottom-0 top-5 rounded-t-[120px] rounded-b-lg border border-accent/25 sm:left-0 sm:right-10 sm:rounded-t-[160px]"
            />

            <DepthCard as="div" className="relative overflow-hidden rounded-t-[120px] rounded-b-lg border border-primary/10 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 sm:rounded-t-[160px]">
              {/* Arched visual */}
              <div className="border-b border-primary-foreground/10"><SculptedBag /></div>

              <div className="relative p-6 sm:p-8 lg:p-9">
                <div className="mb-7 flex items-start justify-between gap-5">
                  <h2 className="max-w-xs font-serif text-2xl font-normal leading-snug tracking-tight sm:text-3xl">
                    {translations.productFamilies}
                  </h2>

                  <ArrowUpRight
                    className="mt-1 size-5 shrink-0 text-accent"
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />
                </div>

                {/* Product families */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <Package
                      className="size-4 text-accent"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <h3 className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground/55">
                      {translations.productsTitle}
                    </h3>

                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-primary-foreground/10"
                    />
                  </div>

                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {productFamilies.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="group flex items-center gap-3 rounded-lg border border-primary-foreground/10 bg-primary-foreground/[0.03] px-3.5 py-3 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/10"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <Check
                            className="size-3"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>

                        <span className="text-xs leading-5 text-primary-foreground/80">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Customer types */}
                <div className="mt-7 border-t border-primary-foreground/10 pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <UsersRound
                      className="size-4 text-accent"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />

                    <h3 className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground/55">
                      {translations.customerTypesTitle}
                    </h3>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {customerTypes.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="rounded-full border border-accent/25 px-3.5 py-2 text-[11px] leading-5 text-primary-foreground/70 transition-colors duration-300 hover:border-accent/60 hover:text-primary-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DepthCard>
          </div>
        </div>
      </div>
    </section>
  );
}