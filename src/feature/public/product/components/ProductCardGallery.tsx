"use client";
import { useState } from "react";
import { Package } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
export default function ProductCardGallery({
  images,
  name,
  onOpen,
}: {
  images: string[];
  name: string;
  onOpen?: () => void;
}) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string | null>(null);
  const src = images[index] || images[0];
  return (
    <div className="relative aspect-[1/1.05] overflow-hidden rounded-[22px] bg-surface-muted">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[18px] border border-accent/15"
      />
      <div
        className="absolute inset-0 flex items-center justify-center rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        {src && failed !== src ? (
          <img
            src={src}
            alt={name}
            onError={() => setFailed(src)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-4 transition-transform duration-700 motion-safe:group-hover:scale-[1.07] motion-reduce:transition-none"
          />
        ) : (
          <Package className="size-16 text-accent/50" strokeWidth={1} />
        )}
      </div>
      {onOpen && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={t.productPage.quickView + ": " + name}
          className="absolute inset-0 rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
        />
      )}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-accent/20 bg-background/90 px-3 py-1 text-[9px] uppercase tracking-widest text-secondary">
        {t.productPage.concept}
      </span>
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-accent/15 bg-background/90 px-2">
          {images.map((image, i) => (
            <Button
              key={image}
              size="icon"
              variant="ghost"
              aria-label={t.productPage.image + " " + (i + 1)}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
              className="size-8 rounded-full"
            >
              <span
                className={
                  "size-1.5 rounded-full " +
                  (index === i ? "bg-accent" : "bg-secondary/30")
                }
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
