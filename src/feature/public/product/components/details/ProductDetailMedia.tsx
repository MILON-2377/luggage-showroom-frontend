"use client";
import { useState } from "react";
import { Expand, Images } from "lucide-react";
import { useLanguage } from "@/src/providers";
import ProductImageLightbox from "./ProductImageLightbox";
export default function ProductDetailMedia({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const [index, setIndex] = useState<number | null>(null);
  return (
    <div>
      <p className="mb-6 text-sm leading-8 text-secondary">{c.mediaNote}</p>
      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={c.expand + " " + (i + 1)}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-accent/20 bg-background outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <img
                src={src}
                alt={name + " — " + c.view + " " + (i + 1)}
                loading="lazy"
                className="h-full w-full object-contain p-4 transition-transform duration-500 motion-safe:group-hover:scale-105"
              />
              <Expand className="absolute bottom-4 right-4 size-4 text-accent" />
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-accent/30 p-10 text-center">
          <Images className="mx-auto size-8 text-accent" strokeWidth={1} />
          <p className="mt-4 text-sm text-secondary">{c.mediaPending}</p>
        </div>
      )}
      <ProductImageLightbox
        images={images}
        name={name}
        index={index}
        onIndex={setIndex}
        onClose={() => setIndex(null)}
      />
    </div>
  );
}
