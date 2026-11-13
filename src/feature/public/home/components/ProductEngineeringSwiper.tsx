
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import type {
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from "react";

import type { Swiper as SwiperType } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";

type BagCategory = {
  key: string;
  name: string;
  image: string;
  alt: string;
};

type Props = {
  bagCategories: BagCategory[];
  swiperRef: MutableRefObject<SwiperType | null>;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
};

export default function ProductEngineeringSwiper({
  bagCategories,
  swiperRef,
  setSelectedIndex,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  // Initialize Swiper only in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay, EffectCoverflow]}
      className="product-engineering-swiper absolute inset-0 z-20 h-full w-full"
      effect="coverflow"
      centeredSlides={true}
      slidesPerView="auto"
      loop={true}
      loopAdditionalSlides={bagCategories.length}
      slideToClickedSlide={true}
      grabCursor={true}
      speed={900}
      watchSlidesProgress={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      coverflowEffect={{
        rotate: 12,
        stretch: -25,
        depth: 150,
        modifier: 1,
        slideShadows: false,
      }}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        setSelectedIndex(swiper.realIndex);
      }}
      onRealIndexChange={(swiper) => {
        setSelectedIndex(swiper.realIndex);
      }}
    >
      {bagCategories.map((bag) => (
        <SwiperSlide
          key={bag.key}
          className="!h-[76%] !w-[55%] !self-center"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
            <Image
              src={bag.image}
              alt={bag.alt}
              fill
              priority={false}
              sizes="(max-width: 768px) 70vw, 40vw"
              className="object-contain p-3 md:p-6"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
