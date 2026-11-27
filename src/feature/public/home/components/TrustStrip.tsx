"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  ArrowUpRight,
  Factory,
  SlidersHorizontal,
  ShieldCheck,
  Handshake,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export interface TrustDisplayImage {
  /** Stable ID; entries follow the order of the four translated trust items. */
  id: string;
  src: string;
  href: string;
}

export interface TrustStripProps {
  /** Supply backend image records here later. Empty/missing entries use local images. */
  images?: readonly TrustDisplayImage[];
}

export const defaultTrustImages: readonly TrustDisplayImage[] = [
  { id: "manufacturing", src: "/2.png", href: "/manufacturing" },
  { id: "customization", src: "/3.png", href: "/oem-odm" },
  { id: "quality", src: "/4.png", href: "/manufacturing" },
  { id: "partnership", src: "/bag-closed-pink.png", href: "/quote" },
];

const icons = [Factory, SlidersHorizontal, ShieldCheck, Handshake];
export default function TrustStrip({
  images = defaultTrustImages,
}: TrustStripProps) {
  const { t } = useLanguage();
  const copy = t.trust;
  const router = useRouter();
  const id = useId();
  const [active, setActive] = useState(0);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  function moveLight(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--light-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--bag-x", `${(x - 0.5) * 15}px`);
    event.currentTarget.style.setProperty("--bag-y", `${(y - 0.5) * 9}px`);
    event.currentTarget.style.setProperty(
      "--bag-rotate",
      `${(x - 0.5) * 7}deg`,
    );
  }

  function resetLight(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--light-x", "50%");
    event.currentTarget.style.setProperty("--bag-x", "0px");
    event.currentTarget.style.setProperty("--bag-y", "0px");
    event.currentTarget.style.setProperty("--bag-rotate", "0deg");
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % copy.items.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + copy.items.length) % copy.items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = copy.items.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      setActive(next);
      triggers.current[next]?.focus({ preventScroll: true });
    }
  }

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="relative isolate overflow-hidden bg-background px-5 pb-20 pt-12 text-[#281c17] sm:px-8 lg:px-10 lg:pb-[120px] lg:pt-10"
    >
      {/* Separate artwork preserves the reference wall, leaf shadows and stone shelf. */}
      <Image
        src="/background.webp"
        alt=""
        fill
        sizes="100vw"
        unoptimized
        className="pointer-events-none -z-10 object-cover object-top lg:object-fill"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#f6ecdc]/15 lg:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-12 bg-gradient-to-b from-background to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-12 bg-gradient-to-t from-surface-muted to-transparent"
      />

      <div className="mx-auto max-w-[1440px]">
        <header className="relative mx-auto mb-8 max-w-6xl text-center lg:mb-0 lg:ml-[20%] lg:max-w-none">
          <p className="flex items-center justify-center gap-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#6a3730] sm:text-sm">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-[#885d48]/70 sm:w-16"
            />
            {copy.eyebrow}
            <span
              aria-hidden="true"
              className="h-px w-10 bg-[#885d48]/70 sm:w-16"
            />
          </p>
          <h2
            id={`${id}-heading`}
            className="mx-auto mt-5 max-w-6xl text-balance font-serif text-4xl font-normal leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[46px] xl:text-[52px]"
          >
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-[#695346] sm:text-lg">
            {copy.description}
          </p>
        </header>

        <div className="relative">
          <div
            role="group"
            aria-label={copy.eyebrow}
            className="relative z-10 grid items-end gap-5 sm:grid-cols-2 lg:flex lg:min-h-[640px] lg:gap-3 xl:gap-4"
          >
            {copy.items.map((item, index) => {
              const selected = active === index;
              const fallback =
                defaultTrustImages[index % defaultTrustImages.length];
              const asset = images[index] ?? fallback;
              const Icon = icons[index % icons.length];
              return (
                <article
                  key={asset.id}
                  data-trust-panel={index}
                  data-active={selected}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActive(index);
                  }}
                  onPointerMove={moveLight}
                  onPointerLeave={resetLight}
                  onFocusCapture={() => setActive(index)}
                  style={
                    {
                      "--light-x": "50%",
                      "--bag-x": "0px",
                      "--bag-y": "0px",
                      "--bag-rotate": "0deg",
                    } as CSSProperties
                  }
                  className={
                    "group relative isolate min-w-0 transition-[height,flex-grow,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:basis-0 " +
                    (selected
                      ? "h-[610px] drop-shadow-[7px_14px_13px_#54231740] lg:h-[680px] lg:grow-[1.8]"
                      : "h-[525px] drop-shadow-[4px_8px_8px_#5c3c2535] lg:h-[565px] lg:grow")
                  }
                >
                  <div className="relative h-full">
                    <Image
                      src="/alcove-ivory.webp"
                      alt=""
                      fill
                      sizes="(min-width:1024px) 450px, 90vw"
                      unoptimized
                      className="pointer-events-none object-fill"
                    />
                    <Image
                      src="/alcove-burgundy.webp"
                      alt=""
                      fill
                      sizes="(min-width:1024px) 550px, 90vw"
                      unoptimized
                      className={
                        "pointer-events-none object-fill transition-opacity duration-700 motion-reduce:transition-none " +
                        (selected ? "opacity-100" : "opacity-0")
                      }
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-[8%] top-[10%] bottom-[15%] rounded-t-[65px] bg-[radial-gradient(ellipse_at_var(--light-x)_0%,#ffe5b31a,transparent_70%)]"
                    />
                    <div
                      className={
                        "relative z-20 px-[15%] pt-[20%] transition-colors duration-700 motion-reduce:transition-none lg:px-[18%] lg:pt-[25%] " +
                        (selected ? "text-[#fff0d6]" : "text-[#39271e]")
                      }
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.2}
                        className={
                          "mb-3 size-8 transition-colors duration-700 motion-reduce:transition-none " +
                          (selected ? "hidden" : "text-[#85643c]")
                        }
                      />
                      <h3>
                        <Button
                          ref={(node) => {
                            triggers.current[index] = node;
                          }}
                          variant="ghost"
                          aria-expanded={selected}
                          aria-controls={`${id}-description-${index}`}
                          onClick={() => setActive(index)}
                          onKeyDown={(event) => navigate(event, index)}
                          className={
                            "h-auto w-full max-w-[300px] justify-start whitespace-normal rounded-lg p-0 text-left font-serif font-normal tracking-[-0.025em] text-inherit hover:bg-transparent hover:text-inherit focus-visible:ring-[#ceaa69] " +
                            (selected
                              ? "text-[35px] lg:text-[38px] xl:text-[46px]"
                              : "text-[29px] lg:text-[26px] xl:text-[31px]") +
                            " leading-[1.06]"
                          }
                        >
                          {item.title}
                        </Button>
                      </h3>
                      <span
                        aria-hidden="true"
                        className={
                          "mt-5 block h-px transition-[width,background-color] duration-700 motion-reduce:transition-none " +
                          (selected ? "w-16 bg-[#edcb90]" : "w-10 bg-[#9b7951]")
                        }
                      />
                      <div
                        id={`${id}-description-${index}`}
                        aria-hidden={!selected}
                        className={
                          "grid transition-[grid-template-rows,opacity,margin] duration-500 motion-reduce:transition-none " +
                          (selected
                            ? "mt-4 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0")
                        }
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p className="max-w-[330px] text-base leading-7 text-[#f5e1ca]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bag photos stay independent of the decorative alcoves. */}
                    <div
                      aria-hidden="true"
                      className={
                        "pointer-events-none absolute inset-x-[8%] transition-[height,bottom] duration-700 motion-reduce:transition-none " +
                        (selected
                          ? "bottom-[19%] h-[34%]"
                          : "bottom-[15%] h-[36%]")
                      }
                    >
                      <div
                        className={
                          "absolute inset-0 bottom-8 transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none " +
                          (selected
                            ? "translate-y-0 -rotate-6 scale-[1.04]"
                            : "translate-y-1 scale-95")
                        }
                      >
                        <div
                          style={{
                            transform:
                              "translate3d(var(--bag-x),var(--bag-y),0) rotate(var(--bag-rotate))",
                          }}
                          className="relative h-full w-full transition-transform duration-150 ease-out motion-reduce:transform-none motion-reduce:transition-none"
                        >
                          <Image
                            key={asset.src}
                            src={asset.src || fallback.src}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 460px, (min-width: 640px) 45vw, 90vw"
                            unoptimized
                            onError={(event) => {
                              if (
                                event.currentTarget.getAttribute("src") !==
                                fallback.src
                              )
                                event.currentTarget.src = fallback.src;
                            }}
                            className="object-contain drop-shadow-[0_20px_14px_#160a0b66]"
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "absolute inset-x-[1%] bottom-5 h-[145px] -rotate-[22deg] rounded-[50%] border border-[#f0d49b]/75 transition-opacity duration-700 motion-reduce:transition-none " +
                          (selected ? "opacity-90" : "opacity-0")
                        }
                      />
                    </div>

                    <div
                      className={
                        "absolute bottom-[5.5%] left-[15%] right-[10%] z-30 transition-[opacity,transform] duration-500 motion-reduce:transition-none " +
                        (selected
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0")
                      }
                      inert={!selected}
                    >
                      <Button
                        variant="ghost"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => router.push(asset.href || fallback.href)}
                        aria-label={`${t.featuredProducts.explore}: ${item.title}`}
                        className="group/explore relative h-[54px] max-w-full gap-5 overflow-hidden rounded-full border border-[#ffe2a7] bg-[linear-gradient(180deg,#bd965c,#fff0c3_12%,#b18446_23%,#e5c389_80%,#8f632e)] p-[4px] pl-6 font-serif text-lg font-normal text-[#fff0d3] shadow-[0_3px_0_#6e411f,0_7px_12px_#18070866,inset_0_1px_0_#fff6d9] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:bg-transparent hover:text-[#fff0d3] hover:shadow-[0_4px_0_#6e411f,0_9px_18px_#14060770,0_0_15px_#efcb8a40] active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-[4px] rounded-full border border-[#f2cd91]/60 bg-[linear-gradient(180deg,#6b2027,#3d1019)] shadow-[inset_0_2px_6px_#18060b,inset_0_-1px_0_#f4d39d55]"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-1/2 top-0 z-20 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-[left] duration-700 group-hover/explore:left-[120%] motion-reduce:hidden"
                        />
                        <span className="relative z-10 truncate">
                          {t.featuredProducts.explore}
                        </span>
                        <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-[#ffe8b4] bg-[linear-gradient(135deg,#fff1ca,#c3974e)] text-[#482c20] shadow-[0_2px_3px_#210c0870,inset_0_1px_0_#fff8df]">
                          <ArrowUpRight
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className="size-5 transition-transform duration-300 group-hover/explore:-translate-y-0.5 group-hover/explore:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                          />
                        </span>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
