"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, Check, Mail, MessageCircle, Phone, Building2, MapPin, UserRound } from "lucide-react";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import type en from "@/src/providers/dictionaries/en";
import { contact } from "./ContactData";
import { useLanguage } from "@/src/providers";

type Props = {
  data: Pick<typeof en.contactUs, "contactMethods" | "email" | "telephone" | "whatsapp">;
  business: { email: string; phonePrimary: string };
  copied: boolean;
  copyEmail: () => void | Promise<void>;
  phoneHref: string;
  whatsapp?: string;
};

type Method = {
  kind: "email" | "phone" | "chat";
  number: string;
  label: string;
  value: string;
  description: string;
  action: string;
  href?: string;
  external?: boolean;
};

function MethodCard({ item, copied, copyEmail }: {
  item: Method;
  copied: boolean;
  copyEmail: () => void | Promise<void>;
}) {
  const reduceMotion = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 130, damping: 23 });
  const rotateY = useSpring(0, { stiffness: 130, damping: 23 });
  const Icon = { email: Mail, phone: Phone, chat: MessageCircle }[item.kind];
  const actionClass = "h-auto min-h-12 w-full justify-between gap-3 whitespace-normal rounded-xl border-accent/25 bg-background/80 px-4 py-3 text-left text-[11px] leading-5 text-primary shadow-[0_3px_0_rgba(165,139,101,0.12)]";

  return (
    <div className="group relative h-full [perspective:1000px]">
      <div aria-hidden="true" className="absolute inset-0 translate-x-[5px] translate-y-2 rounded-t-[70px] rounded-b-[22px] bg-accent/20" />
      <motion.article
        style={{ rotateX, rotateY }}
        onPointerMove={event => {
          if (reduceMotion || event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          rotateX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 13);
          rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 17);
        }}
        onPointerLeave={() => { rotateX.set(0); rotateY.set(0); }}
        onPointerCancel={() => { rotateX.set(0); rotateY.set(0); }}
        className="relative flex h-full flex-col rounded-t-[70px] rounded-b-[22px] border border-accent/20 bg-surface shadow-[0_35px_50px_-28px_rgba(70,50,25,0.5),0_8px_0_-3px_rgba(165,139,101,0.16),inset_0_1px_0_white] [transform-style:preserve-3d]"
      >
        {/* A raised metallic sculpture for each contact method */}
        <div aria-hidden="true" className="relative h-[175px] shrink-0 rounded-t-[70px] bg-[radial-gradient(ellipse_at_50%_15%,#eee4d1_0%,#f7f3eb_45%,#ffffff_85%)] [transform-style:preserve-3d]">
          <span className="absolute right-7 top-7 font-serif text-sm italic text-accent [transform:translateZ(18px)]">{item.number}</span>
          <div className="absolute left-1/2 top-[48%] size-[138px] rounded-full border border-accent/25 [transform:translate(-50%,-50%)_rotateX(58deg)_rotateY(-15deg)]" />
          <div className="absolute bottom-6 left-1/2 h-4 w-28 -translate-x-1/2 rounded-[50%] bg-accent/25 blur-lg" />
          <motion.div
            animate={reduceMotion ? { y: 0 } : { y: [-4, 4, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: Number(item.number) * 0.15 }}
            className="absolute left-1/2 top-[43%] size-[104px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
          >
            <div className="absolute inset-0 rounded-[28px] bg-[#765d37] shadow-[8px_12px_16px_rgba(65,45,20,0.25)] [transform:translateZ(27px)_translate(6px,7px)_rotate(-12deg)]" />
            <div className="absolute inset-0 flex items-center justify-center rounded-[28px] border border-[#f5e4bd] bg-[linear-gradient(135deg,#f8eac8_0%,#d1b47b_38%,#a8854b_75%,#dcc18e_100%)] text-[#4d3d24] shadow-[inset_2px_2px_3px_rgba(255,255,255,0.85),inset_-3px_-4px_7px_rgba(85,55,15,0.2)] [transform:translateZ(50px)_rotate(-12deg)]">
              <div className="absolute inset-2 rounded-[21px] border border-[#9d7e46]/25" />
              <Icon className="size-9" strokeWidth={1.15} />
              <div className="absolute left-3 top-2 h-2 w-11 -rotate-12 rounded-full bg-white/55 blur-sm" />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-7 [transform:translateZ(20px)] sm:px-7">
          <span className="block border-t border-accent/15 pt-5 text-[9px] uppercase leading-5 tracking-[0.22em] text-accent">{item.label}</span>

          {item.kind === "chat" ? (
            <h3 className="mt-3 min-h-[2.8em] font-serif text-2xl font-normal leading-[1.4] text-primary">{item.value}</h3>
          ) : (
            <a href={item.href} className={cn("mt-3 block min-h-[2.8em] leading-[1.4] text-primary [overflow-wrap:anywhere] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-accent", item.kind === "email" ? "text-[clamp(13px,1.3vw,17px)]" : "font-serif text-2xl")}>
              {item.value}
            </a>
          )}

          <p className="mt-3 min-h-12 text-xs leading-6 text-secondary">{item.description}</p>

          <div className="mt-auto pt-6">
            {item.kind === "email" ? (
              <Button variant="outline" onClick={copyEmail} className={actionClass}>
                <span aria-live="polite">{item.action}</span>
                {copied ? <Check className="size-4 shrink-0 text-accent" aria-hidden="true" /> : <ArrowUpRight className="size-4 shrink-0 text-accent" aria-hidden="true" />}
              </Button>
            ) : (
              <a href={item.href} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cn(buttonVariants({ variant: "outline" }), actionClass)}>
                <span>{item.action}</span><ArrowUpRight className="size-4 shrink-0 text-accent" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ContactMethods({ data, business, copied, copyEmail, whatsapp = contact.whatsapp }: Props) {
  const { t } = useLanguage();
  const info = t.companyContact;
  const phoneHref = info.phoneHref.replace(/^tel:/, "");

  const items: Method[] = [
    { kind: "email", number: "02", label: data.email.label, value: business.email, description: data.email.description, action: copied ? data.email.copied : data.email.copy, href: `mailto:${business.email}` },
    { kind: "phone", number: "03", label: info.phoneLabel, value: info.phoneDisplay, description: info.phoneDescription, action: info.call, href: `tel:${phoneHref}` },
    { kind: "chat", number: "04", label: data.whatsapp.label, value: data.whatsapp.title, description: whatsapp ? `+${whatsapp.replace(/\D/g, "")}` : data.whatsapp.description, action: whatsapp ? data.whatsapp.open : data.whatsapp.request, href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : `mailto:${business.email}?subject=${encodeURIComponent(data.whatsapp.request)}`, external: Boolean(whatsapp) },
  ];

  return (
    <section id="contact-methods" aria-labelledby="contact-methods-heading" className="scroll-mt-28 py-3">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <span className="block text-[9px] uppercase leading-6 tracking-[0.22em] text-accent">{data.contactMethods.eyebrow}</span>
          <h2 id="contact-methods-heading" className="mt-3 font-serif text-3xl font-normal leading-tight tracking-tight text-primary sm:text-4xl lg:text-[43px]">{data.contactMethods.title}</h2>
        </div>
        <p className="max-w-[340px] text-xs leading-6 text-secondary">{data.contactMethods.description}</p>
      </div>
            <div className="relative mb-10 rounded-[28px] border border-accent/30 bg-[#1c1a17] px-6 py-8 text-[#f1e8d8] shadow-[0_8px_0_-3px_rgba(165,139,101,0.22),0_25px_45px_-25px_rgba(30,25,15,0.45)] sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] bg-[radial-gradient(ellipse_at_12%_0%,rgba(187,153,95,0.24),transparent_60%)]" />
        <div className="relative grid items-center gap-7 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div className="flex items-center gap-5">
            <div aria-hidden="true" className="relative flex size-20 shrink-0 items-center justify-center [perspective:700px]">
              <div className="absolute inset-1 rounded-[24px] bg-[#765b33] shadow-[7px_9px_15px_rgba(0,0,0,0.4)] [transform:rotateY(-18deg)_rotateZ(-8deg)_translate(5px,6px)]" />
              <div className="absolute inset-1 flex items-center justify-center rounded-[24px] border border-[#f1dcb0] bg-[linear-gradient(135deg,#f4e2b7,#c3a16a_50%,#95713c)] text-[#4a381f] shadow-[inset_2px_2px_3px_rgba(255,255,255,0.7)] [transform:rotateY(-18deg)_rotateZ(-8deg)_translateZ(10px)]"><Building2 className="size-8" strokeWidth={1.2} /></div>
            </div>
            <div className="min-w-0">
              <span className="block text-[9px] uppercase leading-5 tracking-[0.2em] text-[#c8aa73]">{info.companyLabel}</span>
              <h3 className="mt-2 font-serif text-2xl leading-tight sm:text-3xl">{info.companyName}</h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#c8bba4]">
                <span className="inline-flex items-center gap-2"><UserRound className="size-3.5 text-[#c8aa73]" aria-hidden="true" />{info.personLabel}: {info.personName}</span>
                <a href={info.phoneHref} className="inline-flex items-center gap-2 rounded text-[#e6d1a7] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent"><Phone className="size-3.5" aria-hidden="true" />{info.phoneDisplay}</a>
              </div>
            </div>
          </div>
          <div className="min-w-0 rounded-2xl border border-accent/20 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#c8aa73]"><MapPin className="size-3.5" aria-hidden="true" />{info.addressLabel}</span>
            <address className="mt-3 text-xs leading-6 text-[#cec1ac] not-italic">{info.address}</address>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({variant:"ghost"}),"mt-3 h-auto gap-2 rounded-lg px-0 py-1 text-[10px] text-[#e4c992] hover:bg-transparent hover:text-white")}>{info.directions}<ArrowUpRight className="size-3" aria-hidden="true" /></a>
          </div>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-7 pb-3 md:grid-cols-3 lg:gap-8">
        {items.map(item => <MethodCard key={item.kind} item={item} copied={copied} copyEmail={copyEmail} />)}
      </div>
    </section>
  );
}
