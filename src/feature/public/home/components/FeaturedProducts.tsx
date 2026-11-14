
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useLanguage } from "@/providers";

const productImages = [
  "/1.png",
  "/luggage_engineering_1.png",
  "/2.png",
  "/4.png",
  "/5.png",
  "/7.png",
];

const cardBackgrounds = [
  "from-[#d8c3bc]/70 via-[#e5d9d3]/50 to-[#f4f0eb]",
  "from-[#d9b8aa]/70 via-[#e6d3ca]/50 to-[#f4f0eb]",
  "from-[#c9bca0]/70 via-[#ded6c7]/50 to-[#f4f0eb]",
  "from-[#b5a49c]/70 via-[#d1c5bf]/50 to-[#f4f0eb]",
];

const cardPrices = ["$248", "$88", "$310", "$195"];

const colorDots = [
  ["#6f2636", "#ae7445", "#242726"],
  ["#e0b8ab", "#c9bca0", "#6f2636"],
  ["#c9bca0", "#ae7445", "#242726"],
  ["#242726", "#6f2636", "#c9bca0"],
];

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } =
        scrollContainerRef.current;

      const scrollAmount = clientWidth * 0.75;

      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mouse-follow 3D interaction
  const handleCardPointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "touch") return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    const y =
      ((event.clientY - rect.top) / rect.height) * 2 - 1;

    const rotateY = x * 8;
    const rotateX = y * -7;

    card.style.setProperty("--card-rx", `${rotateX}deg`);
    card.style.setProperty("--card-ry", `${rotateY}deg`);

    card.style.setProperty(
      "--image-rx",
      `${rotateX * -0.45}deg`
    );

    card.style.setProperty(
      "--image-ry",
      `${rotateY * -0.65}deg`
    );
  };

  // Return to resting position
  const handleCardPointerLeave = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    const card = event.currentTarget;

    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
    card.style.setProperty("--image-rx", "0deg");
    card.style.setProperty("--image-ry", "0deg");
  };

  return (
    <section className="relative overflow-hidden bg-[var(--background)] px-6 py-28 text-[var(--foreground)] md:py-36">
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-t-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--bg-red)]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--secondary)]">
                {t.featuredProducts.eyebrow}
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-[var(--primary)] sm:text-5xl md:text-6xl">
              {t.featuredProducts.title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--secondary)]">
              {t.featuredProducts.description}
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              >
                ←
              </button>

              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              >
                →
              </button>
            </div>

            <Link
              href="/products"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--surface)]"
            >
              <span>{t.featuredProducts.viewAll}</span>

              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Product Cards Slider */}
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {t.featuredProducts.items.map((item, index) => {
            const bgGradient =
              cardBackgrounds[index % cardBackgrounds.length];

            const price =
              cardPrices[index % cardPrices.length];

            const dots =
              colorDots[index % colorDots.length];

            return (
              <div
                key={item.slug}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={handleCardPointerLeave}
                className="product-card-3d group relative flex min-w-[300px] flex-1 snap-start flex-col overflow-hidden rounded-t-full border border-[var(--border)] bg-[var(--surface)] shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:min-w-[340px] lg:min-w-[calc(25%-18px)]"
              >
                {/* Product Image Stage */}
                <div
                  className={`relative flex h-[380px] w-full flex-col justify-between overflow-hidden rounded-t-[220px] bg-gradient-to-b ${bgGradient} p-6 pt-12`}
                >
                  {/* Top Bar */}
                  <div className="z-10 flex items-center justify-between px-6 pt-4">
                    <span className="font-serif text-xs italic tracking-wider text-[var(--primary)]">
                      {item.number || `0${index + 1}`}
                    </span>

                    <button
                      aria-label="Save to wishlist"
                      className="text-lg text-[var(--primary)] opacity-70 transition-opacity hover:opacity-100"
                    >
                      ♡
                    </button>
                  </div>

                  {/* 3D Product Image */}
                  <div className="relative my-auto flex h-[210px] w-full items-center justify-center">
                    <div className="product-image-3d absolute inset-0">
                      {/* Circular 360 Degree Motion */}
                      <div className="product-image-orbit absolute inset-0">
                        <Image
                          src={productImages[index % productImages.length]}
                          alt={item.title}
                          fill
                          unoptimized
                          priority={index === 0}
                          className="object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.12)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Image Bar */}
                  <div className="z-10 flex items-center justify-between border-t border-[var(--border)]/30 px-6 pb-2 pt-3 text-[11px] uppercase tracking-[0.15em] text-[var(--secondary)]">
                    <span>3D DESIGN STUDY</span>

                    <Link
                      href={`/products/${item.slug}`}
                      className="flex items-center gap-1 font-medium transition-colors hover:text-[var(--primary)]"
                    >
                      Discover ↗
                    </Link>
                  </div>
                </div>

                {/* Product Information */}
                <div className="flex flex-1 flex-col justify-between bg-[var(--surface)] p-7">
                  <div>
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">
                      { "HANDBAGS / COLLECTION 01"}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-3xl font-normal tracking-tight text-[var(--primary)]">
                        {item.title}
                      </h3>

                      <span className="pt-1 font-serif text-xl font-normal text-[var(--primary)]">
                        {price}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--secondary)]">
                      {item.description}
                    </p>
                  </div>

                  {/* Colors and Quick Add */}
                  <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5">
                    <div className="flex items-center gap-2">
                      {dots.map((dotColor, dIdx) => (
                        <span
                          key={dIdx}
                          className="h-2.5 w-2.5 rounded-full border border-black/10 shadow-sm"
                          style={{
                            backgroundColor: dotColor,
                          }}
                        />
                      ))}
                    </div>

                    <Link
                      href={`/products/${item.slug}`}
                      aria-label="View product"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-transparent text-[var(--primary)] transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                    >
                      +
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Animation Styles */}
      <style jsx global>{`
        .product-card-3d {
          perspective: 1200px;
          transform-style: preserve-3d;

          transform:
            perspective(1200px)
            rotateX(var(--card-rx, 0deg))
            rotateY(var(--card-ry, 0deg));

          transition:
            transform 0.25s ease-out,
            box-shadow 0.5s ease;
          will-change: transform;
        }

        .product-image-3d {
          transform-style: preserve-3d;

          transform:
            translateZ(32px)
            rotateX(var(--image-rx, 0deg))
            rotateY(var(--image-ry, 0deg));

          transition: transform 0.35s ease-out;
          will-change: transform;
        }

        /* Move the entire product image around a circular path */
        .product-image-orbit {
          offset-path: circle(18px at 50% 50%);
          offset-anchor: center;
          offset-rotate: 0deg;

          animation: productCircularOrbit 24s linear infinite;

          will-change: offset-distance;
        }

        /* Complete one smooth 360-degree circle */
        @keyframes productCircularOrbit {
          from {
            offset-distance: 0%;
          }

          to {
            offset-distance: 100%;
          }
        }

        .product-image-orbit img {
          animation: productImageFloat 5s ease-in-out infinite;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        .product-card-3d:hover .product-image-3d {
          transition: transform 0.12s ease-out;
        }

        @keyframes productImageFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-9px) scale(1.015);
          }
        }

        @media (hover: none) {
          .product-card-3d {
            transform: none;
          }

          .product-image-3d {
            transform: translateZ(15px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .product-card-3d,
          .product-image-3d {
            transition: none;
          }

          .product-image-orbit,
          .product-image-orbit img {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
