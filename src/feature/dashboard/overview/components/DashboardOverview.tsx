"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers3, ClipboardList, Users, Clock3 } from "lucide-react";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/src/components/ui/table";
import { useLanguage } from "@/src/providers";

export interface DashboardCollectionCard {
  id: string;
  src: string;
  title: string;
  reference?: string;
  href: string;
}
export interface DashboardActivityRow {
  id: string;
  time: string;
  area: string;
  action: string;
  status: string;
}
export interface DashboardOverviewProps {
  products?: readonly DashboardCollectionCard[];
  activity?: readonly DashboardActivityRow[];
}

function ActionMedallion({ small = false }: { small?: boolean }) {
  return (
    <span aria-hidden="true" className={`relative inline-flex shrink-0 items-center justify-center rounded-full border border-[#fae3b4] bg-[conic-gradient(from_35deg,#c89b5c,#fff0c7,#c69a5d,#f0d096,#a7773e,#f7dcaa,#c89b5c)] p-[3px] shadow-[0_3px_0_#745032,0_5px_12px_#00000066,inset_0_1px_0_#fff7e5] transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_0_#745032,0_0_22px_#d5ae6540] motion-reduce:transform-none motion-reduce:transition-none ${small ? "size-9" : "size-11"}`}>
      <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full border border-[#a47a43] bg-gradient-to-br from-[#f9e4b8] via-[#dcc08b] to-[#b48b51] text-[#4b2b20] shadow-[inset_0_1px_2px_#fff7e5,inset_0_-1px_2px_#8c613c66]">
        <ArrowUpRight className="absolute size-[18px] transition-transform duration-300 group-hover:-translate-y-7 group-hover:translate-x-7 motion-reduce:transition-none" strokeWidth={1.5}/>
        <ArrowUpRight className="absolute size-[18px] -translate-x-7 translate-y-7 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none" strokeWidth={1.5}/>
      </span>
    </span>
  );
}

function trackCard(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--rx", `${(0.5 - (event.clientY - rect.top) / rect.height) * 4}deg`);
  event.currentTarget.style.setProperty("--ry", `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`);
}
function resetCard(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty("--rx", "0deg");
  event.currentTarget.style.setProperty("--ry", "0deg");
}

function CollectionCard({ item, caption, manage, active }: {
  item: DashboardCollectionCard; caption: string; manage: string; active: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Link href={item.href} onPointerMove={trackCard} onPointerLeave={resetCard} className={`group relative isolate flex min-w-0 flex-col rounded-t-[160px] rounded-b-[26px] border p-[5px] text-[#f2e4cd] outline-none [transform:perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#f1d39e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#211b19] motion-reduce:transform-none motion-reduce:transition-none ${active ? "border-[#eac78c] bg-[linear-gradient(120deg,#fff0b930,#8b553b50_15%,#d7ab6560_50%,#40251f_80%,#f8d9a666)] shadow-[3px_5px_0_#695037,0_10px_28px_#00000060,inset_0_1px_0_#fff2cc]" : "border-[#b69a70]/70 bg-gradient-to-br from-[#eacb9326] via-[#6d574126] to-[#b2915c40] shadow-[3px_5px_0_#3b3129,0_10px_28px_#00000050,inset_0_1px_0_#fff0cb66] hover:border-[#e8c281] hover:shadow-[3px_6px_0_#6a5034,0_20px_32px_#00000070]"}`}>
      <div className="relative isolate aspect-[.90/1] overflow-hidden rounded-t-[154px] rounded-b-[14px] border border-[#c6a576]/50 bg-[#30251c] shadow-[inset_0_1px_0_#fff0ca]">
        <Image src="/alcove.webp" alt="" fill unoptimized sizes="(min-width:1280px) 25vw,(min-width:640px) 50vw,100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-1 rounded-t-[149px] rounded-b-[10px] border border-[#fff0c7]/20 shadow-[inset_0_2px_0_#ffe5b966]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#140d0700] via-transparent to-[#20140c33]"/>
        {failed ? <div className="absolute inset-x-5 bottom-1/3 flex justify-center"><Layers3 className="size-10 text-[#d0b07a]" aria-hidden="true" /></div> : <div className="absolute inset-x-[7%] bottom-[17%] top-[13%] transition-transform duration-500 group-hover:-translate-y-3 group-hover:scale-[1.04] group-focus-visible:-translate-y-2 motion-reduce:transform-none motion-reduce:transition-none"><Image key={item.src} src={item.src} alt="" fill unoptimized sizes="(min-width:1280px) 250px,(min-width:640px) 40vw,80vw" onError={() => setFailed(true)} className="object-contain drop-shadow-[0_12px_7px_#00000080]" /></div>}
        <span aria-hidden="true" className="absolute left-1/2 top-5 h-[3px] w-10 -translate-x-1/2 rounded-full bg-[#fff5d4] shadow-[0_0_16px_6px_#ffd38740]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#ffe7b7]/20 to-transparent transition-[left] duration-700 group-hover:left-[150%] motion-reduce:hidden" />
      </div>
      <div className={`relative flex flex-1 flex-col rounded-b-[21px] px-4 pb-4 pt-5 ${active ? "bg-[radial-gradient(ellipse_at_0%_0%,#793940_0%,#42202a_70%,#2c1a22_100%)]" : "bg-[linear-gradient(145deg,#332c27,#211e1c)]"}`}>
        <p className="text-[9px] uppercase tracking-[.16em] text-[#c8ad88]">{caption}{item.reference ? ` · ${item.reference}` : ""}</p>
        <h3 className="mt-2 min-h-[60px] font-serif text-[27px] leading-[1.12] tracking-tight">{item.title}</h3>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#d7b77e]/25 pt-4">
          <span className="font-serif text-base italic text-[#ead6b6]">{manage}</span><ActionMedallion/>
        </div>
      </div>
    </Link>
  );
}

export function DashboardOverview({ products, activity = [] }: DashboardOverviewProps) {
  const { t } = useLanguage();
  const c = t.dashboardAtelier;
  const cards: readonly DashboardCollectionCard[] = products ?? [
    { id: "case", src: "/1.png", title: c.case, href: "/dashboard/catalog/products" },
    { id: "wristlet", src: "/3.png", title: c.wristlet, href: "/dashboard/catalog/products" },
    { id: "organizer", src: "/4.png", title: c.organizer, href: "/dashboard/catalog/products" },
    { id: "round", src: "/bag-closed-pink.png", title: c.round, href: "/dashboard/catalog/products" },
  ];
  const workspaces = [
    { title: c.catalog, description: c.catalogDescription, Icon: Layers3, href: "/dashboard/catalog" },
    { title: c.orders, description: c.ordersDescription, Icon: ClipboardList, href: "/dashboard/orders" },
    { title: c.customers, description: c.customersDescription, Icon: Users, href: "/dashboard/customers" },
  ];
  return (
    <section className="space-y-8 text-[#eee1c9] sm:space-y-10">
      <header className="relative flex flex-col justify-between gap-6 border-b border-[#d5b581]/25 pb-8 xl:flex-row xl:items-end">
        <div><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#e0b97b]">{c.eyebrow}</p><h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[1.08] tracking-tight sm:text-[48px] lg:text-[52px]">{c.title}</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-[#c6bcad]">{c.description}</p></div>
        <Link href="/dashboard/catalog/products" className={cn(buttonVariants({variant:"outline"}),"group h-auto shrink-0 gap-6 self-start rounded-full border-[#c5a36b]/70 bg-[linear-gradient(145deg,#652a36,#301922)] py-2 pl-6 pr-2 text-sm text-[#f7e5c8] shadow-[0_4px_0_#261619,inset_0_1px_0_#f3d69955,0_6px_20px_#00000040] hover:bg-[#582731] hover:text-[#fff0d3]")}>{c.manageProducts}<ActionMedallion/></Link>
      </header>
      <div className="grid gap-4 xl:grid-cols-3">
        {workspaces.map(({ title, description, Icon, href }) => <Link key={href} href={href} className="group relative flex items-start gap-4 rounded-[20px] border border-[#bba27d]/35 bg-gradient-to-br from-[#ffffff10] to-[#ffffff02] p-5 shadow-[inset_0_1px_0_#fff2cb12,0_5px_12px_#00000020] backdrop-blur-md outline-none transition-[background-color,border-color] hover:border-[#ddbc84]/70 hover:bg-[#d1ae75]/10 focus-visible:ring-2 focus-visible:ring-[#e8c48b]"><Icon className="mt-0.5 size-11 shrink-0 rounded-[14px] border border-[#bca06e]/40 bg-gradient-to-br from-[#e4be7b]/15 to-transparent p-2.5 text-[#e4c38d] shadow-[0_3px_0_#13100d40,inset_0_1px_0_#fff2cc22]" strokeWidth={1.3} aria-hidden="true"/><div className="min-w-0 flex-1 border-l border-[#b69a70]/30 pl-4"><h2 className="font-serif text-lg leading-6">{title}</h2><p className="mt-1 text-xs leading-6 text-[#c0b5a4]">{description}</p><span className="mt-3 inline-flex items-center gap-2 text-[11px] text-[#e0bd83]">{c.open}<span className="ml-1 flex size-6 items-center justify-center rounded-full border border-[#d7b77e]/40 bg-[#e0bc7b]/10"><ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true"/></span></span></div></Link>)}
      </div>
      <section aria-labelledby="atelier-collection-title">
        <div className="mb-5"><div className="flex items-center gap-6"><h2 id="atelier-collection-title" className="shrink-0 font-serif text-3xl sm:text-4xl">{c.collection}</h2><div aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-[#c9a873]/70 to-transparent"/></div><p className="mt-2 text-sm text-[#c6bcad]">{c.collectionDescription}</p></div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards.map((item,index) => <CollectionCard key={`${item.id}:${item.src}`} item={item} caption={c.reference} manage={c.manage} active={index === 0}/>)}</div>
        <p className="mt-4 text-[11px] leading-6 text-[#b3a797]">{c.referenceNote}</p>
      </section>
      <section aria-labelledby="atelier-activity-title">
        <div className="mb-4 flex items-center gap-6"><h2 id="atelier-activity-title" className="font-serif text-2xl sm:text-3xl">{c.activity}</h2><div aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-[#c9a873]/60 to-transparent"/></div>
        <div className="overflow-hidden rounded-[22px] border border-[#bba27d]/40 bg-white/[0.035] shadow-[inset_0_1px_0_#ffffff10] [&_th]:text-[#d2c4af] [&_td]:text-[#ded2bd] [&_tr]:border-[#9c8867]/25 [&_tr:hover]:bg-[#d7b57c]/5">
          <Table><TableHeader><TableRow><TableHead>{c.time}</TableHead><TableHead>{c.area}</TableHead><TableHead>{c.action}</TableHead><TableHead>{c.status}</TableHead></TableRow></TableHeader><TableBody>{activity.length ? activity.map(row => <TableRow key={row.id}><TableCell className="whitespace-nowrap">{row.time}</TableCell><TableCell>{row.area}</TableCell><TableCell>{row.action}</TableCell><TableCell><span className="inline-flex rounded-md border border-[#c6a971]/30 bg-[#c6a971]/10 px-2 py-1 text-xs text-[#e0c491]">{row.status}</span></TableCell></TableRow>) : <TableRow><TableCell colSpan={4}><div className="flex items-center justify-center gap-3 py-6 text-xs text-[#bfb29f]"><Clock3 className="size-4 text-[#c6a66e]" aria-hidden="true"/>{c.emptyActivity}</div></TableCell></TableRow>}</TableBody></Table>
        </div>
      </section>
    </section>
  );
}
