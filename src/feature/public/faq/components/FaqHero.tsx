"use client";

import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  ArrowUpRight,
  Bot,
  Cpu,
  Globe2,
  Layers3,
  Package,
  Sparkles,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

interface FaqHeroProps {
  onAsk: () => void;
}

const cubeFaces = [
  {
    Icon: Bot,
    transform: "translateZ(64px)",
  },
  {
    Icon: Cpu,
    transform: "rotateY(180deg) translateZ(64px)",
  },
  {
    Icon: Layers3,
    transform: "rotateY(-90deg) translateZ(64px)",
  },
  {
    Icon: Globe2,
    transform: "rotateY(90deg) translateZ(64px)",
  },
  {
    Icon: Sparkles,
    transform: "rotateX(90deg) translateZ(64px)",
  },
  {
    Icon: Package,
    transform: "rotateX(-90deg) translateZ(64px)",
  },
];

export default function FaqHero({ onAsk }: FaqHeroProps) {
  const { t } = useLanguage();
  const c = t.faq.hero;
  const reducedMotion = useReducedMotion();

  const cardRef = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(pointerX, {
    stiffness: 100,
    damping: 22,
  });

  const rotateY = useSpring(pointerY, {
    stiffness: 100,
    damping: 22,
  });

  function handlePointerMove(
    event: PointerEvent<HTMLDivElement>,
  ) {
    if (
      reducedMotion ||
      event.pointerType === "touch" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - bounds.left) / bounds.width - 0.5;

    const y =
      (event.clientY - bounds.top) / bounds.height - 0.5;

    pointerX.set(-y * 12);
    pointerY.set(x * 16);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section className="relative isolate overflow-hidden bg-background px-4 pb-16 pt-16 text-foreground sm:px-6 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 -z-10 size-[600px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl border-t border-border pt-7">
        <div className="mb-12 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-accent"
          />

          {c.eyebrow}

          <span
            aria-hidden="true"
            className="ml-auto font-serif italic text-accent"
          >
            FAQ
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Introduction */}
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-surface/70 px-4 py-2 text-xs text-secondary">
              <Sparkles
                className="size-3.5 text-accent"
                aria-hidden="true"
              />

              {c.badge}
            </p>

            <h1 className="max-w-2xl font-serif text-5xl font-normal leading-[1.08] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {c.title}

              <span className="block italic text-accent">
                {c.highlight}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-secondary sm:text-base">
              {c.description}
            </p>

            <Button
              size="lg"
              onClick={onAsk}
              className="mt-8 gap-4"
            >
              <Bot className="size-4" aria-hidden="true" />

              {c.cta}

              <ArrowUpRight
                className="size-4"
                aria-hidden="true"
              />
            </Button>
          </div>

          {/* Perspective around the complete card */}
          <div className="relative mx-auto w-full max-w-md [perspective:1200px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 left-8 right-8 h-14 rounded-[50%] bg-primary/20 blur-2xl"
            />

            <motion.div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={resetPointer}
              onPointerCancel={resetPointer}
              style={{
                rotateX: reducedMotion ? 0 : rotateX,
                rotateY: reducedMotion ? 0 : rotateY,
              }}
              className="relative rounded-t-[150px] rounded-b-[28px] border border-accent/35 bg-primary p-5 text-primary-foreground shadow-[12px_20px_0_-8px_rgba(165,139,101,0.18),0_35px_70px_-25px_rgba(0,0,0,0.5)] sm:rounded-t-[180px] sm:p-7"
            >
              {/* Inset architectural border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-t-[140px] rounded-b-[20px] border border-accent/10 sm:rounded-t-[168px]"
              />

              {/* 3D scene */}
              <div
                aria-hidden="true"
                className="relative flex h-[320px] items-center justify-center [perspective:800px] sm:h-[360px]"
              >
                {/* Ambient light */}
                <div className="pointer-events-none absolute size-56 rounded-full bg-accent/15 blur-3xl" />

                {/* Rear orbit */}
                <div className="pointer-events-none absolute size-[250px] rounded-full border border-accent/25 [transform:rotateX(65deg)_rotateZ(-25deg)] sm:size-[290px]" />

                {/* Upright orbit */}
                <div className="pointer-events-none absolute size-[250px] rounded-full border border-accent/15 [transform:rotateY(65deg)_rotateZ(25deg)] sm:size-[290px]" />

                {/* Floating assembly */}
                <motion.div
                  animate={
                    reducedMotion
                      ? { y: 0 }
                      : { y: [-8, 8, -8] }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 -mt-7 size-32 [transform-style:preserve-3d]"
                >
                  {/* All six faces form an actual CSS 3D cube */}
                  <motion.div
                    animate={{
                      rotateX: -20,
                      rotateY: reducedMotion
                        ? -30
                        : [-30, 330],
                      rotateZ: -7,
                    }}
                    transition={{
                      rotateY: {
                        duration: 24,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="relative size-32 [transform-style:preserve-3d]"
                  >
                    {cubeFaces.map(({ Icon, transform }, index) => (
                      <div
                        key={index}
                        style={{ transform }}
                        className="absolute inset-0 flex items-center justify-center rounded-xl border border-accent/70 bg-[#24221e] shadow-[inset_0_0_28px_rgba(165,139,101,0.14)] [backface-visibility:hidden]"
                      >
                        {/* Metallic lighting */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/35 via-transparent to-black/30" />

                        {/* Inset face detail */}
                        <div className="absolute inset-3 rounded-lg border border-accent/25" />

                        <Icon
                          className="relative size-12 text-accent"
                          strokeWidth={1.1}
                        />

                        {/* Corner studs */}
                        <span className="absolute left-2 top-2 size-1 rounded-full bg-accent/70" />
                        <span className="absolute right-2 bottom-2 size-1 rounded-full bg-accent/70" />
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Floor shadow */}
                <motion.div
                  animate={
                    reducedMotion
                      ? { scale: 1, opacity: 0.5 }
                      : {
                          scale: [0.85, 1.1, 0.85],
                          opacity: [0.35, 0.65, 0.35],
                        }
                  }
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-12 h-8 w-36 rounded-[50%] bg-black/80 blur-lg"
                />

                {/* Pedestal thickness */}
                <div className="absolute bottom-7 h-9 w-52 rounded-[50%] border border-accent/20 bg-[#161512]" />

                {/* Pedestal top */}
                <div className="absolute bottom-10 h-12 w-52 rounded-[50%] border border-accent/50 bg-gradient-to-b from-accent/20 to-primary shadow-[0_0_25px_rgba(165,139,101,0.1)]">
                  <div className="absolute inset-2 rounded-[50%] border border-accent/20" />
                </div>
              </div>

              {/* Existing translated content */}
              <div className="relative border-t border-primary-foreground/15 pb-2 pt-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  {c.visualEyebrow}
                </p>

                <p className="mt-3 font-serif text-2xl leading-snug">
                  {c.visualTitle}
                </p>

                <p className="mt-3 text-xs leading-6 text-primary-foreground/60">
                  {c.visualDescription}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}