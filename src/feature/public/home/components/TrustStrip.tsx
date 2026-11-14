
"use client";

import { useLanguage } from "@/src/providers";


export default function TrustStrip() {
  const { t } = useLanguage();

  return (
    <section className="bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            {t.trust.eyebrow}
          </span>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl md:text-4xl">
            {t.trust.title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 md:text-base">
            {t.trust.description}
          </p>
        </div>

        {/* Credibility Items */}
        <div className="grid grid-cols-1 border-t border-neutral-300 sm:grid-cols-2 lg:grid-cols-4">
          {t.trust.items.map((item, index) => (
            <div
              key={item.title}
              className="group border-b border-neutral-300 py-8 sm:px-6 lg:border-b-0 lg:border-r lg:py-10 first:lg:pl-0 last:lg:border-r-0"
            >
              {/* Number */}
              <span className="text-xs tracking-[0.15em] text-neutral-400">
                0{index + 1}
              </span>

              {/* Decorative Line */}
              <div className="my-5 h-px w-9 bg-neutral-400 transition-all duration-300 group-hover:w-16 group-hover:bg-black" />

              {/* Title */}
              <h3 className="text-lg font-semibold tracking-tight text-[#171717]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 max-w-[250px] text-sm leading-7 text-neutral-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
