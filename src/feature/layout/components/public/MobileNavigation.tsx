
// "use client";

// import { useState, type PointerEvent } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ArrowUpRight, Layers3, Menu } from "lucide-react";

// import { Button, buttonVariants } from "@/src/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/src/components/ui/sheet";

// import { publicNavigation } from "@/src/feature/config/public-navigation";

// function tiltCard(event: PointerEvent<HTMLAnchorElement>) {
//   if (
//     event.pointerType !== "mouse" ||
//     window.matchMedia("(prefers-reduced-motion: reduce)").matches
//   ) {
//     return;
//   }

//   const card = event.currentTarget;
//   const bounds = card.getBoundingClientRect();

//   const x = (event.clientX - bounds.left) / bounds.width;
//   const y = (event.clientY - bounds.top) / bounds.height;

//   card.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
//   card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
//   card.style.setProperty("--light-x", `${x * 100}%`);
//   card.style.setProperty("--light-y", `${y * 100}%`);
// }

// function resetCard(event: PointerEvent<HTMLAnchorElement>) {
//   const card = event.currentTarget;

//   card.style.setProperty("--rx", "0deg");
//   card.style.setProperty("--ry", "0deg");
//   card.style.setProperty("--light-x", "50%");
//   card.style.setProperty("--light-y", "0%");
// }

// export function MobileNavigation() {
//   const pathname = usePathname();
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="lg:hidden">
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetTrigger
//           render={
//             <Button variant="ghost" size="icon" aria-label="Open navigation">
//               <Menu className="size-5" />
//             </Button>
//           }
//         />

//         <SheetContent
//           side="right"
//           aria-describedby={undefined}
//           className="
//             isolate w-[min(94vw,410px)] max-w-none gap-0
//             overflow-y-auto overscroll-contain
//             border-l border-accent/30 bg-background p-0
//             shadow-[-28px_0_100px_-20px_rgba(0,0,0,0.5)]
//           "
//         >
//           {/* Ambient lighting */}
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
//           >
//             <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-accent/10" />

//             <div className="absolute -right-32 top-64 size-80 rounded-full bg-accent/15 blur-3xl" />

//             <div className="absolute bottom-0 left-0 h-80 w-px bg-gradient-to-t from-transparent via-accent/50 to-transparent" />
//           </div>

//           <SheetHeader className="relative shrink-0 px-5 pb-7 pt-11">
//             {/* Sculptural display */}
//             <div
//               aria-hidden="true"
//               className="
//                 relative isolate mx-auto mb-7 flex h-44 w-full
//                 items-center justify-center
//                 [perspective:850px]
//               "
//             >
//               {/* Recessed architectural background */}
//               <div
//                 className="
//                   absolute inset-x-5 inset-y-0
//                   rounded-t-[100px] rounded-b-[28px]
//                   border border-white/70
//                   bg-gradient-to-br from-[#e6dfcf] via-[#f7f4ec] to-[#d8cbb1]
//                   shadow-[inset_0_3px_12px_rgba(87,65,31,0.12),0_1px_0_white]
//                 "
//               />

//               <div className="absolute top-5 h-24 w-28 rounded-full bg-white/70 blur-2xl" />

//               {/* Orbital rings */}
//               <div className="absolute top-2 h-32 w-44 [transform:rotateX(62deg)_rotateZ(-24deg)] [transform-style:preserve-3d]">
//                 <div
//                   className="
//                     absolute inset-0 rounded-full border-[1.5px]
//                     border-[#ae8b50]/60
//                     shadow-[0_1px_0_rgba(255,255,255,0.9)]
//                     motion-safe:animate-spin
//                     [animation-duration:18s]
//                   "
//                 >
//                   <span
//                     className="
//                       absolute -top-1 left-1/2 size-3 rounded-full
//                       bg-gradient-to-br from-white via-[#dac08b] to-[#806235]
//                       shadow-[0_2px_5px_rgba(0,0,0,0.25)]
//                     "
//                   />
//                 </div>
//               </div>

//               <div className="absolute top-2 h-32 w-40 [transform:rotateY(62deg)_rotateZ(24deg)]">
//                 <div
//                   className="
//                     absolute inset-0 rounded-full border border-accent/35
//                     motion-safe:animate-spin
//                     [animation-direction:reverse]
//                     [animation-duration:24s]
//                   "
//                 >
//                   <span className="absolute bottom-0 left-1/2 size-2 rounded-full bg-[#b29663] shadow-sm" />
//                 </div>
//               </div>

//               {/* Shadow beneath the sculpture */}
//               <div className="absolute bottom-10 h-4 w-24 rounded-[50%] bg-black/25 blur-lg" />

//               {/* Extruded gold object */}
//               <div className="relative -mt-5 size-20 [transform:rotateX(12deg)_rotateY(-24deg)_rotateZ(-9deg)] [transform-style:preserve-3d]">
//                 <div
//                   className="
//                     absolute inset-0 rounded-[24px]
//                     bg-gradient-to-br from-[#b39259] to-[#66502c]
//                     [transform:translate3d(8px,9px,-10px)]
//                   "
//                 />

//                 <div
//                   className="
//                     absolute inset-0 rounded-[24px]
//                     bg-gradient-to-br from-[#d3b77f] to-[#8b6b37]
//                     [transform:translate3d(4px,5px,-5px)]
//                   "
//                 />

//                 <div
//                   className="
//                     absolute inset-0 flex items-center justify-center
//                     overflow-hidden rounded-[24px]
//                     border border-[#fff3cf]/80
//                     bg-gradient-to-br from-[#fff3cf] via-[#cfb27b] to-[#98743d]
//                     shadow-[inset_2px_2px_3px_rgba(255,255,255,0.8),inset_-3px_-3px_6px_rgba(83,56,18,0.25),0_16px_22px_-12px_rgba(0,0,0,0.5)]
//                   "
//                 >
//                   <div className="absolute inset-2 rounded-[18px] border border-white/35" />

//                   <div className="absolute -left-5 -top-8 h-28 w-10 rotate-45 bg-white/35 blur-sm" />

//                   <Layers3
//                     className="relative size-8 text-[#594321]"
//                     strokeWidth={1.15}
//                   />
//                 </div>
//               </div>

//               {/* Metallic display pedestal */}
//               <div
//                 className="
//                   absolute bottom-5 h-7 w-36 rounded-[50%]
//                   bg-gradient-to-r from-[#5a482d] via-[#dfc99d] to-[#665132]
//                   shadow-[0_10px_14px_-6px_rgba(0,0,0,0.35)]
//                 "
//               />

//               <div
//                 className="
//                   absolute bottom-7 h-7 w-36 rounded-[50%]
//                   border border-[#e7d4aa]
//                   bg-gradient-to-br from-[#484137] via-[#292723] to-[#171717]
//                   shadow-[inset_0_2px_3px_rgba(255,255,255,0.1)]
//                 "
//               />
//             </div>

//             <SheetTitle className="text-center text-xl font-semibold tracking-[0.18em] text-foreground">
//               BAGGUAGE
//               <span className="ml-1 text-accent">•</span>
//             </SheetTitle>

//             <div
//               aria-hidden="true"
//               className="mx-auto mt-3 flex items-center gap-2"
//             >
//               <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/50" />
//               <span className="size-1 rotate-45 bg-accent" />
//               <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/50" />
//             </div>
//           </SheetHeader>

//           <nav
//             aria-label="Mobile navigation"
//             className="relative flex flex-col gap-4 px-6 pb-8"
//           >
//             {publicNavigation.map((item, index) => {
//               const isActive =
//                 pathname === item.href ||
//                 (item.href !== "/" &&
//                   pathname.startsWith(`${item.href}/`));

//               return (
//                 <div
//                   key={item.href}
//                   className="relative [perspective:900px]"
//                 >
//                   {/* Visible card thickness */}
//                   <div
//                     aria-hidden="true"
//                     className={`
//                       pointer-events-none absolute inset-0
//                       translate-x-1 translate-y-1.5 rounded-2xl border
//                       ${
//                         isActive
//                           ? "border-[#8c7145] bg-gradient-to-r from-[#907447] to-[#c4aa79]"
//                           : "border-[#d5c9b0] bg-gradient-to-r from-[#d7cbb4] to-[#e7dfce]"
//                       }
//                     `}
//                   />

//                   <Link
//                     href={item.href}
//                     aria-current={isActive ? "page" : undefined}
//                     onClick={() => setOpen(false)}
//                     onPointerMove={tiltCard}
//                     onPointerLeave={resetCard}
//                     onPointerCancel={resetCard}
//                     className={`
//                       group relative isolate flex min-h-[68px]
//                       items-center gap-4 rounded-2xl border px-4 py-4
//                       [transform-style:preserve-3d]
//                       transition-[transform,box-shadow] duration-200
//                       motion-safe:[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]
//                       focus-visible:outline-none
//                       focus-visible:ring-2 focus-visible:ring-accent
//                       focus-visible:ring-offset-4
//                       focus-visible:ring-offset-background
//                       ${
//                         isActive
//                           ? `
//                             border-[#514936] bg-gradient-to-br
//                             from-[#37332b] via-[#22211e] to-[#171717]
//                             text-background
//                             shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]
//                           `
//                           : `
//                             border-white/90 bg-gradient-to-br
//                             from-white via-[#fcfaf5] to-[#eee8db]
//                             text-foreground
//                             shadow-[0_12px_24px_-16px_rgba(74,55,24,0.45),inset_0_1px_0_white]
//                           `
//                       }
//                     `}
//                   >
//                     {/* Mouse-following light */}
//                     <span
//                       aria-hidden="true"
//                       className="
//                         pointer-events-none absolute inset-0
//                         rounded-[inherit] opacity-0
//                         transition-opacity duration-300
//                         [background:radial-gradient(circle_at_var(--light-x,50%)_var(--light-y,0%),rgba(255,255,255,0.2),transparent_65%)]
//                         group-hover:opacity-100
//                       "
//                     />

//                     <span
//                       aria-hidden="true"
//                       className={`
//                         relative flex size-9 shrink-0
//                         items-center justify-center rounded-xl
//                         border text-[10px] font-medium tabular-nums
//                         [transform:translateZ(14px)]
//                         ${
//                           isActive
//                             ? `
//                               border-[#e2c994]/40
//                               bg-gradient-to-br from-[#e2c994] to-[#9b7b45]
//                               text-[#392d1b]
//                               shadow-[2px_3px_0_#70582f,inset_0_1px_0_rgba(255,255,255,0.6)]
//                             `
//                             : `
//                               border-white
//                               bg-gradient-to-br from-[#faf6eb] to-[#e0d3b9]
//                               text-[#8f7447]
//                               shadow-[2px_3px_0_#d4c5a8,inset_0_1px_0_white]
//                             `
//                         }
//                       `}
//                     >
//                       {String(index + 1).padStart(2, "0")}
//                     </span>

//                     <span className="relative flex-1 text-sm font-medium tracking-wide [transform:translateZ(20px)]">
//                       {item.label}
//                     </span>

//                     <span
//                       aria-hidden="true"
//                       className={`
//                         relative flex size-8 shrink-0
//                         items-center justify-center rounded-full border
//                         [transform:translateZ(16px)]
//                         ${
//                           isActive
//                             ? "border-accent/35 bg-white/5 text-[#dec89c]"
//                             : "border-accent/20 bg-white/70 text-accent"
//                         }
//                       `}
//                     >
//                       <ArrowUpRight
//                         className="
//                           size-3.5 transition-transform duration-300
//                           motion-safe:group-hover:-translate-y-0.5
//                           motion-safe:group-hover:translate-x-0.5
//                         "
//                         strokeWidth={1.5}
//                       />
//                     </span>
//                   </Link>
//                 </div>
//               );
//             })}
//           </nav>

//           <div className="mt-auto shrink-0 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-2">
//             <div
//               aria-hidden="true"
//               className="mb-6 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
//             />

//             <Link
//               href="/contact"
//               onClick={() => setOpen(false)}
//               className={buttonVariants({
//                 className:
//                   "min-h-12 w-full justify-between px-5",
//               })}
//             >
//               Request a Quote
//               <ArrowUpRight aria-hidden="true" className="size-4" />
//             </Link>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

 


// import Link from "next/link";
// import { Menu } from "lucide-react";

// import { Button } from "@/src/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/src/components/ui/sheet";

// import { buttonVariants } from "@/src/components/ui/button";
// import { publicNavigation } from "@/src/feature/config/public-navigation";

// export function MobileNavigation() {
//   return (
//     <div className="lg:hidden">
//       <Sheet>
//         <SheetTrigger
//           render={
//             <Button variant="ghost" size="icon" aria-label="Open navigation">
//               <Menu className="size-5" />
//             </Button>
//           }
//         />

//         <SheetContent side="right" className="w-[300px] sm:w-[360px]">
//           <SheetHeader>
//             <SheetTitle className="text-left">BAGGUAGE</SheetTitle>
//           </SheetHeader>

//           <nav
//             aria-label="Mobile navigation"
//             className="mt-8 flex flex-col gap-1"
//           >
//             {publicNavigation.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           <div className="mt-6">
//             <Link
//               href="/contact"
//               className={buttonVariants({ className: "w-full" })}
//             >
//               Request a Quote
//             </Link>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }


"use client";

import { useState, type PointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Layers3, Menu } from "lucide-react";

import { Button, buttonVariants } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

import { publicNavigation } from "@/src/feature/config/public-navigation";
import { useLanguage } from "@/src/providers";

function tiltCard(event: PointerEvent<HTMLAnchorElement>) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();

  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;

  card.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
  card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
  card.style.setProperty("--light-x", `${x * 100}%`);
  card.style.setProperty("--light-y", `${y * 100}%`);
}

function resetCard(event: PointerEvent<HTMLAnchorElement>) {
  const card = event.currentTarget;

  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
  card.style.setProperty("--light-x", "50%");
  card.style.setProperty("--light-y", "0%");
}

export function MobileNavigation() {
  const { t } = useLanguage();
  const c = t.mobileNavigation;

  const navigationLabels: Record<string, string> = {
    "/": c.links.home,
    "/product": c.links.products,
    "/products": c.links.products,
    "/manufacturing": c.links.manufacturing,
    "/services": c.links.services,
    "/about-us": c.links.aboutUs,
    "/contact": c.links.contact,
    "/contact-us": c.links.contact,
  };

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label={c.openNavigation}>
              <Menu className="size-5" />
            </Button>
          }
        />

        <SheetContent
          side="right"
          aria-describedby={undefined}
          className="
            isolate w-[min(94vw,410px)] max-w-none gap-0
            overflow-y-auto overscroll-contain
            border-l border-accent/30 bg-background p-0
            shadow-[-28px_0_100px_-20px_rgba(0,0,0,0.5)]
          "
        >
          {/* Ambient lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-accent/10" />

            <div className="absolute -right-32 top-64 size-80 rounded-full bg-accent/15 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-80 w-px bg-gradient-to-t from-transparent via-accent/50 to-transparent" />
          </div>

          <SheetHeader className="relative shrink-0 px-5 pb-7 pt-11">
            {/* Sculptural display */}
            <div
              aria-hidden="true"
              className="
                relative isolate mx-auto mb-7 flex h-44 w-full
                items-center justify-center
                [perspective:850px]
              "
            >
              {/* Recessed architectural background */}
              <div
                className="
                  absolute inset-x-5 inset-y-0
                  rounded-t-[100px] rounded-b-[28px]
                  border border-white/70
                  bg-gradient-to-br from-[#e6dfcf] via-[#f7f4ec] to-[#d8cbb1]
                  shadow-[inset_0_3px_12px_rgba(87,65,31,0.12),0_1px_0_white]
                "
              />

              <div className="absolute top-5 h-24 w-28 rounded-full bg-white/70 blur-2xl" />

              {/* Orbital rings */}
              <div className="absolute top-2 h-32 w-44 [transform:rotateX(62deg)_rotateZ(-24deg)] [transform-style:preserve-3d]">
                <div
                  className="
                    absolute inset-0 rounded-full border-[1.5px]
                    border-[#ae8b50]/60
                    shadow-[0_1px_0_rgba(255,255,255,0.9)]
                    motion-safe:animate-spin
                    [animation-duration:18s]
                  "
                >
                  <span
                    className="
                      absolute -top-1 left-1/2 size-3 rounded-full
                      bg-gradient-to-br from-white via-[#dac08b] to-[#806235]
                      shadow-[0_2px_5px_rgba(0,0,0,0.25)]
                    "
                  />
                </div>
              </div>

              <div className="absolute top-2 h-32 w-40 [transform:rotateY(62deg)_rotateZ(24deg)]">
                <div
                  className="
                    absolute inset-0 rounded-full border border-accent/35
                    motion-safe:animate-spin
                    [animation-direction:reverse]
                    [animation-duration:24s]
                  "
                >
                  <span className="absolute bottom-0 left-1/2 size-2 rounded-full bg-[#b29663] shadow-sm" />
                </div>
              </div>

              {/* Shadow beneath the sculpture */}
              <div className="absolute bottom-10 h-4 w-24 rounded-[50%] bg-black/25 blur-lg" />

              {/* Extruded gold object */}
              <div className="relative -mt-5 size-20 [transform:rotateX(12deg)_rotateY(-24deg)_rotateZ(-9deg)] [transform-style:preserve-3d]">
                <div
                  className="
                    absolute inset-0 rounded-[24px]
                    bg-gradient-to-br from-[#b39259] to-[#66502c]
                    [transform:translate3d(8px,9px,-10px)]
                  "
                />

                <div
                  className="
                    absolute inset-0 rounded-[24px]
                    bg-gradient-to-br from-[#d3b77f] to-[#8b6b37]
                    [transform:translate3d(4px,5px,-5px)]
                  "
                />

                <div
                  className="
                    absolute inset-0 flex items-center justify-center
                    overflow-hidden rounded-[24px]
                    border border-[#fff3cf]/80
                    bg-gradient-to-br from-[#fff3cf] via-[#cfb27b] to-[#98743d]
                    shadow-[inset_2px_2px_3px_rgba(255,255,255,0.8),inset_-3px_-3px_6px_rgba(83,56,18,0.25),0_16px_22px_-12px_rgba(0,0,0,0.5)]
                  "
                >
                  <div className="absolute inset-2 rounded-[18px] border border-white/35" />

                  <div className="absolute -left-5 -top-8 h-28 w-10 rotate-45 bg-white/35 blur-sm" />

                  <Layers3
                    className="relative size-8 text-[#594321]"
                    strokeWidth={1.15}
                  />
                </div>
              </div>

              {/* Metallic display pedestal */}
              <div
                className="
                  absolute bottom-5 h-7 w-36 rounded-[50%]
                  bg-gradient-to-r from-[#5a482d] via-[#dfc99d] to-[#665132]
                  shadow-[0_10px_14px_-6px_rgba(0,0,0,0.35)]
                "
              />

              <div
                className="
                  absolute bottom-7 h-7 w-36 rounded-[50%]
                  border border-[#e7d4aa]
                  bg-gradient-to-br from-[#484137] via-[#292723] to-[#171717]
                  shadow-[inset_0_2px_3px_rgba(255,255,255,0.1)]
                "
              />
            </div>

            <SheetTitle className="text-center text-xl font-semibold tracking-[0.18em] text-foreground">
              BAGGUAGE
              <span className="ml-1 text-accent">•</span>
            </SheetTitle>

            <div
              aria-hidden="true"
              className="mx-auto mt-3 flex items-center gap-2"
            >
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent/50" />
              <span className="size-1 rotate-45 bg-accent" />
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-accent/50" />
            </div>
          </SheetHeader>

          <nav
            aria-label={c.navigationLabel}
            className="relative flex flex-col gap-4 px-6 pb-8"
          >
            {publicNavigation.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <div
                  key={item.href}
                  className="relative [perspective:900px]"
                >
                  {/* Visible card thickness */}
                  <div
                    aria-hidden="true"
                    className={`
                      pointer-events-none absolute inset-0
                      translate-x-1 translate-y-1.5 rounded-2xl border
                      ${
                        isActive
                          ? "border-[#8c7145] bg-gradient-to-r from-[#907447] to-[#c4aa79]"
                          : "border-[#d5c9b0] bg-gradient-to-r from-[#d7cbb4] to-[#e7dfce]"
                      }
                    `}
                  />

                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    onPointerMove={tiltCard}
                    onPointerLeave={resetCard}
                    onPointerCancel={resetCard}
                    className={`
                      group relative isolate flex min-h-[68px]
                      items-center gap-4 rounded-2xl border px-4 py-4
                      [transform-style:preserve-3d]
                      transition-[transform,box-shadow] duration-200
                      motion-safe:[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-accent
                      focus-visible:ring-offset-4
                      focus-visible:ring-offset-background
                      ${
                        isActive
                          ? `
                            border-[#514936] bg-gradient-to-br
                            from-[#37332b] via-[#22211e] to-[#171717]
                            text-background
                            shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]
                          `
                          : `
                            border-white/90 bg-gradient-to-br
                            from-white via-[#fcfaf5] to-[#eee8db]
                            text-foreground
                            shadow-[0_12px_24px_-16px_rgba(74,55,24,0.45),inset_0_1px_0_white]
                          `
                      }
                    `}
                  >
                    {/* Mouse-following light */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none absolute inset-0
                        rounded-[inherit] opacity-0
                        transition-opacity duration-300
                        [background:radial-gradient(circle_at_var(--light-x,50%)_var(--light-y,0%),rgba(255,255,255,0.2),transparent_65%)]
                        group-hover:opacity-100
                      "
                    />

                    <span
                      aria-hidden="true"
                      className={`
                        relative flex size-9 shrink-0
                        items-center justify-center rounded-xl
                        border text-[10px] font-medium tabular-nums
                        [transform:translateZ(14px)]
                        ${
                          isActive
                            ? `
                              border-[#e2c994]/40
                              bg-gradient-to-br from-[#e2c994] to-[#9b7b45]
                              text-[#392d1b]
                              shadow-[2px_3px_0_#70582f,inset_0_1px_0_rgba(255,255,255,0.6)]
                            `
                            : `
                              border-white
                              bg-gradient-to-br from-[#faf6eb] to-[#e0d3b9]
                              text-[#8f7447]
                              shadow-[2px_3px_0_#d4c5a8,inset_0_1px_0_white]
                            `
                        }
                      `}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="relative flex-1 text-sm font-medium tracking-wide [transform:translateZ(20px)]">
                      {navigationLabels[item.href] ?? item.label}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`
                        relative flex size-8 shrink-0
                        items-center justify-center rounded-full border
                        [transform:translateZ(16px)]
                        ${
                          isActive
                            ? "border-accent/35 bg-white/5 text-[#dec89c]"
                            : "border-accent/20 bg-white/70 text-accent"
                        }
                      `}
                    >
                      <ArrowUpRight
                        className="
                          size-3.5 transition-transform duration-300
                          motion-safe:group-hover:-translate-y-0.5
                          motion-safe:group-hover:translate-x-0.5
                        "
                        strokeWidth={1.5}
                      />
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto shrink-0 px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-2">
            <div
              aria-hidden="true"
              className="mb-6 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
            />

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={buttonVariants({
                className:
                  "min-h-12 w-full justify-between px-5",
              })}
            >
              {c.requestQuote}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

 