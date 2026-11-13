
"use client";

import Link from "next/link";
import { useLanguage } from "@/src/providers";

const capabilityIcons = [
  // 01. Product Development & Prototyping
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9" />
    </svg>
  ),

  // 02. Material Sourcing & Engineering
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M6 7V4h12v3M6 7v13h12V7" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  ),

  // 03. Automated Mass Production
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-7h6v7" />
      <path d="M9 10h.01M15 10h.01" />
    </svg>
  ),

  // 04. Assembly & Quality Finishing
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16v13H4zM8 7V4h8v3" />
      <path d="m8 13 2.5 2.5L16 10" />
    </svg>
  ),
];

export default function ManufacturingCapabilities() {
  const { t } = useLanguage();
  const data = t.manufacturing;

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {data.eyebrow}
            </span>

            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-primary md:text-5xl">
              {data.title}
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-secondary md:text-base">
            {data.description}
          </p>
        </div>
{/* Full-width Manufacturing Video */}
<div className="group relative mb-16 h-[300px] overflow-hidden rounded-2xl bg-surface md:h-[480px]">

  {/* Background Video */}
  <video
    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
    autoPlay
    muted
    loop
    playsInline
    controls
    preload="auto"
    poster="/manufacturing-factory.jpg"
    aria-label="Luggage manufacturing factory production video"
  >
    <source
      src="/manufacturing-factory.mp4"
      type="video/mp4"
    />
    Your browser does not support HTML video.
  </video>

  {/* Dark Overlay */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

  {/* Video Content */}
  <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-7 md:max-w-2xl md:p-12">
    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
      {data.imageEyebrow}
    </span>

    <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-white md:text-5xl">
      {data.imageTitle}
    </h3>

    <p className="mt-4 max-w-lg text-sm leading-7 text-white/80">
      {data.imageDescription}
    </p>
  </div>

  {/* Video Label */}
  <div className="pointer-events-none absolute right-6 top-6 hidden rounded-full border border-white/30 bg-black/30 px-5 py-2 text-xs font-medium tracking-wider text-white backdrop-blur-sm md:block">
    {data.imageLabel}
  </div>

</div>


        {/* Manufacturing Information & Capability Cards */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

          {/* Left Column Information */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {data.processEyebrow}
            </span>

            <h3 className="mt-4 text-2xl font-semibold leading-snug text-primary md:text-3xl">
              {data.processTitle}
            </h3>

            <p className="mt-5 text-sm leading-8 text-secondary">
              {data.processDescription}
            </p>

            <Link
              href="/factory"
              className="group/btn mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-accent hover:shadow-md"
            >
              {data.cta}

              <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Right Column Capability Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.capabilities.map((item, index) => (
              <div
                key={item.number}
                className="group/card rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-accent">
                    {item.number}
                  </span>

                  <div className="h-9 w-9 text-primary transition-transform duration-300 group-hover/card:scale-110">
                    {capabilityIcons[index]}
                  </div>
                </div>

                <h4 className="mt-8 text-lg font-semibold text-primary">
                  {item.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-secondary">
                  {item.description}
                </p>

                <div className="mt-6 h-px w-10 bg-border transition-all duration-300 group-hover/card:w-full group-hover/card:bg-primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
