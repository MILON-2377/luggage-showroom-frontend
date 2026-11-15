"use client";

import { DepthCard } from "./About3D";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Target,
  Factory,
  Sparkles,
  Layers3,
  Globe2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export interface CompanyStoryProps {
  introduction: string;
  establishmentReason: string;
  businessDevelopment: string;
  productSpecialization: string;
  internationalExperience: string;
  image?: string;
  imageAlt?: string;
}

export default function CompanyStory({
  introduction,
  establishmentReason,
  businessDevelopment,
  productSpecialization,
  internationalExperience,
  image,
  imageAlt,
}: CompanyStoryProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const translations = t.aboutUs.story;

  const storyItems = [
    {
      number: "01",
      title: translations.whyWeStarted,
      description: establishmentReason,
      icon: Target,
    },
    {
      number: "02",
      title: translations.ourDevelopment,
      description: businessDevelopment,
      icon: Sparkles,
    },
    {
      number: "03",
      title: translations.ourSpecialization,
      description: productSpecialization,
      icon: Layers3,
    },
    {
      number: "04",
      title: translations.internationalExperience,
      description: internationalExperience,
      icon: Globe2,
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-surface-muted py-16 text-foreground sm:py-20 lg:py-28">
      {/* Background details */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-32 -z-10 size-[560px] rounded-full border border-accent/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 -z-10 size-[440px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="border-t border-border pt-7">
          <div className="mb-7 flex items-center gap-3">
            <Target
              className="size-4 text-accent"
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-secondary">
              {translations.eyebrow}
            </span>

            <span
              aria-hidden="true"
              className="ml-auto h-px w-16 bg-accent/30 sm:w-24"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <h2 className="max-w-2xl break-words font-serif text-4xl font-normal leading-[1.15] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {translations.title}
            </h2>

            <p className="max-w-xl text-sm leading-8 text-secondary sm:text-base">
              {introduction}
            </p>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-12 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24">
          {/* Company image */}
          <div className="relative min-w-0 pb-5 pr-5 lg:sticky lg:top-28">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-5 right-0 top-5 rounded-t-[120px] rounded-b-lg border border-accent/30 sm:rounded-t-[160px]"
            />

            <DepthCard as="figure" className="group relative m-0 overflow-hidden rounded-t-[120px] rounded-b-lg border border-border bg-background shadow-xl shadow-primary/5 sm:rounded-t-[160px]">
              <div className="relative aspect-[4/5] overflow-hidden">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt={imageAlt || translations.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"
                    />

                    <span
                      aria-hidden="true"
                      className="absolute bottom-7 left-7 flex size-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md"
                    >
                      <Factory
                        className="size-5"
                        strokeWidth={1.3}
                      />
                    </span>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/10 to-background">
                    <div
                      aria-hidden="true"
                      className="absolute size-72 rounded-full border border-accent/20 sm:size-80"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute size-56 rounded-full border border-dashed border-accent/20 sm:size-64"
                    />

                    <div
                      aria-hidden="true"
                      className="relative flex size-28 -rotate-6 items-center justify-center rounded-[30px] border border-accent/30 bg-surface/80 text-accent shadow-2xl shadow-accent/10"
                    >
                      <Factory
                        className="size-12"
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <figcaption className="flex items-center justify-between gap-5 border-t border-border bg-background px-6 py-5 sm:px-7">
                <span className="text-[10px] font-medium uppercase leading-5 tracking-[0.16em] text-secondary">
                  {imageAlt || translations.imageAlt}
                </span>

                <ArrowUpRight
                  className="size-5 shrink-0 text-accent"
                  strokeWidth={1.2}
                  aria-hidden="true"
                />
              </figcaption>
            </DepthCard>
          </div>

          {/* Story details */}
          <div className="min-w-0">
            <div className="space-y-4">
              {storyItems.map((item) => {
                const Icon = item.icon;

                return (
                  <DepthCard as="article"
                    key={item.number}
                    className="group rounded-2xl border border-accent/15 bg-background/75 p-6 hover:border-accent/40 sm:p-7"
                  >
                    <div className="flex gap-5 sm:gap-6">
                      <div className="flex shrink-0 flex-col items-center gap-3 pt-1">
                        <span className="flex size-11 items-center justify-center rounded-full border border-accent/25 bg-background text-accent transition-colors duration-300 group-hover:border-accent/50 group-hover:bg-accent/10 motion-reduce:transition-none">
                          <Icon
                            className="size-[18px]"
                            strokeWidth={1.4}
                            aria-hidden="true"
                          />
                        </span>

                        <span
                          aria-hidden="true"
                          className="font-serif text-xs italic text-accent/75"
                        >
                          {item.number}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-serif text-2xl font-normal leading-snug tracking-tight text-primary sm:text-3xl">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-sm leading-8 text-secondary">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </DepthCard>
                );
              })}
            </div>

            <div className="mt-9 border-t border-border pt-8">
              <Button
                size="lg"
                onClick={() => router.push("/quote")}
                className="group w-full gap-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none sm:w-auto"
              >
                {translations.discussProject}

                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}