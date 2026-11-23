"use client";

import { Suspense, useState, type PointerEvent } from "react";
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

// ... keep tiltCard and resetCard as-is ...

function MobileNavigationLinks({
  navigationLabels,
  ariaLabel,
  onNavigate,
}: {
  navigationLabels: Record<string, string>;
  ariaLabel: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel} className="relative flex flex-col gap-4 px-6 pb-8">
      {publicNavigation.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        return (
          <div key={item.href} className="relative [perspective:900px]">
            {/* ... existing card markup, using onClick={onNavigate} on <Link> ... */}
          </div>
        );
      })}
    </nav>
  );
}

export function MobileNavigation() {
  const { t } = useLanguage();
  const c = t.mobileNavigation;
  const [open, setOpen] = useState(false);

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
          {/* ... existing ambient lighting & SheetHeader ... */}

          <Suspense fallback={null}>
            <MobileNavigationLinks
              navigationLabels={navigationLabels}
              ariaLabel={c.navigationLabel}
              onNavigate={() => setOpen(false)}
            />
          </Suspense>

          {/* ... existing bottom Request Quote footer ... */}
        </SheetContent>
      </Sheet>
    </div>
  );
}