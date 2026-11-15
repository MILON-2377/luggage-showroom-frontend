"use client";

import { DepthCard } from "./About3D";

import {
  CalendarDays,
  Factory,
  Users,
  Workflow,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/src/providers";

export interface CompanyStatisticsProps {
  yearsInBusiness?: string;
  factoryFloorArea?: string;
  workforce?: string;
  productionLines?: string;
  monthlyProductionCapacity?: string;
}

export default function CompanyStatistics({
  yearsInBusiness,
  factoryFloorArea,
  workforce,
  productionLines,
  monthlyProductionCapacity,
}: CompanyStatisticsProps) {
  const { t } = useLanguage();
  const translations = t.aboutUs.statistics;

  const statistics = [
    {
      label: translations.yearsInBusiness,
      value: yearsInBusiness,
      icon: CalendarDays,
    },
    {
      label: translations.factoryFloorArea,
      value: factoryFloorArea,
      icon: Factory,
    },
    {
      label: translations.workforce,
      value: workforce,
      icon: Users,
    },
    {
      label: translations.productionLines,
      value: productionLines,
      icon: Workflow,
    },
    {
      label: translations.monthlyProductionCapacity,
      value: monthlyProductionCapacity,
      icon: Package,
    },
  ].filter(
    (item): item is typeof item & { value: string } =>
      typeof item.value === "string" &&
      item.value.trim().length > 0,
  );

  if (statistics.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20 lg:py-28">
      {/* Architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-56 -z-10 size-[620px] rounded-full border border-accent/15"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-36 -z-10 size-[460px] rounded-full border border-accent/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-40 -z-10 size-[500px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section introduction */}
        <div className="flex flex-col justify-between gap-7 border-t border-primary-foreground/15 pt-7 lg:flex-row lg:items-end lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-3">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-accent"
              />

              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-primary-foreground/55">
                {translations.eyebrow}
              </span>
            </div>

            <h2 className="font-serif text-4xl font-normal leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              {translations.title}
            </h2>
          </div>

          <div className="max-w-sm">
            <div
              aria-hidden="true"
              className="mb-5 hidden justify-end lg:flex"
            >
              <ArrowUpRight
                className="size-7 text-accent"
                strokeWidth={1}
              />
            </div>

            <p className="text-sm leading-8 text-primary-foreground/60">
              {translations.description}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-5">
          {statistics.map((item, index) => {
            const Icon = item.icon;

            const isFeatured =
              statistics.length > 1 &&
              index === statistics.length - 1;

            const columnClass =
              statistics.length === 1
                ? "lg:col-span-6"
                : statistics.length === 2
                  ? "lg:col-span-3"
                  : statistics.length === 4
                    ? "lg:col-span-3"
                    : statistics.length === 5 && index >= 3
                      ? "lg:col-span-3"
                      : "lg:col-span-2";

            return (
              <DepthCard as="div"
                key={item.label}
                className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-300  motion-reduce:transform-none motion-reduce:transition-none sm:p-8 ${columnClass} ${
                  isFeatured
                    ? "border-accent/40 bg-accent/10 hover:border-accent/70"
                    : "border-primary-foreground/10 bg-primary-foreground/[0.025] hover:border-accent/35 hover:bg-primary-foreground/[0.045]"
                }`}
              >
                {isFeatured && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border border-accent/15"
                  />
                )}

                {/* Icon and index */}
                <div className="relative mb-10 flex items-start justify-between gap-4">
                  <div
                    className={`flex size-12 items-center justify-center rounded-full border transition-colors duration-300 ${
                      isFeatured
                        ? "border-accent/35 bg-accent/10 text-accent"
                        : "border-primary-foreground/15 bg-primary-foreground/5 text-accent group-hover:border-accent/35"
                    }`}
                  >
                    <Icon
                      className="size-5"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="pt-1 font-serif text-sm italic text-primary-foreground/30"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Label and value */}
                <dt className="relative order-2 mt-4 text-xs font-medium leading-6 tracking-wide text-primary-foreground/60">
                  {item.label}
                </dt>

                <dd
                  className={`relative order-1 m-0 break-words font-serif font-normal leading-tight tracking-tight ${item.icon === Workflow ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"} ${
                    isFeatured
                      ? "text-accent"
                      : "text-primary-foreground"
                  }`}
                >
                  {item.value}
                </dd>

                {/* Fine accent rule */}
                <div
                  aria-hidden="true"
                  className="relative order-3 mt-7 h-px w-full bg-primary-foreground/10"
                >
                  <span className="absolute inset-y-0 left-0 w-10 bg-accent/60 transition-all duration-500 group-hover:w-20 motion-reduce:transition-none" />
                </div>
              </DepthCard>
            );
          })}
        </dl>
      </div>
    </section>
  );
}