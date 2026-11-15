"use client";

import { DepthCard } from "./About3D";

import { useState } from "react";
import GalleryLightbox from "./GalleryLightbox";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Images, Expand } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

export interface FactoryOfficeGalleryProps {
  images: GalleryImage[];
}

export default function FactoryOfficeGallery({
  images,
}: FactoryOfficeGalleryProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t } = useLanguage();
  const translations = t.aboutUs.gallery;

  if (images.length === 0) return null;

  const hasFeaturedImage = images.length >= 3;

  const gridColumns =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="relative isolate overflow-hidden bg-surface-muted py-16 text-foreground sm:py-20 lg:py-28">
      {/* Architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 -top-48 -z-10 size-[620px] rounded-full border border-accent/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-[460px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section introduction */}
        <div className="border-t border-border pt-7">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-accent/25 bg-background text-accent">
              <Images
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

        {/* Editorial image gallery */}
        <div
          className={`mt-12 grid items-stretch gap-5 lg:mt-16 lg:gap-6 ${gridColumns}`}
        >
          {images.map((image, index) => {
            const isFeatured = hasFeaturedImage && index === 0;

            return (
              <DepthCard as="figure"
                key={`${image.src}-${index}`}
                className={`group relative m-0 flex min-w-0 flex-col overflow-hidden border border-border bg-background transition-all duration-500  hover:border-accent/35 hover:shadow-xl hover:shadow-primary/5 motion-reduce:transform-none motion-reduce:transition-none ${
                  isFeatured
                    ? "rounded-t-[100px] rounded-b-lg sm:col-span-2 sm:rounded-t-[140px] lg:row-span-2"
                    : "rounded-2xl"
                }`}
              >
                {/* Image stage */}
                <div
                  className={`relative overflow-hidden bg-surface ${
                    isFeatured
                      ? "aspect-[4/3] lg:aspect-auto lg:min-h-[480px] lg:flex-1"
                      : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt || translations.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-primary/35"
                  />

                  {/* Image index */}
                  <span
                    aria-hidden="true"
                    className={`absolute flex size-9 items-center justify-center rounded-full border border-white/30 bg-primary/10 font-serif text-xs italic text-white backdrop-blur-md ${
                      isFeatured
                        ? "left-6 top-10 sm:left-8 sm:top-14"
                        : "left-4 top-4"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Category */}
                  {image.category && (
                    <div
                      className={`absolute bottom-5 left-5 right-5 ${
                        isFeatured ? "sm:bottom-7 sm:left-7 sm:right-7" : ""
                      }`}
                    >
                      <span className="inline-block max-w-full break-words rounded-full border border-white/25 bg-primary/20 px-4 py-2 text-[10px] font-medium uppercase leading-5 tracking-[0.12em] text-white backdrop-blur-md">
                        {image.category}
                      </span>
                    </div>
                  )}
                
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`${translations.viewImage}: ${image.alt || translations.imageAlt}`}
                    className="absolute inset-0 z-10 cursor-zoom-in rounded-[inherit] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
                  >
                    <span className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full border border-white/30 bg-primary/40 text-white opacity-100 backdrop-blur-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"><Expand className="size-4" aria-hidden="true" /></span>
                  </button>
                </div>

                {/* Caption */}
                <figcaption
                  className={`flex items-start justify-between gap-5 border-t border-border ${
                    isFeatured ? "p-6 sm:p-7" : "p-5"
                  }`}
                >
                  <p
                    className={`min-w-0 break-words font-serif font-normal leading-relaxed text-primary ${
                      isFeatured ? "text-xl sm:text-2xl" : "text-lg"
                    }`}
                  >
                    {image.alt || translations.imageAlt}
                  </p>

                  <span
                    aria-hidden="true"
                    className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/25 text-accent transition-colors duration-300 group-hover:bg-accent/10 motion-reduce:transition-none"
                  >
                    <Images
                      className="size-3.5"
                      strokeWidth={1.4}
                    />
                  </span>
                </figcaption>
              </DepthCard>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between lg:mt-12">
          <Button
            size="lg"
            onClick={() => router.push("/factory")}
            className="group gap-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
          >
            {translations.seeFactory}

            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/quote")}
            className="group gap-5 bg-transparent"
          >
            {translations.requestQuote}

            <ArrowUpRight
              className="size-4 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
      <GalleryLightbox images={images} activeIndex={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex} />
    </section>
  );
}