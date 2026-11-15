"use client";

import {
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type PointerEvent,
} from "react";
import { cn } from "@/src/lib/utils";

interface DepthCardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "figure";
  strength?: number;
}

/** A perspective surface. It never intercepts clicks or changes tab order. */
export function DepthCard({
  as: Tag = "div",
  strength = 5,
  className,
  children,
  ...props
}: DepthCardProps) {
  const element = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reset = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      element.current?.style.removeProperty("--depth-rx");
      element.current?.style.removeProperty("--depth-ry");
      element.current?.style.removeProperty("--depth-lift");
      element.current?.style.removeProperty("--depth-glow");
    };
    preference.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    return () => {
      reset();
      preference.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  const reset = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    for (const property of ["--depth-rx", "--depth-ry", "--depth-lift", "--depth-glow"]) {
      element.current?.style.removeProperty(property);
    }
  };

  const move = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const surface = event.currentTarget;
    element.current = surface;
    const bounds = surface.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));

    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      surface.style.setProperty("--depth-rx", `${(0.5 - y) * strength * 2}deg`);
      surface.style.setProperty("--depth-ry", `${(x - 0.5) * strength * 2}deg`);
      surface.style.setProperty("--depth-lift", "-5px");
      surface.style.setProperty("--depth-x", `${x * 100}%`);
      surface.style.setProperty("--depth-y", `${y * 100}%`);
      surface.style.setProperty("--depth-glow", "1");
      frame.current = null;
    });
  };

  return (
    <Tag
      {...props}
      data-depth-card=""
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={cn(
        "relative isolate transition-[transform,box-shadow,border-color] duration-500 ease-out",
        "motion-safe:[transform:perspective(1200px)_rotateX(var(--depth-rx,0deg))_rotateY(var(--depth-ry,0deg))_translateY(var(--depth-lift,0px))]",
        "shadow-[0_16px_50px_-30px_rgba(0,0,0,0.35)] hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.35)]",
        "motion-reduce:transform-none motion-reduce:transition-none",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] border border-accent/10 bg-[radial-gradient(650px_circle_at_var(--depth-x,50%)_var(--depth-y,0%),rgba(255,255,255,0.14),transparent_65%)] opacity-[var(--depth-glow,0)] transition-opacity duration-500 motion-reduce:hidden"
      />
    </Tag>
  );
}

/** Decorative bag sculpture, drawn locally; no stock image or network request. */
export function SculptedBag() {
  const id = useId().replace(/:/g, "");
  const frontId = `about-bag-front-${id}`;
  const sideId = `about-bag-side-${id}`;
  return (
    <div aria-hidden="true" className="relative flex h-72 w-full items-center justify-center overflow-hidden sm:h-80">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/5" />
      <div className="absolute size-64 rounded-full border border-accent/20 sm:size-72" />
      <div className="absolute size-56 rounded-full border border-dashed border-accent/15 motion-safe:animate-[spin_60s_linear_infinite]" />
      <div className="absolute bottom-5 h-9 w-60 rounded-[50%] bg-black/40 blur-xl" />
      <div className="absolute bottom-4 h-8 w-64 rounded-[50%] border border-accent/25 bg-gradient-to-b from-accent/15 to-transparent [transform:rotateX(55deg)]" />
      <svg viewBox="0 0 400 330" fill="none" className="relative h-72 w-full max-w-sm drop-shadow-2xl sm:h-80">
        <defs>
          <linearGradient id={frontId} x1="95" y1="130" x2="300" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity="0.24" />
            <stop offset="0.45" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.13" />
          </linearGradient>
          <linearGradient id={sideId} x1="285" y1="150" x2="335" y2="275" gradientUnits="userSpaceOnUse">
            <stop stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <g className="text-accent">
          <path d="M160 149V112C160 64 241 60 241 111V144" stroke="currentColor" strokeWidth="11" strokeOpacity="0.15" />
          <path d="M160 149V112C160 64 241 60 241 111V144" stroke="currentColor" strokeWidth="4" strokeOpacity="0.65" />
          <path d="M130 148V108C130 53 216 46 216 107V145" stroke="currentColor" strokeWidth="12" strokeOpacity="0.22" />
          <path d="M130 148V108C130 53 216 46 216 107V145" stroke="currentColor" strokeWidth="4" />
          <path d="M278 127L318 151L334 269L284 295L265 168Z" fill="#151513" />
          <path d="M278 127L318 151L334 269L284 295L265 168Z" fill={`url(#${sideId})`} stroke="currentColor" strokeOpacity="0.45" />
          <path d="M107 146L145 124L278 127L305 151L265 170Z" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeOpacity="0.45" />
          <path d="M107 146L277 149L292 279Q291 293 275 295L103 288Q88 287 90 272Z" fill="#1b1b18" />
          <path d="M107 146L277 149L292 279Q291 293 275 295L103 288Q88 287 90 272Z" fill={`url(#${frontId})`} stroke="currentColor" strokeOpacity="0.6" />
          <path d="M116 158L266 161L280 276Q279 283 271 283L109 277Q101 277 103 269Z" stroke="currentColor" strokeOpacity="0.28" strokeDasharray="2 4" />
          <path d="M115 148Q184 185 274 151" stroke="currentColor" strokeOpacity="0.7" />
          <path d="M184 173V215Q192 226 200 215V174" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeOpacity="0.6" />
          <rect x="180" y="203" width="24" height="13" rx="3" fill="#191917" stroke="currentColor" />
          <path d="M132 140V160M219 140V160" stroke="currentColor" strokeWidth="5" />
          <circle cx="132" cy="159" r="4" fill="#191917" stroke="currentColor" />
          <circle cx="219" cy="159" r="4" fill="#191917" stroke="currentColor" />
          <path d="M308 163L318 263L297 276" stroke="currentColor" strokeOpacity="0.25" />
        </g>
      </svg>
    </div>
  );
}
