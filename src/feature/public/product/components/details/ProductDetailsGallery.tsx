"use client";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Expand, Package, Layers3 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";
import ProductImageLightbox from "./ProductImageLightbox";
export default function ProductDetailsGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 120, damping: 24 }),
    ry = useSpring(y, { stiffness: 120, damping: 24 });
  const src = images[selected] || images[0];
  function reset() {
    x.set(0);
    y.set(0);
  }
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 border-t border-border pt-4 text-[10px] uppercase tracking-[.2em] text-secondary">
        <Layers3 className="size-3.5 text-accent" aria-hidden="true" />
        {c.gallery}
      </div>
      <div className="grid gap-4 sm:grid-cols-[64px_minmax(0,1fr)]">
        <div
          role="group"
          aria-label={c.views}
          className="order-2 flex gap-2 overflow-x-auto pb-2 sm:order-1 sm:max-h-[650px] sm:flex-col sm:overflow-y-auto"
        >
          {images.map((image, i) => (
            <Button
              key={image + i}
              variant="outline"
              onClick={() => setSelected(i)}
              aria-label={c.view + " " + (i + 1)}
              aria-pressed={selected === i}
              className={
                "h-20 w-16 shrink-0 overflow-hidden rounded-xl p-1 " +
                (selected === i
                  ? "border-accent ring-1 ring-accent/30"
                  : "border-border")
              }
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </Button>
          ))}
        </div>
        <div className="order-1 min-w-0 [perspective:1400px] sm:order-2">
          <motion.div
            onPointerMove={(e) => {
              if (
                reduced ||
                e.pointerType === "touch" ||
                !matchMedia("(hover:hover) and (pointer:fine)").matches
              )
                return;
              const b = e.currentTarget.getBoundingClientRect();
              x.set((0.5 - (e.clientY - b.top) / b.height) * 7);
              y.set(((e.clientX - b.left) / b.width - 0.5) * 10);
            }}
            onPointerLeave={reset}
            onPointerCancel={reset}
            style={{
              rotateX: reduced ? 0 : rx,
              rotateY: reduced ? 0 : ry,
              transformPerspective: 1400,
            }}
            className="relative flex aspect-[4/5] items-center justify-center rounded-t-[100px] rounded-b-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-surface to-surface-muted shadow-[12px_18px_0_-8px_rgba(165,139,101,.12),0_30px_60px_-40px_rgba(0,0,0,.3)] sm:rounded-t-[130px]"
          >
            {src && failed !== src ? (
              <img
                src={src}
                alt={name}
                onError={() => setFailed(src)}
                fetchPriority="high"
                className="h-full w-full rounded-[inherit] object-contain p-6 drop-shadow-[10px_20px_15px_rgba(0,0,0,.15)]"
              />
            ) : (
              <Package className="size-24 text-accent/40" strokeWidth={1} />
            )}
            <span className="pointer-events-none absolute bottom-5 left-5 max-w-[65%] text-[9px] uppercase tracking-widest text-secondary">
              {c.concept}
            </span>
            {src && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLightbox(selected)}
                aria-label={c.expand}
                className="absolute bottom-4 right-4 rounded-full bg-surface"
              >
                <Expand className="size-4" />
              </Button>
            )}
          </motion.div>
        </div>
      </div>
      <p className="mt-6 border-t border-border pt-4 text-xs leading-6 text-secondary">
        {c.galleryNote}
      </p>
      <ProductImageLightbox
        images={images}
        name={name}
        index={lightbox}
        onIndex={setLightbox}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
