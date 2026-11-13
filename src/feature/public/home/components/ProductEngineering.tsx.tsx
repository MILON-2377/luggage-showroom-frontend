
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";

const ProductEngineeringSwiper = dynamic(
  () => import("./ProductEngineeringSwiper"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    ),
  }
);

// Bag category information
const bagCategories = [
  {
    key: "suitcase",
    name: "Suitcase",
    image: "/1.png",
    alt: "Premium suitcase",
    title: "Premium Suitcase Manufacturing",
    description:
      "We manufacture premium suitcases combining durability, lightweight construction, modern aesthetics, and practical functionality. Every detail is carefully engineered to deliver reliable travel performance.",
    details: [
      "ABS, PC and PP materials",
      "Advanced trolley systems",
      "Smooth 360° spinner wheels",
      "Custom colors and branding",
    ],
  },
  {
    key: "business-luggage",
    name: "Business Luggage",
    image: "/2.png",
    alt: "Business luggage",
    title: "Professional Business Luggage",
    description:
      "Designed for modern professionals, our business luggage combines elegant styling with smart organization, protective compartments, and dependable construction for business travel.",
    details: [
      "Professional exterior design",
      "Laptop and document compartments",
      "Organized storage solutions",
      "Custom branding options",
    ],
  },
  {
    key: "backpack",
    name: "Backpack",
    image: "/3.png",
    alt: "Modern backpack",
    title: "Functional Backpack Development",
    description:
      "From everyday backpacks to specialized designs, we develop comfortable, practical and stylish products with carefully selected materials and reliable construction.",
    details: [
      "Ergonomic shoulder straps",
      "Multiple storage compartments",
      "Water-resistant fabric options",
      "Custom sizes and designs",
    ],
  },
  {
    key: "duffel-bag",
    name: "Duffel Bag",
    image: "/4.png",
    alt: "Travel duffel bag",
    title: "Versatile Duffel Bag Production",
    description:
      "Our duffel bags are designed for travel, sports and everyday use. We focus on spacious storage, durable fabrics, comfortable carrying systems and contemporary styling.",
    details: [
      "Durable fabric construction",
      "Spacious storage capacity",
      "Reinforced handles and straps",
      "Custom material selection",
    ],
  },
  {
    key: "handbag",
    name: "Handbag",
    image: "/5.png",
    alt: "Fashion handbag",
    title: "Fashion Handbag Manufacturing",
    description:
      "We create fashionable handbags that balance visual appeal, quality materials and functional design. Our manufacturing capabilities support different styles and customization requirements.",
    details: [
      "Premium material selection",
      "Fashion-focused designs",
      "Quality hardware and finishing",
      "Private label customization",
    ],
  },
];

export default function ProductEngineering() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const selectedBag = bagCategories[selectedIndex];

  // Observe section visibility for entrance animation
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Previous slide
  const handlePrevious = () => {
    swiperRef.current?.slidePrev(900);
  };

  // Next slide
  const handleNext = () => {
    swiperRef.current?.slideNext(900);
  };

  // Select category
  const handleCategoryChange = (index: number) => {
    setSelectedIndex(index);
    swiperRef.current?.slideToLoop(index, 900);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Section Heading */}
        <div
          className={`mx-auto mb-14 max-w-3xl text-center transition-all duration-1000 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            Product Innovation & Engineering
          </span>

          <h2 className="text-3xl font-bold leading-tight text-primary md:text-5xl">
            Engineering Bags for
            <span className="text-accent"> Every Journey</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-secondary md:text-lg">
            From concept development to final production, we combine
            innovative design, material expertise and advanced manufacturing
            to create products that meet modern market demands.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: Product Image Slider */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="relative">

              {/* Decorative Background */}
              <div className="absolute -inset-4 rounded-[2rem] bg-surface-muted opacity-70 blur-2xl" />

              <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border bg-surface md:h-[520px]">

                {/* Decorative Circles */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border md:h-[390px] md:w-[390px]" />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border md:h-[290px] md:w-[290px]" />

                {/* Swiper Component */}
                <ProductEngineeringSwiper
                  bagCategories={bagCategories}
                  swiperRef={swiperRef}
                  setSelectedIndex={setSelectedIndex}
                />

                {/* Image Counter */}
                <div className="absolute bottom-5 left-5 z-30 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-md">
                  {String(selectedIndex + 1).padStart(2, "0")}
                  <span className="mx-2 text-secondary">/</span>
                  {String(bagCategories.length).padStart(2, "0")}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute bottom-4 right-5 z-30 flex gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label="Previous bag category"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next bag category"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Indicators */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {bagCategories.map((bag, index) => (
                <button
                  key={bag.key}
                  type="button"
                  onClick={() => handleCategoryChange(index)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 md:text-sm ${
                    selectedIndex === index
                      ? "bg-primary text-white shadow-lg"
                      : "border border-border bg-surface text-secondary hover:border-accent hover:text-accent"
                  }`}
                >
                  {bag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Category Details */}
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <div
              key={selectedBag.key}
              className="animate-[categoryChange_0.5s_ease]"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {selectedBag.name}
              </span>

              <h3 className="mt-6 text-3xl font-bold leading-tight text-primary md:text-4xl">
                {selectedBag.title}
              </h3>

              <p className="mt-6 text-base leading-8 text-secondary">
                {selectedBag.description}
              </p>

              {/* Product Details */}
              <div className="mt-8">
                <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-primary">
                  Engineering Highlights
                </h4>

                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedBag.details.map((detail, index) => (
                    <div
                      key={detail}
                      className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-sm leading-6 text-primary">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/engineering"
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:shadow-xl"
                >
                  Explore Our Engineering

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Change Animation */}
      <style jsx>{`
        @keyframes categoryChange {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
