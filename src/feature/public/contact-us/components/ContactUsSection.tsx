

// "use client";

// import { useEffect, useRef, useState, type FormEvent } from "react";
// import Link from "next/link";
// import { motion, useSpring, useReducedMotion } from "motion/react";
// import { useLanguage } from "@/src/providers";
// import { Button, buttonVariants } from "@/src/components/ui/button";
// import { Input } from "@/src/components/ui/input";
// import { cn } from "@/src/lib/utils";
// import { Mail, Phone, MessageCircle, MapPin, Clock3, ArrowUpRight, Check, ArrowDown } from "lucide-react";

// const contact = {
//   whatsapp: "",
//   factoryAddress: "",
//   factoryMapQuery: "",
//   businessHours: "",
//   responseTime: "",
//   socialProfiles: [] as {
//     name: string;
//     url: string;
//   }[],
// };

// type IconKind =
//   | "email"
//   | "phone"
//   | "chat"
//   | "pin"
//   | "clock"
//   | "arrow";

// function Icon({ kind }: { kind: IconKind }) {
//   const icons = { email: Mail, phone: Phone, chat: MessageCircle, pin: MapPin, clock: Clock3, arrow: ArrowUpRight };
//   const Component = icons[kind];
//   return <Component className="size-[22px] shrink-0" strokeWidth={1.3} aria-hidden="true" />;
// }

// function ContactOrbit() {
//   const tiles = useRef<(HTMLDivElement | null)[]>([]);
//   const ring = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const parent = ring.current?.parentElement;
//     if (!parent) return;
//     const media = window.matchMedia("(prefers-reduced-motion: reduce)");
//     let radius = 120;
//     let angle = -Math.PI / 6;
//     let previous = 0;
//     let frame = 0;
//     const inclination = (58 * Math.PI) / 180;

//     function position() {
//       tiles.current.forEach((tile, index) => {
//         if (!tile) return;
//         const phase = angle + index * (Math.PI * 2 / 3);
//         const x = Math.cos(phase) * radius;
//         const y = Math.sin(phase) * radius * Math.cos(inclination);
//         const z = Math.sin(phase) * radius * Math.sin(inclination);
//         tile.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotate(${Math.cos(phase) * 9}deg)`;
//       });
//     }

//     function measure() {
//       radius = Math.min(parent!.clientWidth * 0.44, 155);
//       position();
//     }

//     function animate(time: number) {
//       if (!document.hidden) {
//         if (previous) angle += Math.min(time - previous, 50) / 18000 * Math.PI * 2;
//         previous = time;
//         position();
//       } else previous = 0;
//       frame = requestAnimationFrame(animate);
//     }

//     function updateMotion() {
//       cancelAnimationFrame(frame);
//       previous = 0;
//       position();
//       if (!media.matches) frame = requestAnimationFrame(animate);
//     }

//     const observer = new ResizeObserver(measure);
//     observer.observe(parent);
//     media.addEventListener("change", updateMotion);
//     measure();
//     updateMotion();
//     return () => {
//       cancelAnimationFrame(frame);
//       observer.disconnect();
//       media.removeEventListener("change", updateMotion);
//     };
//   }, []);

//   return (
//     <>
//       <div ref={ring} className="pointer-events-none absolute left-1/2 top-[43%] aspect-square w-[88%] max-w-[310px] rounded-full border border-[#d8ba7d]/50 shadow-[0_0_18px_rgba(210,175,110,0.08)] [transform:translate(-50%,-50%)_rotateX(58deg)]" />
//       {[Mail, Phone, MapPin].map((ContactIcon, index) => (
//         <div
//           key={index}
//           ref={node => { tiles.current[index] = node; }}
//           data-contact-orbit={index}
//           style={{ transform: `translate(-50%, -50%) translate3d(${Math.cos(-Math.PI / 6 + index * Math.PI * 2 / 3) * 120}px, ${Math.sin(-Math.PI / 6 + index * Math.PI * 2 / 3) * 64}px, ${Math.sin(-Math.PI / 6 + index * Math.PI * 2 / 3) * 102}px)` }}
//           className="pointer-events-none absolute left-1/2 top-[43%] flex size-12 items-center justify-center rounded-2xl border border-[#d5bb84]/60 bg-[linear-gradient(135deg,#eee0bd,#b6975f_55%,#806239)] text-[#47351f] shadow-[5px_9px_14px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-2px_-2px_3px_rgba(70,45,15,0.2)] will-change-transform"
//         >
//           <ContactIcon className="size-5" strokeWidth={1.4} aria-hidden="true" />
//         </div>
//       ))}
//     </>
//   );
// }


// export default function ContactUsSection() {
//   const { t, locale } = useLanguage();

//   const data = t.contactUs;
//   const business = t.finalCta.contactInfo;

//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [draftPrepared, setDraftPrepared] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const reduceMotion = useReducedMotion();
//   const artRotateX = useSpring(10, { stiffness: 110, damping: 22 });
//   const artRotateY = useSpring(-14, { stiffness: 110, damping: 22 });

//   const phoneHref = business.phonePrimary
//     .replace(/^\+86\s*\(0(\d+)\)/, "+86$1")
//     .replace(/\(0\)/g, "")
//     .replace(/[^+\d]/g, "");

//   const hasFactoryLocation = Boolean(
//     contact.factoryMapQuery || contact.factoryAddress
//   );

//   const mapQuery =
//     contact.factoryMapQuery ||
//     contact.factoryAddress ||
//     business.address;

//   async function copyEmail() {
//     try {
//       await navigator.clipboard.writeText(business.email);
//       setCopied(true);
//     } catch {
//       setCopied(false);
//     }
//   }

//   function prepareEmail(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const fields = new FormData(event.currentTarget);
//     const labels = data.form.emailBodyLabels;

//     const subject =
//       `[${data.form.emailSubjectPrefix}] ` +
//       `${fields.get("subject")} — ` +
//       `${fields.get("company") || fields.get("name")}`;

//     const body = [
//       `${labels.name}: ${fields.get("name")}`,
//       `${labels.company}: ${fields.get("company") || "—"}`,
//       `${labels.email}: ${fields.get("email")}`,
//       `${labels.telephone}: ${fields.get("phone") || "—"}`,
//       `${labels.country}: ${fields.get("country") || "—"}`,
//       "",
//       String(fields.get("message") || ""),
//     ].join("\n");

//     window.location.href =
//       `mailto:${business.email}` +
//       `?subject=${encodeURIComponent(subject)}` +
//       `&body=${encodeURIComponent(body)}`;

//     setDraftPrepared(true);
//   }

//   return (
//     <div
//       className="bg-background text-primary [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-accent [&_a]:focus-visible:outline-offset-4 motion-reduce:[&_*]:transition-none [&:lang(zh-CN)_h1]:text-[clamp(36px,4.3vw,59px)] [&:lang(zh-CN)_h1]:leading-[1.35] [&:lang(zh-CN)_h1]:tracking-[0.01em] [&:lang(zh-CN)_em]:not-italic [&:lang(zh-CN)_h2]:leading-[1.4] [&:lang(zh-CN)_h3]:leading-[1.5]"
//       lang={locale === "zh" ? "zh-CN" : "en"}
//     >
//       {/* 01. Contact introduction */}
//       <section
//         className="relative overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_90%_50%,#a58b6517,transparent_55%)]"
//         aria-labelledby="contact-heading"
//       >
//         <div className="mx-auto max-w-[1280px] px-7 max-[720px]:px-5">
//           <div className="flex gap-[14px] pt-[30px] text-[10px] text-secondary">
//             <Link href="/">{data.home}</Link>
//             <span>/</span>
//             <span>{data.breadcrumb}</span>
//           </div>

//           <div className="grid grid-cols-[1.45fr_1fr] items-center gap-[60px] pt-[65px] pb-[70px] [&_h1]:my-[26px] [&_p]:mb-7 [&_p]:max-w-[490px] max-[1000px]:gap-[25px] max-[720px]:grid-cols-1 max-[720px]:gap-7 max-[720px]:pt-[42px] max-[720px]:pb-[38px]">
//             <div>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.introduction.eyebrow}
//               </span>

//               <h1 id="contact-heading" className="my-[26px] font-serif text-[clamp(44px,5.5vw,76px)] font-normal leading-[1.06] tracking-[-0.045em] max-[720px]:text-[49px]">
//                 {data.introduction.title}
//                 <br />
//                 <em className="font-normal text-accent">{data.introduction.highlightedTitle}</em>
//               </h1>

//               <p className="text-[13px] leading-[1.9] text-secondary">{data.introduction.description}</p>

//               <a
//                 className={cn(buttonVariants({ variant: "default" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background")}
//                 href="#general-enquiry"
//               >
//                 {data.introduction.button}
//                 <ArrowUpRight className="size-3.5" aria-hidden="true" />
//               </a>
//             </div>

//             <div
//               aria-hidden="true"
//               onPointerMove={(event) => {
//                 if (reduceMotion || event.pointerType !== "mouse") return;
//                 const rect = event.currentTarget.getBoundingClientRect();
//                 artRotateX.set(10 - ((event.clientY - rect.top) / rect.height - 0.5) * 16);
//                 artRotateY.set(-14 + ((event.clientX - rect.left) / rect.width - 0.5) * 24);
//               }}
//               onPointerLeave={() => { artRotateX.set(10); artRotateY.set(-14); }}
//               onPointerCancel={() => { artRotateX.set(10); artRotateY.set(-14); }}
//               className="relative mx-auto w-full max-w-[390px] justify-self-center [perspective:1100px] max-[720px]:max-w-[330px]"
//             >
//               <div className="absolute inset-0 translate-x-3 translate-y-4 rounded-t-[160px] rounded-b-[28px] bg-[#a58b65]/25" />
//               <div className="relative overflow-hidden rounded-t-[160px] rounded-b-[28px] border border-[#b39a70]/35 bg-[#171717] shadow-[0_35px_65px_-25px_rgba(35,25,20,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]">
//                 <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,rgba(185,153,102,0.27),transparent_65%)]" />
//                 <div className="relative aspect-[1/1.05] [perspective:1000px]">
//                   <motion.div
//                     style={{ rotateX: artRotateX, rotateY: artRotateY }}
//                     className="absolute inset-6 [transform-style:preserve-3d]"
//                   >
//                     <div className="absolute left-1/2 top-[43%] size-[260px] rounded-full border border-[#c7aa76]/20 [transform:translate(-50%,-50%)_rotateY(28deg)] max-[380px]:size-[220px]" />
//                     <motion.div
//                       animate={reduceMotion ? { y: 0 } : { y: [-6, 6, -6] }}
//                       transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//                       className="absolute left-1/2 top-[43%] size-[156px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
//                     >
//                       {/* Polished gold communication sphere */}
//                       <div className="absolute inset-0 rounded-full border border-[#eed9a7]/40 bg-[radial-gradient(circle_at_28%_23%,#fff5d8_0%,#e0c68c_17%,#af8950_40%,#6b512e_67%,#242019_91%)] shadow-[inset_5px_5px_14px_rgba(255,245,210,0.25),inset_-12px_-14px_20px_rgba(20,15,8,0.5),12px_22px_30px_rgba(0,0,0,0.45)]" />
//                       <div className="absolute left-5 top-5 h-7 w-12 -rotate-35 rounded-full bg-[#fff4cf]/60 blur-lg [transform:translateZ(25px)]" />
//                       <div className="absolute inset-3 rounded-full border border-[#f6e6b5]/30 [transform:translateZ(18px)_rotateY(55deg)_rotateZ(-25deg)]" />
//                       <div className="absolute inset-3 rounded-full border border-[#f6e6b5]/20 [transform:translateZ(15px)_rotateX(65deg)_rotateZ(-25deg)]" />

//                       {/* Raised porcelain speech bubble and gold sidewall */}
//                       <div className="absolute left-5 top-[49px] h-[66px] w-[100px] rounded-[23px] bg-[#9e8051] shadow-[6px_10px_14px_rgba(0,0,0,0.3)] [transform:translateZ(53px)_translate(5px,5px)_rotate(-9deg)]" />
//                       <div className="absolute left-5 top-[49px] flex h-[66px] w-[100px] items-center justify-center gap-2 rounded-[23px] border border-white/90 bg-[linear-gradient(135deg,#fffdf3,#eee3cc)] shadow-[inset_2px_2px_3px_white,inset_-3px_-3px_6px_rgba(120,95,55,0.18)] [transform:translateZ(58px)_rotate(-9deg)]">
//                         <span className="size-2.5 rounded-full bg-[#a48852] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
//                         <span className="size-2.5 rounded-full bg-[#a48852] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
//                         <span className="size-2.5 rounded-full bg-[#a48852] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
//                         <div className="absolute -bottom-2 left-5 size-5 rounded-br-[5px] bg-[#f1e7d1] [clip-path:polygon(0_0,100%_0,0_100%)]" />
//                       </div>
//                       <div className="absolute right-0 top-7 flex size-10 items-center justify-center rounded-full border border-[#f8e9c3] bg-[linear-gradient(135deg,#f3dfb0,#a57c3e)] text-[#5d4527] shadow-[3px_5px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_white] [transform:translateZ(65px)]"><MessageCircle className="size-5" strokeWidth={1.3} /></div>
//                     </motion.div>

//                     <ContactOrbit />

//                     <div className="absolute bottom-2 left-1/2 h-14 w-[220px] [transform:translateX(-50%)_translateZ(0px)]">
//                       <div className="absolute inset-x-0 bottom-0 h-10 rounded-[50%] bg-[#080808] shadow-[0_12px_20px_rgba(0,0,0,0.45)]" />
//                       <div className="absolute inset-x-0 top-0 h-10 rounded-[50%] border-2 border-[#bda06d] bg-[linear-gradient(145deg,#454034,#171714_65%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
//                     </div>
//                   </motion.div>
//                 </div>
//                 <div className="relative mx-7 border-t border-white/10 pt-5 pb-7">
//                   <span className="block text-[8px] tracking-[0.22em] text-[#bfa372]">{data.introduction.artLabel}</span>
//                   <div className="mt-3 font-serif text-[27px] leading-[1.15] text-[#f1e8d8]">{data.introduction.artTitle}</div>
//                   <span className="mt-4 block text-[7px] tracking-[0.15em] text-[#a99b85]">{data.introduction.artCaption}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between border-t border-border py-5 text-[8px] tracking-[0.12em] text-secondary max-[720px]:gap-5 max-[720px]:text-[7px] max-[720px]:leading-[1.8]">
//             <span>{data.introduction.footerText}</span>
//             <a href="#contact-methods">
//               {data.introduction.scrollText} <ArrowDown className="inline size-3" aria-hidden="true" />
//             </a>
//           </div>
//         </div>
//       </section>

//       <div className="mx-auto max-w-[1280px] px-7 max-[720px]:px-5 pt-[75px] max-[720px]:pt-[45px]">
//         {/* 02–04. Email, telephone and WhatsApp */}
//         <section
//           id="contact-methods"
//           aria-labelledby="contact-methods-heading"
//         >
//           <div className="mb-[30px] flex items-end justify-between gap-[35px] [&>p]:mb-[6px] [&>p]:max-w-[340px] [&>p]:text-[11px] max-[720px]:block max-[720px]:[&>p]:mt-[15px]">
//             <div>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.contactMethods.eyebrow}
//               </span>

//               <h2 id="contact-methods-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">
//                 {data.contactMethods.title}
//               </h2>
//             </div>

//             <p className="text-[13px] leading-[1.9] text-secondary">{data.contactMethods.description}</p>
//           </div>

//           <div className="grid grid-cols-3 gap-5 max-[1000px]:gap-3 max-[720px]:grid-cols-1">
//             <article className="rounded-t-[60px] rounded-b-[6px] border border-border bg-surface px-6 py-[30px] shadow-[0_16px_30px_-22px_rgba(80,60,30,0.4)] transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-[5px] hover:shadow-[0_20px_36px_#17171708] [&>p]:mt-[13px] [&>p]:mb-5 [&>p]:min-h-11 [&>p]:text-[11px] max-[1000px]:px-[18px] max-[1000px]:py-7 max-[720px]:rounded-t-[40px] max-[720px]:rounded-b-[5px] max-[720px]:p-[25px] max-[720px]:[&>p]:min-h-0">
//               <div className="mx-[6px] mt-[5px] mb-[30px] flex items-center justify-between text-accent [&_span]:font-serif [&_span]:text-[15px] [&_span]:italic max-[720px]:mb-5">
//                 <Icon kind="email" />
//                 <span>02</span>
//               </div>

//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.email.label}
//               </span>

//               <a
//                 className="mt-[15px] block text-[clamp(12px,1.3vw,17px)] [overflow-wrap:anywhere] max-[720px]:text-[17px]"
//                 href={`mailto:${business.email}`}
//               >
//                 {business.email}
//               </a>

//               <p className="text-[13px] leading-[1.9] text-secondary">{data.email.description}</p>

//               <Button variant="link"
//                 className="inline-flex h-auto items-center justify-start gap-1 rounded-none border-b border-[#a58b6555] bg-transparent p-0 pb-[5px] text-[10px] font-normal text-primary underline-offset-4"
//                 onClick={copyEmail}
//                 type="button"
//                 aria-live="polite"
//               >
//                 {copied ? data.email.copied : data.email.copy}{copied ? <Check className="size-3" aria-hidden="true" /> : <ArrowUpRight className="size-3" aria-hidden="true" />}
//               </Button>
//             </article>

//             <article className="rounded-t-[60px] rounded-b-[6px] border border-border bg-surface px-6 py-[30px] shadow-[0_16px_30px_-22px_rgba(80,60,30,0.4)] transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-[5px] hover:shadow-[0_20px_36px_#17171708] [&>p]:mt-[13px] [&>p]:mb-5 [&>p]:min-h-11 [&>p]:text-[11px] max-[1000px]:px-[18px] max-[1000px]:py-7 max-[720px]:rounded-t-[40px] max-[720px]:rounded-b-[5px] max-[720px]:p-[25px] max-[720px]:[&>p]:min-h-0">
//               <div className="mx-[6px] mt-[5px] mb-[30px] flex items-center justify-between text-accent [&_span]:font-serif [&_span]:text-[15px] [&_span]:italic max-[720px]:mb-5">
//                 <Icon kind="phone" />
//                 <span>03</span>
//               </div>

//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.telephone.label}
//               </span>

//               <a
//                 className="mt-[13px] block font-serif text-[22px] font-normal leading-[1.4]"
//                 href={`tel:${phoneHref}`}
//               >
//                 {business.phonePrimary}
//               </a>

//               <p className="text-[13px] leading-[1.9] text-secondary">{data.telephone.description}</p>

//               <a
//                 className="inline-flex h-auto items-center justify-start gap-1 rounded-none border-b border-[#a58b6555] bg-transparent p-0 pb-[5px] text-[10px] font-normal text-primary underline-offset-4"
//                 href={`tel:${phoneHref}`}
//               >
//                 {data.telephone.button} <ArrowUpRight className="inline size-3" aria-hidden="true" />
//               </a>
//             </article>

//             <article className="rounded-t-[60px] rounded-b-[6px] border border-border bg-surface px-6 py-[30px] shadow-[0_16px_30px_-22px_rgba(80,60,30,0.4)] transition-[transform,box-shadow] duration-300 motion-safe:hover:-translate-y-[5px] hover:shadow-[0_20px_36px_#17171708] [&>p]:mt-[13px] [&>p]:mb-5 [&>p]:min-h-11 [&>p]:text-[11px] max-[1000px]:px-[18px] max-[1000px]:py-7 max-[720px]:rounded-t-[40px] max-[720px]:rounded-b-[5px] max-[720px]:p-[25px] max-[720px]:[&>p]:min-h-0">
//               <div className="mx-[6px] mt-[5px] mb-[30px] flex items-center justify-between text-accent [&_span]:font-serif [&_span]:text-[15px] [&_span]:italic max-[720px]:mb-5">
//                 <Icon kind="chat" />
//                 <span>04</span>
//               </div>

//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.whatsapp.label}
//               </span>

//               <h3 className="mt-[13px] block font-serif text-[22px] font-normal leading-[1.4]">
//                 {data.whatsapp.title}
//               </h3>

//               <p className="text-[13px] leading-[1.9] text-secondary">
//                 {contact.whatsapp
//                   ? `+${contact.whatsapp}`
//                   : data.whatsapp.description}
//               </p>

//               <a
//                 className="inline-flex h-auto items-center justify-start gap-1 rounded-none border-b border-[#a58b6555] bg-transparent p-0 pb-[5px] text-[10px] font-normal text-primary underline-offset-4"
//                 href={
//                   contact.whatsapp
//                     ? `https://wa.me/${contact.whatsapp}`
//                     : `mailto:${business.email}?subject=${encodeURIComponent(
//                         data.whatsapp.request
//                       )}`
//                 }
//                 {...(contact.whatsapp
//                   ? {
//                       target: "_blank",
//                       rel: "noopener noreferrer",
//                     }
//                   : {})}
//               >
//                 {contact.whatsapp
//                   ? data.whatsapp.open
//                   : data.whatsapp.request}{" "}
//                 <ArrowUpRight className="inline size-3" aria-hidden="true" />
//               </a>
//             </article>
//           </div>
//         </section>

//         {/* 05–08. Addresses, hours and response time */}
//         <section
//           className="my-[65px] grid grid-cols-[1.1fr_1fr] gap-[70px] border-t border-border pt-10 [&_article+article]:border-t [&_article+article]:border-border [&_article+article]:pt-[30px] [&_p]:my-2.5 [&_p]:text-xs max-[1000px]:gap-[35px] max-[720px]:my-10 max-[720px]:grid-cols-1 max-[720px]:gap-[35px]"
//           aria-label={data.locations.label}
//         >
//           <div className="grid gap-8">
//             <article>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.locations.headOffice.label}
//               </span>

//               <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.locations.headOffice.title}</h3>

//               <address className="max-w-[460px] text-[13px] leading-[1.9] text-secondary not-italic">{business.address}</address>
//             </article>

//             <article>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.locations.factory.label}
//               </span>

//               <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.locations.factory.title}</h3>

//               <address className="max-w-[460px] text-[13px] leading-[1.9] text-secondary not-italic">
//                 {contact.factoryAddress ||
//                   data.locations.factory.pendingAddress}
//               </address>
//             </article>
//           </div>

//           <div className="grid gap-8 max-[720px]:border-t max-[720px]:border-border max-[720px]:pt-[30px]">
//             <article>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.businessHours.label}
//               </span>

//               <div className="mt-4 flex items-center gap-[15px] text-sm [&_b]:mt-[5px] [&_b]:block [&_b]:text-[10px] [&_b]:font-normal [&_b]:text-accent">
//                 <Icon kind="clock" />
//                 <span>
//                   {data.businessHours.timeZone}
//                   <b>{data.businessHours.utcOffset}</b>
//                 </span>
//               </div>

//               <p className="text-[13px] leading-[1.9] text-secondary">
//                 {contact.businessHours ||
//                   data.businessHours.pendingHours}
//               </p>
//             </article>

//             <article>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.responseTime.label}
//               </span>

//               <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.responseTime.title}</h3>

//               <p className="text-[13px] leading-[1.9] text-secondary">
//                 {contact.responseTime ||
//                   data.responseTime.description}
//               </p>
//             </article>
//           </div>
//         </section>

//         {/* 09. Factory visits */}
//         <section
//           className="grid grid-cols-[1.1fr_1fr] gap-[70px] rounded-[4px] bg-primary p-[50px] text-background [&_h2]:text-[44px] [&_p]:text-xs [&_p]:text-white/60 [&_ol]:m-0 [&_ol]:list-none [&_ol]:self-center [&_ol]:p-0 [&_li]:flex [&_li]:gap-6 [&_li]:border-b [&_li]:border-white/10 [&_li]:py-5 [&_li:last-child]:border-0 [&_li>span]:pt-[7px] [&_li>span]:font-serif [&_li>span]:text-xl [&_li>span]:text-accent [&_li>span]:italic [&_li_h3]:mt-0 [&_li_h3]:mb-[5px] [&_li_h3]:text-[21px] [&_li_p]:m-0 [&_li_p]:text-[11px] max-[1000px]:gap-[35px] max-[1000px]:p-[35px] max-[720px]:grid-cols-1 max-[720px]:gap-[25px] max-[720px]:px-6 max-[720px]:py-[30px] max-[720px]:[&_h2]:text-[38px]"
//           aria-labelledby="visit-heading"
//         >
//           <div>
//             <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//               {data.factoryVisit.eyebrow}
//             </span>

//             <h2 id="visit-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">
//               {data.factoryVisit.title}
//               <br />
//               <em className="font-normal text-accent">{data.factoryVisit.highlightedTitle}</em>
//             </h2>

//             <p className="text-[13px] leading-[1.9] text-secondary">{data.factoryVisit.description}</p>

//             <a
//               href={`mailto:${business.email}?subject=${encodeURIComponent(
//                 data.factoryVisit.button
//               )}`}
//               className={cn(buttonVariants({ variant: "secondary" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background mt-[18px] bg-background text-primary hover:bg-background/90")}
//             >
//               {data.factoryVisit.button}
//               <ArrowUpRight className="size-3.5" aria-hidden="true" />
//             </a>
//           </div>

//           <ol>
//             {data.factoryVisit.steps.map((step) => (
//               <li key={step.number}>
//                 <span>{step.number}</span>

//                 <div>
//                   <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{step.title}</h3>
//                   <p className="text-[13px] leading-[1.9] text-secondary">{step.description}</p>
//                 </div>
//               </li>
//             ))}
//           </ol>
//         </section>

//         {/* 10. Map loaded after interaction */}
//         <section
//           className="my-[70px] max-[720px]:my-[45px]"
//           aria-labelledby="map-heading"
//         >
//           <div className="mb-[30px] flex items-end justify-between gap-[35px] [&>p]:mb-[6px] [&>p]:max-w-[340px] [&>p]:text-[11px] max-[720px]:block max-[720px]:[&>p]:mt-[15px]">
//             <div>
//               <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                 {data.map.eyebrow}
//               </span>

//               <h2 id="map-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">{data.map.title}</h2>
//             </div>

//             <p className="text-[13px] leading-[1.9] text-secondary">
//               {hasFactoryLocation
//                 ? data.map.confirmedDescription
//                 : data.map.pendingDescription}
//             </p>
//           </div>

//           <div className="relative h-[400px] overflow-hidden border border-border bg-surface-muted [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 max-[720px]:h-[410px]">
//             {mapLoaded ? (
//               <>
//                 <iframe
//                   title={data.map.iframeTitle}
//                   src={`https://maps.google.com/maps?q=${encodeURIComponent(
//                     mapQuery
//                   )}&output=embed`}
//                   loading="lazy"
//                   referrerPolicy="no-referrer"
//                   allowFullScreen
//                 />

//                 <a
//                   className="absolute right-4 bottom-4 inline-flex items-center gap-1 bg-surface px-[18px] py-3 text-[11px] text-primary shadow-[0_3px_20px_#0002]"
//                   href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//                     mapQuery
//                   )}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {data.map.openLarger} <ArrowUpRight className="inline size-3" aria-hidden="true" />
//                 </a>
//               </>
//             ) : (
//               <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(90deg,#a58b650b_1px,transparent_1px),linear-gradient(#a58b650b_1px,transparent_1px)] bg-size-[45px_45px] p-[30px] text-center [&_h3]:my-2.5 [&_h3]:text-[28px] [&_p]:mt-0 [&_p]:mb-5 [&_p]:max-w-[360px] [&_p]:text-[11px]">
//                 <div className="mb-[18px] rounded-full border border-border bg-surface p-4 text-accent">
//                   <Icon kind="pin" />
//                 </div>

//                 <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                   {data.map.placeholderLabel}
//                 </span>

//                 <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.map.placeholderTitle}</h3>
//                 <p className="text-[13px] leading-[1.9] text-secondary">{data.map.placeholderDescription}</p>

//                 <Button variant="default"
//                   className={cn(buttonVariants({ variant: "default" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background")}
//                   type="button"
//                   onClick={() => setMapLoaded(true)}
//                 >
//                   {hasFactoryLocation
//                     ? data.map.loadFactory
//                     : data.map.loadHeadOffice}
//                   <ArrowUpRight className="size-3.5" aria-hidden="true" />
//                 </Button>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* 11. General contact form */}
//         <section
//           id="general-enquiry"
//           className="grid scroll-mt-[105px] grid-cols-[0.8fr_1.2fr] gap-[75px] border-t border-border pt-[55px] pb-[65px] [&_h2]:text-[48px] [&>div>p]:max-w-[340px] [&>div>p]:text-xs max-[1000px]:gap-[35px] max-[720px]:grid-cols-1 max-[720px]:gap-[30px] max-[720px]:py-10 max-[720px]:[&_h2]:text-[42px]"
//           aria-labelledby="enquiry-heading"
//         >
//           <div>
//             <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//               {data.form.eyebrow}
//             </span>

//             <h2 id="enquiry-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">
//               {data.form.title}
//               <br />
//               <em className="font-normal text-accent">{data.form.highlightedTitle}</em>
//             </h2>

//             <p className="text-[13px] leading-[1.9] text-secondary">{data.form.description}</p>

//             <div className="mt-[35px] flex items-center gap-[15px] border-t border-border pt-[22px] text-accent [&_span]:text-[10px] [&_span]:text-secondary [&_a]:mt-2 [&_a]:block [&_a]:text-primary [&_a]:[overflow-wrap:anywhere]">
//               <Icon kind="email" />

//               <span>
//                 {data.form.directEmail}
//                 <a href={`mailto:${business.email}`}>
//                   {business.email}
//                 </a>
//               </span>
//             </div>
//           </div>

//           <form onSubmit={prepareEmail} className="border border-border bg-surface p-[30px] max-[720px]:px-5 max-[720px]:py-6">
//             <div className="mb-[25px] grid grid-cols-2 gap-[23px] max-[720px]:grid-cols-1 max-[720px]:gap-5">
//               <label className="block text-[10px] text-primary [&>span]:text-accent">
//                 {data.form.name} <span>*</span>
//                 <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
//                   name="name"
//                   autoComplete="name"
//                   required
//                   maxLength={100}
//                   placeholder={data.form.namePlaceholder}
//                 />
//               </label>

//               <label className="block text-[10px] text-primary [&>span]:text-accent">
//                 {data.form.company}
//                 <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
//                   name="company"
//                   autoComplete="organization"
//                   maxLength={150}
//                   placeholder={data.form.companyPlaceholder}
//                 />
//               </label>

//               <label className="block text-[10px] text-primary [&>span]:text-accent">
//                 {data.form.email} <span>*</span>
//                 <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   maxLength={254}
//                   placeholder={data.form.emailPlaceholder}
//                 />
//               </label>

//               <label className="block text-[10px] text-primary [&>span]:text-accent">
//                 {data.form.telephone}
//                 <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
//                   name="phone"
//                   type="tel"
//                   autoComplete="tel"
//                   maxLength={40}
//                   placeholder={data.form.telephonePlaceholder}
//                 />
//               </label>

//               <label className="block text-[10px] text-primary [&>span]:text-accent">
//                 {data.form.country}
//                 <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
//                   name="country"
//                   autoComplete="country-name"
//                   maxLength={100}
//                   placeholder={data.form.countryPlaceholder}
//                 />
//               </label>

//               <label className="block text-[10px] text-primary [&>span]:text-accent">
//                 {data.form.subject}
//                 <select className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]" name="subject">
//                   {Object.entries(data.form.subjects).map(
//                     ([key, label]) => (
//                       <option key={key} value={label}>
//                         {label}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </label>
//             </div>

//             <label className="block text-[10px] text-primary [&>span]:text-accent">
//               {data.form.message} <span>*</span>
//               <textarea className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)] min-h-[120px] resize-y"
//                 name="message"
//                 rows={5}
//                 required
//                 maxLength={4000}
//                 placeholder={data.form.messagePlaceholder}
//               />
//             </label>

//             <p className="mt-[17px] mb-[22px] text-[10px] leading-[1.9] text-secondary">
//               {data.form.requiredNote}
//             </p>

//             <Button variant="default" className={cn(buttonVariants({ variant: "default" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background")} type="submit">
//               {data.form.button}
//               <ArrowUpRight className="size-3.5" aria-hidden="true" />
//             </Button>

//             <p role="status" className="mt-[15px] mb-0 text-[11px] leading-[1.9] text-secondary empty:hidden">
//               {draftPrepared ? data.form.draftPrepared : ""}
//             </p>
//           </form>
//         </section>

//         {/* 12. Social media */}
//         <section
//           className="flex items-center justify-between gap-10 border-t border-border pt-[45px] pb-[65px] [&_h2]:text-[34px] [&_p]:text-[11px] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-5 max-[720px]:pb-[45px] max-[720px]:[&_h2]:text-[30px]"
//           aria-labelledby="social-heading"
//         >
//           <div>
//             <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//               {data.social.eyebrow}
//             </span>

//             <h2 id="social-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">{data.social.title}</h2>
//             <p className="text-[13px] leading-[1.9] text-secondary">{data.social.description}</p>
//           </div>

//           <div className="max-w-[370px] [&>div]:border-l [&>div]:border-border [&>div]:pl-[25px] [&_a]:mt-3 [&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-[25px] [&_a]:text-[11px] max-[720px]:[&>div]:border-l-0 max-[720px]:[&>div]:pl-0">
//             {contact.socialProfiles.length > 0 ? (
//               contact.socialProfiles.map((profile) => (
//                 <a
//                   key={profile.url}
//                   href={profile.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   {profile.name}
//                   <Icon kind="arrow" />
//                 </a>
//               ))
//             ) : (
//               <div>
//                 <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
//                   {data.social.profilesLabel}
//                 </span>

//                 <p className="text-[13px] leading-[1.9] text-secondary">{data.social.pendingProfiles}</p>

//                 <a
//                   href={`mailto:${business.email}?subject=${encodeURIComponent(
//                     data.social.requestProfiles
//                   )}`}
//                 >
//                   {data.social.requestProfiles} <ArrowUpRight className="inline size-3" aria-hidden="true" />
//                 </a>
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import ContactMethods from "./ContactMethods";
import { motion, useSpring, useReducedMotion } from "motion/react";
import { useLanguage } from "@/src/providers";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { Mail, Phone, MessageCircle, MapPin, Clock3, ArrowUpRight, Check, ArrowDown } from "lucide-react";
import FactoryVisit from "./FactoryVisit";

const contact = {
  whatsapp: "",
  factoryAddress: "",
  factoryMapQuery: "",
  businessHours: "",
  responseTime: "",
  socialProfiles: [] as {
    name: string;
    url: string;
  }[],
};

type IconKind =
  | "email"
  | "phone"
  | "chat"
  | "pin"
  | "clock"
  | "arrow";

function Icon({ kind }: { kind: IconKind }) {
  const icons = { email: Mail, phone: Phone, chat: MessageCircle, pin: MapPin, clock: Clock3, arrow: ArrowUpRight };
  const Component = icons[kind];
  return <Component className="size-[22px] shrink-0" strokeWidth={1.3} aria-hidden="true" />;
}

function ContactOrbit() {
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = ring.current?.parentElement;
    if (!parent) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let radius = 120;
    let angle = -Math.PI / 6;
    let previous = 0;
    let frame = 0;
    const inclination = (58 * Math.PI) / 180;

    function position() {
      tiles.current.forEach((tile, index) => {
        if (!tile) return;
        const phase = angle + index * (Math.PI * 2 / 3);
        const x = Math.cos(phase) * radius;
        const y = Math.sin(phase) * radius * Math.cos(inclination);
        const z = Math.sin(phase) * radius * Math.sin(inclination);
        tile.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotate(${Math.cos(phase) * 9}deg)`;
      });
    }

    function measure() {
      radius = Math.min(parent!.clientWidth * 0.44, 155);
      position();
    }

    function animate(time: number) {
      if (!document.hidden) {
        if (previous) angle += Math.min(time - previous, 50) / 18000 * Math.PI * 2;
        previous = time;
        position();
      } else previous = 0;
      frame = requestAnimationFrame(animate);
    }

    function updateMotion() {
      cancelAnimationFrame(frame);
      previous = 0;
      position();
      if (!media.matches) frame = requestAnimationFrame(animate);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    media.addEventListener("change", updateMotion);
    measure();
    updateMotion();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="pointer-events-none absolute left-1/2 top-[43%] aspect-square w-[88%] max-w-[310px] rounded-full border border-[#d8ba7d]/50 shadow-[0_0_18px_rgba(210,175,110,0.08)] [transform:translate(-50%,-50%)_rotateX(58deg)]" />
      {[Mail, Phone, MapPin].map((ContactIcon, index) => (
        <div
          key={index}
          ref={node => { tiles.current[index] = node; }}
          data-contact-orbit={index}
          style={{ transform: `translate(-50%, -50%) translate3d(${Math.cos(-Math.PI / 6 + index * Math.PI * 2 / 3) * 120}px, ${Math.sin(-Math.PI / 6 + index * Math.PI * 2 / 3) * 64}px, ${Math.sin(-Math.PI / 6 + index * Math.PI * 2 / 3) * 102}px)` }}
          className="pointer-events-none absolute left-1/2 top-[43%] flex size-12 items-center justify-center rounded-2xl border border-[#d5bb84]/60 bg-[linear-gradient(135deg,#eee0bd,#b6975f_55%,#806239)] text-[#47351f] shadow-[5px_9px_14px_rgba(0,0,0,0.4),inset_1px_1px_2px_rgba(255,255,255,0.7),inset_-2px_-2px_3px_rgba(70,45,15,0.2)] will-change-transform"
        >
          <ContactIcon className="size-5" strokeWidth={1.4} aria-hidden="true" />
        </div>
      ))}
    </>
  );
}


export default function ContactUsSection() {
  const { t, locale } = useLanguage();

  const data = t.contactUs;
  const business = t.finalCta.contactInfo;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [draftPrepared, setDraftPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const artRotateX = useSpring(10, { stiffness: 110, damping: 22 });
  const artRotateY = useSpring(-14, { stiffness: 110, damping: 22 });

  const phoneHref = business.phonePrimary
    .replace(/^\+86\s*\(0(\d+)\)/, "+86$1")
    .replace(/\(0\)/g, "")
    .replace(/[^+\d]/g, "");

  const hasFactoryLocation = Boolean(
    contact.factoryMapQuery || contact.factoryAddress
  );

  const mapQuery =
    contact.factoryMapQuery ||
    contact.factoryAddress ||
    business.address;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(business.email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fields = new FormData(event.currentTarget);
    const labels = data.form.emailBodyLabels;

    const subject =
      `[${data.form.emailSubjectPrefix}] ` +
      `${fields.get("subject")} — ` +
      `${fields.get("company") || fields.get("name")}`;

    const body = [
      `${labels.name}: ${fields.get("name")}`,
      `${labels.company}: ${fields.get("company") || "—"}`,
      `${labels.email}: ${fields.get("email")}`,
      `${labels.telephone}: ${fields.get("phone") || "—"}`,
      `${labels.country}: ${fields.get("country") || "—"}`,
      "",
      String(fields.get("message") || ""),
    ].join("\n");

    window.location.href =
      `mailto:${business.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    setDraftPrepared(true);
  }

  return (
    <div
      className="bg-background text-primary [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-accent [&_a]:focus-visible:outline-offset-4 motion-reduce:[&_*]:transition-none [&:lang(zh-CN)_h1]:text-[clamp(36px,4.3vw,59px)] [&:lang(zh-CN)_h1]:leading-[1.35] [&:lang(zh-CN)_h1]:tracking-[0.01em] [&:lang(zh-CN)_em]:not-italic [&:lang(zh-CN)_h2]:leading-[1.4] [&:lang(zh-CN)_h3]:leading-[1.5]"
      lang={locale === "zh" ? "zh-CN" : "en"}
    >
      {/* 01. Contact introduction */}
      <section
        className="relative overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_90%_50%,#a58b6517,transparent_55%)]"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-[1280px] px-7 max-[720px]:px-5">
          <div className="flex gap-[14px] pt-[30px] text-[10px] text-secondary">
            <Link href="/">{data.home}</Link>
            <span>/</span>
            <span>{data.breadcrumb}</span>
          </div>

          <div className="grid grid-cols-[1.45fr_1fr] items-center gap-[60px] pt-[65px] pb-[70px] [&_h1]:my-[26px] [&_p]:mb-7 [&_p]:max-w-[490px] max-[1000px]:gap-[25px] max-[720px]:grid-cols-1 max-[720px]:gap-7 max-[720px]:pt-[42px] max-[720px]:pb-[38px]">
            <div>
              <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                {data.introduction.eyebrow}
              </span>

              <h1 id="contact-heading" className="my-[26px] font-serif text-[clamp(44px,5.5vw,76px)] font-normal leading-[1.06] tracking-[-0.045em] max-[720px]:text-[49px]">
                {data.introduction.title}
                <br />
                <em className="font-normal text-accent">{data.introduction.highlightedTitle}</em>
              </h1>

              <p className="text-[13px] leading-[1.9] text-secondary">{data.introduction.description}</p>

              <a
                className={cn(buttonVariants({ variant: "default" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background")}
                href="#general-enquiry"
              >
                {data.introduction.button}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <div
              aria-hidden="true"
              onPointerMove={(event) => {
                if (reduceMotion || event.pointerType !== "mouse") return;
                const rect = event.currentTarget.getBoundingClientRect();
                artRotateX.set(10 - ((event.clientY - rect.top) / rect.height - 0.5) * 16);
                artRotateY.set(-14 + ((event.clientX - rect.left) / rect.width - 0.5) * 24);
              }}
              onPointerLeave={() => { artRotateX.set(10); artRotateY.set(-14); }}
              onPointerCancel={() => { artRotateX.set(10); artRotateY.set(-14); }}
              className="relative mx-auto w-full max-w-[390px] justify-self-center [perspective:1100px] max-[720px]:max-w-[330px]"
            >
              <div className="absolute inset-0 translate-x-3 translate-y-4 rounded-t-[160px] rounded-b-[28px] bg-[#a58b65]/25" />
              <div className="relative overflow-hidden rounded-t-[160px] rounded-b-[28px] border border-[#b39a70]/35 bg-[#171717] shadow-[0_35px_65px_-25px_rgba(35,25,20,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,rgba(185,153,102,0.27),transparent_65%)]" />
                <div className="relative aspect-[1/1.05] [perspective:1000px]">
                  <motion.div
                    style={{ rotateX: artRotateX, rotateY: artRotateY }}
                    className="absolute inset-6 [transform-style:preserve-3d]"
                  >
                    <div className="absolute left-1/2 top-[43%] size-[260px] rounded-full border border-[#c7aa76]/20 [transform:translate(-50%,-50%)_rotateY(28deg)] max-[380px]:size-[220px]" />
                    <motion.div
                      animate={reduceMotion ? { y: 0 } : { y: [-6, 6, -6] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-1/2 top-[43%] size-[156px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
                    >
                      {/* Polished gold communication sphere */}
                      <div className="absolute inset-0 rounded-full border border-[#eed9a7]/40 bg-[radial-gradient(circle_at_28%_23%,#fff5d8_0%,#e0c68c_17%,#af8950_40%,#6b512e_67%,#242019_91%)] shadow-[inset_5px_5px_14px_rgba(255,245,210,0.25),inset_-12px_-14px_20px_rgba(20,15,8,0.5),12px_22px_30px_rgba(0,0,0,0.45)]" />
                      <div className="absolute left-5 top-5 h-7 w-12 -rotate-35 rounded-full bg-[#fff4cf]/60 blur-lg [transform:translateZ(25px)]" />
                      <div className="absolute inset-3 rounded-full border border-[#f6e6b5]/30 [transform:translateZ(18px)_rotateY(55deg)_rotateZ(-25deg)]" />
                      <div className="absolute inset-3 rounded-full border border-[#f6e6b5]/20 [transform:translateZ(15px)_rotateX(65deg)_rotateZ(-25deg)]" />

                      {/* Raised porcelain speech bubble and gold sidewall */}
                      <div className="absolute left-5 top-[49px] h-[66px] w-[100px] rounded-[23px] bg-[#9e8051] shadow-[6px_10px_14px_rgba(0,0,0,0.3)] [transform:translateZ(53px)_translate(5px,5px)_rotate(-9deg)]" />
                      <div className="absolute left-5 top-[49px] flex h-[66px] w-[100px] items-center justify-center gap-2 rounded-[23px] border border-white/90 bg-[linear-gradient(135deg,#fffdf3,#eee3cc)] shadow-[inset_2px_2px_3px_white,inset_-3px_-3px_6px_rgba(120,95,55,0.18)] [transform:translateZ(58px)_rotate(-9deg)]">
                        <span className="size-2.5 rounded-full bg-[#a48852] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
                        <span className="size-2.5 rounded-full bg-[#a48852] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
                        <span className="size-2.5 rounded-full bg-[#a48852] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]" />
                        <div className="absolute -bottom-2 left-5 size-5 rounded-br-[5px] bg-[#f1e7d1] [clip-path:polygon(0_0,100%_0,0_100%)]" />
                      </div>
                      <div className="absolute right-0 top-7 flex size-10 items-center justify-center rounded-full border border-[#f8e9c3] bg-[linear-gradient(135deg,#f3dfb0,#a57c3e)] text-[#5d4527] shadow-[3px_5px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_white] [transform:translateZ(65px)]"><MessageCircle className="size-5" strokeWidth={1.3} /></div>
                    </motion.div>

                    <ContactOrbit />

                    <div className="absolute bottom-2 left-1/2 h-14 w-[220px] [transform:translateX(-50%)_translateZ(0px)]">
                      <div className="absolute inset-x-0 bottom-0 h-10 rounded-[50%] bg-[#080808] shadow-[0_12px_20px_rgba(0,0,0,0.45)]" />
                      <div className="absolute inset-x-0 top-0 h-10 rounded-[50%] border-2 border-[#bda06d] bg-[linear-gradient(145deg,#454034,#171714_65%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
                    </div>
                  </motion.div>
                </div>
                <div className="relative mx-7 border-t border-white/10 pt-5 pb-7">
                  <span className="block text-[8px] tracking-[0.22em] text-[#bfa372]">{data.introduction.artLabel}</span>
                  <div className="mt-3 font-serif text-[27px] leading-[1.15] text-[#f1e8d8]">{data.introduction.artTitle}</div>
                  <span className="mt-4 block text-[7px] tracking-[0.15em] text-[#a99b85]">{data.introduction.artCaption}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between border-t border-border py-5 text-[8px] tracking-[0.12em] text-secondary max-[720px]:gap-5 max-[720px]:text-[7px] max-[720px]:leading-[1.8]">
            <span>{data.introduction.footerText}</span>
            <a href="#contact-methods">
              {data.introduction.scrollText} <ArrowDown className="inline size-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-7 max-[720px]:px-5 pt-[75px] max-[720px]:pt-[45px]">
        {/* 02–04. Email, telephone and WhatsApp */}
        <ContactMethods data={data} business={business} copied={copied} copyEmail={copyEmail} phoneHref={phoneHref} whatsapp={contact.whatsapp} />

        {/* 05–08. Addresses, hours and response time */}
        <section
          className="my-[65px] grid grid-cols-[1.1fr_1fr] gap-[70px] border-t border-border pt-10 [&_article+article]:border-t [&_article+article]:border-border [&_article+article]:pt-[30px] [&_p]:my-2.5 [&_p]:text-xs max-[1000px]:gap-[35px] max-[720px]:my-10 max-[720px]:grid-cols-1 max-[720px]:gap-[35px]"
          aria-label={data.locations.label}
        >
          <div className="grid gap-8">
            <article>
              <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                {data.locations.headOffice.label}
              </span>

              <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.locations.headOffice.title}</h3>

              <address className="max-w-[460px] text-[13px] leading-[1.9] text-secondary not-italic">{business.address}</address>
            </article>

            <article>
              <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                {data.locations.factory.label}
              </span>

              <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.locations.factory.title}</h3>

              <address className="max-w-[460px] text-[13px] leading-[1.9] text-secondary not-italic">
                {contact.factoryAddress ||
                  data.locations.factory.pendingAddress}
              </address>
            </article>
          </div>

          <div className="grid gap-8 max-[720px]:border-t max-[720px]:border-border max-[720px]:pt-[30px]">
            <article>
              <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                {data.businessHours.label}
              </span>

              <div className="mt-4 flex items-center gap-[15px] text-sm [&_b]:mt-[5px] [&_b]:block [&_b]:text-[10px] [&_b]:font-normal [&_b]:text-accent">
                <Icon kind="clock" />
                <span>
                  {data.businessHours.timeZone}
                  <b>{data.businessHours.utcOffset}</b>
                </span>
              </div>

              <p className="text-[13px] leading-[1.9] text-secondary">
                {contact.businessHours ||
                  data.businessHours.pendingHours}
              </p>
            </article>

            <article>
              <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                {data.responseTime.label}
              </span>

              <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.responseTime.title}</h3>

              <p className="text-[13px] leading-[1.9] text-secondary">
                {contact.responseTime ||
                  data.responseTime.description}
              </p>
            </article>
          </div>
        </section>

        {/* 09. Factory visits */}
        <section
          className="grid grid-cols-[1.1fr_1fr] gap-[70px] rounded-[4px] bg-primary p-[50px] text-background [&_h2]:text-[44px] [&_p]:text-xs [&_p]:text-white/60 [&_ol]:m-0 [&_ol]:list-none [&_ol]:self-center [&_ol]:p-0 [&_li]:flex [&_li]:gap-6 [&_li]:border-b [&_li]:border-white/10 [&_li]:py-5 [&_li:last-child]:border-0 [&_li>span]:pt-[7px] [&_li>span]:font-serif [&_li>span]:text-xl [&_li>span]:text-accent [&_li>span]:italic [&_li_h3]:mt-0 [&_li_h3]:mb-[5px] [&_li_h3]:text-[21px] [&_li_p]:m-0 [&_li_p]:text-[11px] max-[1000px]:gap-[35px] max-[1000px]:p-[35px] max-[720px]:grid-cols-1 max-[720px]:gap-[25px] max-[720px]:px-6 max-[720px]:py-[30px] max-[720px]:[&_h2]:text-[38px]"
          aria-labelledby="visit-heading"
        >
          <div>
            <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
              {data.factoryVisit.eyebrow}
            </span>

            <h2 id="visit-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">
              {data.factoryVisit.title}
              <br />
              <em className="font-normal text-accent">{data.factoryVisit.highlightedTitle}</em>
            </h2>

            <p className="text-[13px] leading-[1.9] text-secondary">{data.factoryVisit.description}</p>

            <a
              href={`mailto:${business.email}?subject=${encodeURIComponent(
                data.factoryVisit.button
              )}`}
              className={cn(buttonVariants({ variant: "secondary" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background mt-[18px] bg-background text-primary hover:bg-background/90")}
            >
              {data.factoryVisit.button}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <ol>
            {data.factoryVisit.steps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>

                <div>
                  <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{step.title}</h3>
                  <p className="text-[13px] leading-[1.9] text-secondary">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 10. Map loaded after interaction */}
        <section
          className="my-[70px] max-[720px]:my-[45px]"
          aria-labelledby="map-heading"
        >
          <div className="mb-[30px] flex items-end justify-between gap-[35px] [&>p]:mb-[6px] [&>p]:max-w-[340px] [&>p]:text-[11px] max-[720px]:block max-[720px]:[&>p]:mt-[15px]">
            <div>
              <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                {data.map.eyebrow}
              </span>

              <h2 id="map-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">{data.map.title}</h2>
            </div>

            <p className="text-[13px] leading-[1.9] text-secondary">
              {hasFactoryLocation
                ? data.map.confirmedDescription
                : data.map.pendingDescription}
            </p>
          </div>

          <div className="relative h-[400px] overflow-hidden border border-border bg-surface-muted [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0 max-[720px]:h-[410px]">
            {mapLoaded ? (
              <>
                <iframe
                  title={data.map.iframeTitle}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                />

                <a
                  className="absolute right-4 bottom-4 inline-flex items-center gap-1 bg-surface px-[18px] py-3 text-[11px] text-primary shadow-[0_3px_20px_#0002]"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.map.openLarger} <ArrowUpRight className="inline size-3" aria-hidden="true" />
                </a>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(90deg,#a58b650b_1px,transparent_1px),linear-gradient(#a58b650b_1px,transparent_1px)] bg-size-[45px_45px] p-[30px] text-center [&_h3]:my-2.5 [&_h3]:text-[28px] [&_p]:mt-0 [&_p]:mb-5 [&_p]:max-w-[360px] [&_p]:text-[11px]">
                <div className="mb-[18px] rounded-full border border-border bg-surface p-4 text-accent">
                  <Icon kind="pin" />
                </div>

                <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                  {data.map.placeholderLabel}
                </span>

                <h3 className="my-3 font-serif text-2xl font-normal leading-[1.35]">{data.map.placeholderTitle}</h3>
                <p className="text-[13px] leading-[1.9] text-secondary">{data.map.placeholderDescription}</p>

                <Button variant="default"
                  className={cn(buttonVariants({ variant: "default" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background")}
                  type="button"
                  onClick={() => setMapLoaded(true)}
                >
                  {hasFactoryLocation
                    ? data.map.loadFactory
                    : data.map.loadHeadOffice}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* 11. General contact form */}
        <section
          id="general-enquiry"
          className="grid scroll-mt-[105px] grid-cols-[0.8fr_1.2fr] gap-[75px] border-t border-border pt-[55px] pb-[65px] [&_h2]:text-[48px] [&>div>p]:max-w-[340px] [&>div>p]:text-xs max-[1000px]:gap-[35px] max-[720px]:grid-cols-1 max-[720px]:gap-[30px] max-[720px]:py-10 max-[720px]:[&_h2]:text-[42px]"
          aria-labelledby="enquiry-heading"
        >
          <div>
            <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
              {data.form.eyebrow}
            </span>

            <h2 id="enquiry-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">
              {data.form.title}
              <br />
              <em className="font-normal text-accent">{data.form.highlightedTitle}</em>
            </h2>

            <p className="text-[13px] leading-[1.9] text-secondary">{data.form.description}</p>

            <div className="mt-[35px] flex items-center gap-[15px] border-t border-border pt-[22px] text-accent [&_span]:text-[10px] [&_span]:text-secondary [&_a]:mt-2 [&_a]:block [&_a]:text-primary [&_a]:[overflow-wrap:anywhere]">
              <Icon kind="email" />

              <span>
                {data.form.directEmail}
                <a href={`mailto:${business.email}`}>
                  {business.email}
                </a>
              </span>
            </div>
          </div>

          <form onSubmit={prepareEmail} className="border border-border bg-surface p-[30px] max-[720px]:px-5 max-[720px]:py-6">
            <div className="mb-[25px] grid grid-cols-2 gap-[23px] max-[720px]:grid-cols-1 max-[720px]:gap-5">
              <label className="block text-[10px] text-primary [&>span]:text-accent">
                {data.form.name} <span>*</span>
                <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder={data.form.namePlaceholder}
                />
              </label>

              <label className="block text-[10px] text-primary [&>span]:text-accent">
                {data.form.company}
                <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
                  name="company"
                  autoComplete="organization"
                  maxLength={150}
                  placeholder={data.form.companyPlaceholder}
                />
              </label>

              <label className="block text-[10px] text-primary [&>span]:text-accent">
                {data.form.email} <span>*</span>
                <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder={data.form.emailPlaceholder}
                />
              </label>

              <label className="block text-[10px] text-primary [&>span]:text-accent">
                {data.form.telephone}
                <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                  placeholder={data.form.telephonePlaceholder}
                />
              </label>

              <label className="block text-[10px] text-primary [&>span]:text-accent">
                {data.form.country}
                <Input className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]"
                  name="country"
                  autoComplete="country-name"
                  maxLength={100}
                  placeholder={data.form.countryPlaceholder}
                />
              </label>

              <label className="block text-[10px] text-primary [&>span]:text-accent">
                {data.form.subject}
                <select className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)]" name="subject">
                  {Object.entries(data.form.subjects).map(
                    ([key, label]) => (
                      <option key={key} value={label}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <label className="block text-[10px] text-primary [&>span]:text-accent">
              {data.form.message} <span>*</span>
              <textarea className="block h-auto w-full rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-xs leading-[1.5] text-primary shadow-none outline-none placeholder:text-secondary/70 focus-visible:border-accent focus-visible:ring-0 focus-visible:shadow-[0_1px_0_var(--accent)] min-h-[120px] resize-y"
                name="message"
                rows={5}
                required
                maxLength={4000}
                placeholder={data.form.messagePlaceholder}
              />
            </label>

            <p className="mt-[17px] mb-[22px] text-[10px] leading-[1.9] text-secondary">
              {data.form.requiredNote}
            </p>

            <Button variant="default" className={cn(buttonVariants({ variant: "default" }), "h-auto justify-between gap-10 rounded-none border border-primary bg-primary px-6 py-[17px] text-[11px] font-medium text-background")} type="submit">
              {data.form.button}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Button>

            <p role="status" className="mt-[15px] mb-0 text-[11px] leading-[1.9] text-secondary empty:hidden">
              {draftPrepared ? data.form.draftPrepared : ""}
            </p>
          </form>
        </section>

        {/* 12. Social media */}
        <section
          className="flex items-center justify-between gap-10 border-t border-border pt-[45px] pb-[65px] [&_h2]:text-[34px] [&_p]:text-[11px] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-5 max-[720px]:pb-[45px] max-[720px]:[&_h2]:text-[30px]"
          aria-labelledby="social-heading"
        >
          <div>
            <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
              {data.social.eyebrow}
            </span>

            <h2 id="social-heading" className="my-3 font-serif text-[clamp(30px,3.2vw,43px)] font-normal leading-[1.2] tracking-[-0.03em]">{data.social.title}</h2>
            <p className="text-[13px] leading-[1.9] text-secondary">{data.social.description}</p>
          </div>

          <div className="max-w-[370px] [&>div]:border-l [&>div]:border-border [&>div]:pl-[25px] [&_a]:mt-3 [&_a]:flex [&_a]:items-center [&_a]:justify-between [&_a]:gap-[25px] [&_a]:text-[11px] max-[720px]:[&>div]:border-l-0 max-[720px]:[&>div]:pl-0">
            {contact.socialProfiles.length > 0 ? (
              contact.socialProfiles.map((profile) => (
                <a
                  key={profile.url}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.name}
                  <Icon kind="arrow" />
                </a>
              ))
            ) : (
              <div>
                <span className="block text-[9px] leading-[1.8] tracking-[0.2em] text-accent">
                  {data.social.profilesLabel}
                </span>

                <p className="text-[13px] leading-[1.9] text-secondary">{data.social.pendingProfiles}</p>

                <a
                  href={`mailto:${business.email}?subject=${encodeURIComponent(
                    data.social.requestProfiles
                  )}`}
                >
                  {data.social.requestProfiles} <ArrowUpRight className="inline size-3" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}