
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/src/providers";

// Sample luggage product renders matching your categories/uploaded images
const categoryShowcaseImages = [
  { id: 1, src: "/1.png", label: "Compact Gadget Case", spec: "Molded EVA + Carabiner" },
  { id: 2, src: "/2.png", label: "Business Travel Trolley", spec: "Textured Polycarbonate" },
  { id: 3, src: "/3.png", label: "Handheld Vanity Case", spec: "Leather Strap Accent" },
  { id: 4, src: "/4.png", label: "Modular Organizer Bag", spec: "Custom Velcro Dividers" },
  { id: 5, src: "/5.png", label: "Round Storage Shell", spec: "Orange Zip Accents" },
  { id: 6, src: "/6.png", label: "Round Yellow Travel Pod", spec: "Rigid Shell Protection" },
];

export default function FinalCtaSection() {
  const { t } = useLanguage();
  const data = t.finalCta;
  const [activeImage, setActiveImage] = useState(0);

  return (
    <footer className="bg-primary text-background pt-24 pb-12 overflow-hidden relative">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        
        {/* Top Split: Interactive 3D/Visual Showcase & Main CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left Column: Gorgeous Interactive Product Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center bg-surface/5 border border-border/20 rounded-3xl p-6 backdrop-blur-sm">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold tracking-widest text-accent uppercase">
                Interactive Showcase
              </span>
              <span className="text-xs text-secondary">
                {activeImage + 1} / {categoryShowcaseImages.length}
              </span>
            </div>

            {/* Main Interactive Image Stage */}
            <div className="relative h-64 w-full rounded-2xl bg-surface/10 overflow-hidden flex items-center justify-center border border-white/10 group">
              <Image
                src={categoryShowcaseImages[activeImage].src}
                alt={categoryShowcaseImages[activeImage].label}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-3 flex justify-between items-center text-xs text-white border border-white/10">
                <span className="font-semibold">{categoryShowcaseImages[activeImage].label}</span>
                <span className="text-accent">{categoryShowcaseImages[activeImage].spec}</span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="grid grid-cols-6 gap-2 w-full mt-4">
              {categoryShowcaseImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-12 rounded-lg overflow-hidden border transition-all ${
                    activeImage === idx ? "border-accent ring-2 ring-accent/40" : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.src} alt={img.label} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Premium CTA Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-6">
              {data.eyebrow}
            </span>

            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
              {data.title}
            </h2>

            <p className="mt-6 text-base md:text-lg text-white/70 leading-8 max-w-xl">
              {data.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-accent px-9 py-4 text-sm font-semibold text-primary transition-all duration-300 hover:bg-white hover:shadow-xl hover:scale-105"
              >
                {data.button}
                <span className="text-lg">→</span>
              </Link>

              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-xs">ISO</div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-xs">BSCI</div>
                </div>
                <span>Certified OEM/ODM Partner <br />Direct Factory Pricing</span>
              </div>
            </div>
          </div>

        </div>

        {/* Core Categories Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-t border-b border-white/10 mb-16">
          {data.categories.map((cat, idx) => (
            <div key={idx} className="group p-5 rounded-2xl bg-surface/5 border border-white/5 transition-all hover:border-accent/40">
              <div className="text-xs font-bold text-accent mb-2">0{idx + 1} // CATEGORY</div>
              <h4 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">{cat.name}</h4>
              <p className="mt-2 text-xs text-white/60 leading-6">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact & Company Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-accent flex items-center justify-center text-primary font-bold text-xs">G</div>
              <span className="font-bold tracking-wider uppercase text-sm text-white">Global Luggage Mfg.</span>
            </div>
            <p className="text-xs text-white/60 leading-6">
              World-class hardshell luggage, travel trolleys, and precision molded accessory case manufacturing for global brands.
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Headquarters</h5>
            <p className="text-xs text-white/70 leading-6">{data.contactInfo.address}</p>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Direct Inquiry</h5>
            <p className="text-xs text-white/70 leading-6">Phone: {data.contactInfo.phonePrimary}</p>
            <p className="text-xs text-white/70 leading-6 mt-1">Email: {data.contactInfo.email}</p>
          </div>

          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Showroom Status</h5>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Accepting Q3/Q4 OEM Orders
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{data.footer.copyright}</p>
          <div className="flex flex-wrap gap-6">
            {data.footer.links.map((link, idx) => (
              <a key={idx} href="#" className="hover:text-accent transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}