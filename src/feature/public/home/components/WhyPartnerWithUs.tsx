
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/src/providers";

const benefitIcons = [
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-7h6v7" />
    <path d="M9 10h.01M15 10h.01" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 8v9l9 5 9-5V8M12 13v9" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
    <circle cx="12" cy="12" r="9" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>,
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 7h18v13H3zM7 7V4h10v3M7 12h10M7 16h6" />
  </svg>,
];

const partnerImages = [
  {
    src: "/partner-factory.jpg",
    alt: "Factory production environment",
    label: "Manufacturing",
  },
  {
    src: "/partner-products.jpg",
    alt: "Luggage product details and samples",
    label: "Product Development",
  },
  {
    src: "/partner-team.jpg",
    alt: "Manufacturing and business team",
    label: "People & Partnership",
  },
];

export default function WhyPartnerWithUs() {
  const { t } = useLanguage();
  const data = t.whyPartner;

  return (
    <section className="overflow-hidden bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Heading */}
        <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {data.eyebrow}
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-primary md:text-5xl">
              {data.title}
            </h2>
          </div>

          <p className="max-w-lg text-sm leading-8 text-secondary md:justify-self-end md:text-base">
            {data.description}
          </p>
        </div>

        {/* Factory, product and team photography */}
        <div className="grid h-[420px] grid-cols-2 grid-rows-2 gap-3 overflow-hidden rounded-2xl md:h-[480px] md:grid-cols-3 md:grid-rows-1">
          {partnerImages.map((item, index) => (
            <div
              key={item.src}
              className={`group relative overflow-hidden bg-surface ${
                index === 0 ? "row-span-2 md:row-span-1" : ""
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

              <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-white md:bottom-7 md:left-7">
                {data.photoLabels[index]}
              </span>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="mt-16">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                {data.benefitsEyebrow}
              </span>

              <h3 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
                {data.benefitsTitle}
              </h3>
            </div>

            <p className="max-w-md text-sm leading-7 text-secondary">
              {data.benefitsDescription}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.benefits.map((benefit, index) => (
              <article
                key={benefit.number}
                className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-accent">
                    {benefit.number}
                  </span>

                  <div className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110">
                    {benefitIcons[index]}
                  </div>
                </div>

                <h4 className="mt-8 text-lg font-semibold text-primary">
                  {benefit.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-secondary">
                  {benefit.description}
                </p>

                <div className="mt-6 border-t border-border pt-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                    {data.evidenceLabel}
                  </span>

                  <p className="mt-2 text-xs leading-6 text-secondary">
                    {benefit.evidence}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 md:flex-row md:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-primary">
              {data.ctaTitle}
            </h3>

            <p className="mt-2 text-sm leading-7 text-secondary">
              {data.ctaDescription}
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-white transition hover:bg-accent"
          >
            {data.cta}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
