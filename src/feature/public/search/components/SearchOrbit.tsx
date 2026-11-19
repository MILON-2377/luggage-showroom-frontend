"use client";

import { useEffect, useRef } from "react";
import { Layers3, Search as SearchIcon } from "lucide-react";

export default function SearchOrbit() {
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    const container = first?.parentElement;

    if (!first || !second || !container) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousTime: number | null = null;
    let angle = -Math.PI / 4;

    function positionTiles() {
      if (!container || !first || !second) return;
      const radius = Math.min(container.clientWidth * 0.38, 155);
      const inclination = (58 * Math.PI) / 180;

      [first, second].forEach((tile, index) => {
        const phase = angle + index * Math.PI;
        const x = Math.cos(phase) * radius;
        const y = Math.sin(phase) * radius * Math.cos(inclination);
        const depth = Math.sin(phase) * radius * Math.sin(inclination);

        tile.style.transform = [
          "translate(-50%, -50%)",
          `translate3d(${x}px, ${y}px, ${depth}px)`,
          `rotate(${Math.cos(phase) * 10}deg)`,
        ].join(" ");
        tile.style.opacity = depth < 0 ? "0.65" : "1";
      });
    }

    function animate(time: number) {
      if (document.hidden) {
        previousTime = null;
      } else {
        if (previousTime !== null) {
          const elapsed = Math.min(time - previousTime, 50);
          angle += (elapsed / 16000) * Math.PI * 2;
        }
        previousTime = time;
        positionTiles();
      }
      frame = requestAnimationFrame(animate);
    }

    function updateMotion() {
      cancelAnimationFrame(frame);
      previousTime = null;
      positionTiles();
      if (!preference.matches) frame = requestAnimationFrame(animate);
    }

    const observer = new ResizeObserver(positionTiles);
    observer.observe(container);
    preference.addEventListener("change", updateMotion);
    updateMotion();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      preference.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[76%] max-w-[310px] rounded-full border border-accent/35 [transform:translate(-50%,-50%)_rotateX(58deg)]"
      />

      <div
        ref={firstRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 flex size-14 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-[#39352d] to-[#191919] text-[#d6bf95] shadow-[8px_12px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] will-change-transform"
      >
        <Layers3 className="size-6" strokeWidth={1.2} />
      </div>

      <div
        ref={secondRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 flex size-12 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-[#39352d] to-[#191919] text-[#d6bf95] shadow-[8px_12px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] will-change-transform"
      >
        <SearchIcon className="size-5" strokeWidth={1.4} />
      </div>
    </>
  );
}
