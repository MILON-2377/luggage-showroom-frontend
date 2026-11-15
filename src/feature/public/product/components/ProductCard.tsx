"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowUpRight, Package, Plus, ScanEye } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

import type {
  Product,
  ProductCopy,
} from "../types/product.types";

interface ProductCardProps {
  product: Product;
  copy: ProductCopy;
  onOpen: () => void;
  onInquire: () => void;
}

export default function ProductCard({
  product,
  copy,
  onOpen,
  onInquire,
}: ProductCardProps) {
  const { t } = useLanguage();
  const c = t.productPage;

  const reducedMotion = useReducedMotion();

  const [imageIndex, setImageIndex] = useState(0);
  const [failedImage, setFailedImage] = useState<string | null>(
    null,
  );

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(pointerX, {
    stiffness: 130,
    damping: 22,
  });

  const rotateY = useSpring(pointerY, {
    stiffness: 130,
    damping: 22,
  });

  const image =
    product.images[imageIndex] || product.images[0];

  const category = c.categories.find(
    (item) => item.id === product.category,
  )?.label;

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.article
      onPointerMove={(event) => {
        if (
          reducedMotion ||
          event.pointerType === "touch" ||
          !window.matchMedia(
            "(hover: hover) and (pointer: fine)",
          ).matches
        ) {
          return;
        }

        const bounds =
          event.currentTarget.getBoundingClientRect();

        const x =
          (event.clientX - bounds.left) / bounds.width - 0.5;

        const y =
          (event.clientY - bounds.top) / bounds.height - 0.5;

        pointerX.set(-y * 10);
        pointerY.set(x * 14);
      }}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformPerspective: 1200,
      }}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-t-[999px] rounded-b-xl border border-primary/5 bg-surface shadow-[0_12px_35px_-24px_rgba(0,0,0,0.25)] transition-[box-shadow,border-color] duration-500 hover:border-accent/30 hover:shadow-[0_30px_65px_-30px_rgba(0,0,0,0.35)] motion-reduce:transition-none"
    >
      {/* Arched product stage */}
      <div className="relative isolate aspect-[4/5] overflow-hidden bg-gradient-to-b from-accent/20 via-surface-muted to-background">
        {/* Soft studio lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(255,255,255,0.55),transparent_65%)]"
        />

        {/* Product reference */}
        <span className="pointer-events-none absolute left-[16%] top-[19%] z-10 font-serif text-[10px] italic tracking-wider text-secondary">
          {product.id.toUpperCase()}
        </span>

        {/* Quick view */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpen}
          aria-label={`${c.quickView}: ${copy.name}`}
          className="absolute right-[12%] top-[15%] z-20 size-10 rounded-full text-secondary"
        >
          <ScanEye className="size-4" aria-hidden="true" />
        </Button>

        {/* Floating product shadow */}
        <motion.div
          aria-hidden="true"
          animate={
            reducedMotion
              ? { scale: 1, opacity: 0.15 }
              : {
                  scale: [1, 0.85, 1],
                  opacity: [0.18, 0.1, 0.18],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute bottom-[24%] left-[23%] h-7 w-[56%] rounded-[50%] bg-primary blur-xl"
        />

        {/* Product image */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${c.quickView}: ${copy.name}`}
          className="absolute inset-x-[9%] bottom-[20%] top-[25%] flex items-center justify-center rounded-3xl outline-none [perspective:800px] focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {image && failedImage !== image ? (
            <motion.img
              key={image}
              src={image}
              alt={copy.name}
              loading="lazy"
              decoding="async"
              onError={() => setFailedImage(image)}
              initial={false}
              animate={
                reducedMotion
                  ? {
                      y: 0,
                      rotate: -10,
                      rotateY: -12,
                    }
                  : {
                      y: [0, -10, 0],
                      rotate: [-10, -7, -10],
                      rotateY: [-12, -4, -12],
                    }
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none h-full w-full object-contain drop-shadow-[10px_18px_12px_rgba(0,0,0,0.2)]"
            />
          ) : (
            <Package
              aria-hidden="true"
              className="size-20 text-accent/50"
              strokeWidth={1}
            />
          )}
        </button>

        {/* Studio caption */}
        <button
          type="button"
          onClick={onOpen}
          className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg py-2 text-[8px] font-medium uppercase tracking-[0.13em] text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <span>{c.concept}</span>

          <span aria-hidden="true">·</span>

          <span className="inline-flex items-center gap-1">
            {c.quickView}

            <ArrowUpRight
              className="size-3"
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      {/* White information panel */}
      <div className="flex flex-1 flex-col bg-surface px-5 pb-4 pt-6 sm:px-6">
        <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-secondary">
          {category}
        </p>

        <h3 className="mt-3 font-serif text-[27px] font-normal leading-[1.12] tracking-tight text-primary">
          <button
            type="button"
            onClick={onOpen}
            className="rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            {copy.name}
          </button>
        </h3>

        <p className="mt-3 line-clamp-2 text-[11px] leading-6 text-secondary">
          {copy.description}
        </p>

        {/* Image selectors and enquiry */}
        <div className="mt-auto pt-6">
          <div className="flex min-h-14 items-center justify-between gap-3 border-t border-border pt-3">
            <div
              role="group"
              aria-label={c.image}
              className="flex flex-wrap items-center gap-0.5"
            >
              {product.images.map((src, index) => (
                <Button
                  key={`${src}-${index}`}
                  variant="ghost"
                  size="icon"
                  onClick={() => setImageIndex(index)}
                  aria-label={`${c.image} ${index + 1}`}
                  aria-pressed={imageIndex === index}
                  className="size-8 rounded-full"
                >
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full transition-colors ${
                      imageIndex === index
                        ? "bg-accent ring-1 ring-accent/40 ring-offset-2 ring-offset-surface"
                        : "bg-primary/25"
                    }`}
                  />
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onInquire}
              aria-label={`${c.inquire}: ${copy.name}`}
              title={c.inquire}
              className="size-10 shrink-0 rounded-full border-border bg-surface"
            >
              <Plus
                className="size-4"
                strokeWidth={1.3}
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}