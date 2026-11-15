"use client";

import { DepthCard } from "./About3D";

import {
  ArrowUpRight,
  Globe2,
  MapPin,
  Store,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useLanguage } from "@/src/providers";

export interface MarketsAndCustomersProps {
  exportRegions: string[];
  countries?: string[];
  customerTypes: string[];
  brands?: string[];
}

export default function MarketsAndCustomers({
  exportRegions,
  countries = [],
  customerTypes,
  brands = [],
}: MarketsAndCustomersProps) {
  const { t } = useLanguage();
  const translations = t.aboutUs.markets;

  const customerIcons = [Store, ShoppingBag, Users];

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-28">
      {/* Architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 -z-10 size-[580px] rounded-full border border-accent/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-[480px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section introduction */}
        <div className="border-t border-border pt-7">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-accent/25 bg-surface/70 text-accent">
              <Globe2
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {translations.eyebrow}
            </span>

            <span
              aria-hidden="true"
              className="ml-auto h-px w-12 bg-accent/30 sm:w-24"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <h2 className="max-w-2xl break-words font-serif text-4xl font-normal leading-[1.15] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {translations.title}
            </h2>

            <p className="max-w-xl text-sm leading-8 text-secondary sm:text-base">
              {translations.description}
            </p>
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:mt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          {/* Export markets */}
          <DepthCard as="article" className="relative flex min-w-0 flex-col overflow-hidden rounded-t-[100px] rounded-b-xl border border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/5 sm:rounded-t-[140px]">
            {/* Decorative globe */}
            <div
              aria-hidden="true"
              className="relative flex h-52 shrink-0 items-center justify-center overflow-hidden border-b border-primary-foreground/10 sm:h-60"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/5" />

              <div className="absolute size-60 rounded-full border border-accent/20 sm:size-72" />

              <div className="absolute size-44 rounded-full border border-dashed border-accent/20 sm:size-52" />

              <div className="relative flex size-28 items-center justify-center rounded-full border border-accent/25 bg-primary text-accent shadow-2xl shadow-accent/10 sm:size-32">
                <Globe2
                  className="size-16 sm:size-20"
                  strokeWidth={0.8}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-9">
              <div className="flex items-start justify-between gap-5">
                <h3 className="break-words font-serif text-3xl font-normal leading-snug tracking-tight">
                  {translations.exportMarkets}
                </h3>

                <ArrowUpRight
                  className="mt-1 size-5 shrink-0 text-accent"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
              </div>

              {exportRegions.length > 0 && (
                <div className="mt-7">
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground/50">
                    {translations.regions}
                  </h4>

                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {exportRegions.map((region, index) => (
                      <li
                        key={`${region}-${index}`}
                        className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-2.5 text-xs leading-5 text-primary-foreground/85 transition-colors duration-300 hover:border-accent/60 motion-reduce:transition-none"
                      >
                        <span
                          aria-hidden="true"
                          className="size-1 shrink-0 rounded-full bg-accent"
                        />
                        {region}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {countries.length > 0 && (
                <div className="mt-7 border-t border-primary-foreground/10 pt-6">
                  <h4 className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground/50">
                    {translations.countries}
                  </h4>

                  <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {countries.map((country, index) => (
                      <li
                        key={`${country}-${index}`}
                        className="flex items-start gap-2.5 text-xs leading-6 text-primary-foreground/70"
                      >
                        <MapPin
                          className="mt-1 size-3.5 shrink-0 text-accent"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                        <span>{country}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DepthCard>

          {/* Customer types */}
          <DepthCard as="article" className="relative min-w-0 overflow-hidden rounded-2xl border border-border bg-surface/80 p-6 sm:p-8 lg:p-9">
            <div className="flex items-start justify-between gap-5">
              <span className="flex size-12 items-center justify-center rounded-full border border-accent/25 bg-accent/5 text-accent">
                <Users
                  className="size-5"
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
              </span>

              <ArrowUpRight
                className="mt-2 size-5 text-accent"
                strokeWidth={1.2}
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-6 break-words font-serif text-3xl font-normal leading-snug tracking-tight text-primary">
              {translations.customerTypes}
            </h3>

            <ul className="mt-7 divide-y divide-border">
              {customerTypes.map((customer, index) => {
                const Icon =
                  customerIcons[index % customerIcons.length];

                return (
                  <li
                    key={`${customer}-${index}`}
                    className="group flex items-center gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/15 bg-background text-accent transition-colors duration-300 group-hover:border-accent/35 group-hover:bg-accent/10 motion-reduce:transition-none">
                      <Icon
                        className="size-[18px]"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="min-w-0 flex-1 break-words text-sm font-medium leading-6 text-primary">
                      {customer}
                    </span>

                    <span
                      aria-hidden="true"
                      className="font-serif text-xs italic text-accent/70"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </li>
                );
              })}
            </ul>

            {brands.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h4 className="text-[10px] font-medium uppercase leading-5 tracking-[0.16em] text-secondary">
                  {translations.businessPartners}
                </h4>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {brands.map((brand, index) => (
                    <li
                      key={`${brand}-${index}`}
                      className="rounded-full border border-accent/20 bg-background px-4 py-2 text-xs leading-5 text-primary/80 transition-colors duration-300 hover:border-accent/45 hover:bg-accent/5 motion-reduce:transition-none"
                    >
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DepthCard>
        </div>
      </div>
    </section>
  );
}