
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/src/providers";

type ColorKey = "black" | "beige" | "olive" | "silver";

const colorOptions: {
  key: ColorKey;
  color: string;
  image: string;
}[] = [
  {
    key: "black",
    color: "#242424",
    image: "/6.png",
  },
  {
    key: "beige",
    color: "#B9A58C",
    image: "/7.png",
  },
  {
    key: "olive",
    color: "#788477",
    image: "/8.png",
  },
  {
    key: "silver",
    color: "#A7A9AC",
    image: "/4.png",
  },
];

export default function CustomizationSection() {
  const { t } = useLanguage();

  const [selectedColor, setSelectedColor] =
    useState<ColorKey>("beige");

  const selectedOption = colorOptions.find(
    (option) => option.key === selectedColor
  )!;

  return (
    <section className="overflow-hidden bg-surface-muted px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* LEFT: Content */}
          <div className="order-2 lg:order-1">

            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary">
              {t.customization.eyebrow}
            </span>

            <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-[1.2] tracking-tight text-primary sm:text-4xl md:text-5xl">
              {t.customization.title}
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-8 text-secondary md:text-base">
              {t.customization.description}
            </p>

            {/* Customization Features */}
            <div className="mt-10 border-t border-border">

              {t.customization.features.map((feature) => (
                <div
                  key={feature.number}
                  className="group grid grid-cols-[40px_1fr] gap-4 border-b border-border py-5"
                >
                  <span className="pt-1 text-xs tracking-widest text-secondary">
                    {feature.number}
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-primary transition-colors group-hover:text-accent">
                      {feature.title}
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            {/* CTA */}
            <div className="mt-9">
              <Link
                href="/oem-odm"
                className="group inline-flex items-center gap-5 bg-primary px-7 py-4 text-sm font-medium text-background transition-colors duration-300 hover:bg-accent"
              >
                {t.customization.cta}

                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <p className="mt-4 text-xs text-secondary">
                {t.customization.note}
              </p>
            </div>

          </div>

          {/* RIGHT: Customization Visual */}
          <div className="order-1 lg:order-2">

            <div className="relative bg-[#EAE7DF] p-4 sm:p-6">

              {/* Main Suitcase Image */}
              <div className="relative aspect-[4/4.5] overflow-hidden bg-[#E2DED5]">

                <Image
                  key={selectedOption.image}
                  src={selectedOption.image}
                  alt={`Custom luggage in ${selectedColor}`}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-500"
                />

                {/* Image Label */}
                <div className="absolute left-5 top-5 z-10">
                  <span className="bg-background/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Custom Collection
                  </span>
                </div>

                {/* Image Index */}
                <div className="absolute bottom-5 right-5 z-10">
                  <span className="text-xs tracking-widest text-white drop-shadow-md">
                    01 / 04
                  </span>
                </div>

              </div>

              {/* Color Selection */}
              <div className="mt-6 bg-background p-5 sm:p-6">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-secondary">
                      {t.customization.colorLabel}
                    </span>

                    <h3 className="mt-2 text-sm font-semibold text-primary">
                      {t.customization.colors[selectedColor]}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {colorOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSelectedColor(option.key)}
                        aria-label={t.customization.colors[option.key]}
                        aria-pressed={selectedColor === option.key}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                          selectedColor === option.key
                            ? "border-primary scale-110"
                            : "border-transparent hover:border-neutral-400"
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10"
                          style={{ backgroundColor: option.color }}
                        />
                      </button>
                    ))}
                  </div>

                </div>

              </div>

              {/* Bottom Material Details */}
              <div className="mt-4 grid grid-cols-3 gap-3">

                {[
                  {
                    image: "/3.png",
                    label: "Material",
                  },
                  {
                    image: "/4.png",
                    label: "Branding",
                  },
                  {
                    image: "/2.png",
                    label: "Packaging",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#D8D3C9]">
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        sizes="(max-width: 1024px) 30vw, 15vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <p className="mt-2 text-[10px] font-medium uppercase tracking-widest text-secondary">
                      {item.label}
                    </p>
                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
