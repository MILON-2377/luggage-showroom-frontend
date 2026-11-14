
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Michael Anderson",
    position: "Wholesale Distributor",
    company: "Global Travel Supplies",
    country: "United States",
    initials: "MA",
    rating: 5,
    review:
      "The quality of the luggage exceeded our expectations. The finishing, material selection, and attention to detail were impressive. Their team also made the customization process very smooth.",
  },
  {
    id: 2,
    name: "Sarah Williams",
    position: "Purchasing Manager",
    company: "Elite Fashion Trading",
    country: "United Kingdom",
    initials: "SW",
    rating: 5,
    review:
      "We were looking for a reliable manufacturing partner for our handbag collection. The product quality, communication, and customization options made the experience excellent.",
  },
  {
    id: 3,
    name: "David Chen",
    position: "Import Manager",
    company: "Pacific Commercial Group",
    country: "Australia",
    initials: "DC",
    rating: 5,
    review:
      "From product development to final packaging, the entire process was professionally managed. We particularly appreciate the consistency and attention to quality.",
  },
  {
    id: 4,
    name: "James Mitchell",
    position: "Retail Business Owner",
    company: "Urban Travel Store",
    country: "Canada",
    initials: "JM",
    rating: 5,
    review:
      "The luggage collection offers excellent design and practical features. We also appreciated the flexibility to customize colors, branding, and packaging for our business.",
  },
  {
    id: 5,
    name: "Olivia Martin",
    position: "Product Sourcing Director",
    company: "Style House",
    country: "France",
    initials: "OM",
    rating: 5,
    review:
      "Their range of bags and accessories gives us plenty of options for our product collections. The development team understood our requirements and delivered a professional experience.",
  },
];

export default function ClientReviews() {
  const [swiperInstance, setSwiperInstance] =
    useState<SwiperType | null>(null);

  // Render Swiper only after the browser mounts the component.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="overflow-hidden bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Section Heading */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Client Testimonials
            </span>

            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-primary md:text-5xl">
              Trusted by businesses.
              <span className="text-secondary">
                {" "}Built on relationships.
              </span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-secondary md:text-base">
            Discover what our business partners say about working with us,
            from product development to manufacturing and delivery.
          </p>
        </div>

        {/* Review Swiper */}
        <div className="relative">

          {isMounted ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              onSwiper={setSwiperInstance}
              loop={true}
              speed={900}
              grabCursor={true}
              slidesPerView={1.1}
              spaceBetween={16}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="reviews-swiper !pb-14"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="!h-auto">

                  {/* Review Card */}
                  <div className="flex h-full min-h-[360px] flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg md:p-8">

                    <div>
                      {/* Quote Icon */}
                      <div className="mb-6 font-serif text-6xl leading-none text-accent">
                        “
                      </div>

                      {/* Rating */}
                      <div className="mb-5 flex gap-1 text-accent">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <span key={index} className="text-base">
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-sm leading-8 text-secondary">
                        {review.review}
                      </p>
                    </div>

                    {/* Client Details */}
                    <div className="mt-8 border-t border-border pt-6">

                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                          {review.initials}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-primary">
                            {review.name}
                          </h3>

                          <p className="mt-1 text-xs text-secondary">
                            {review.position}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-medium text-primary">
                          {review.company}
                        </span>

                        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-secondary">
                          {review.country}
                        </span>
                      </div>

                    </div>
                  </div>

                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="min-h-[420px] w-full" />
          )}

          {/* Slider Navigation */}
          <div className="mt-5 flex items-center justify-between">

            <div className="text-xs font-medium uppercase tracking-widest text-secondary">
              What our partners say
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => swiperInstance?.slidePrev()}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => swiperInstance?.slideNext()}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition-all duration-300 hover:bg-accent"
              >
                →
              </button>

            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-secondary">
            Every partnership begins with a conversation.
          </p>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-3 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            Start a Partnership

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

      </div>

      {/* Swiper Pagination Styling */}
      <style jsx global>{`
        .reviews-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .reviews-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 20px;
          background: currentColor;
          opacity: 0.2;
          transition: all 0.3s ease;
        }

        .reviews-swiper .swiper-pagination-bullet-active {
          width: 28px;
          opacity: 1;
          background: var(--color-primary, currentColor);
        }
      `}</style>
    </section>
  );
}
