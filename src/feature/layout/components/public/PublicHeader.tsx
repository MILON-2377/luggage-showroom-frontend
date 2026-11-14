import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { PublicNavigation } from "./PublicNavigation";
import { MobileNavigation } from "./MobileNavigation";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-all supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label="BAGGUAGE Home"
          className="group flex shrink-0 items-center gap-2 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <span className="text-2xl font-extrabold tracking-widest text-foreground uppercase transition-colors group-hover:text-primary">
            BAGGUAGE
          </span>
          <span className="size-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <PublicNavigation />
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ variant:"default", size:"default"}),
              "group gap-1.5 font-semibold shadow-sm transition-all hover:shadow-md"
            )}
          >
            <span>Request a Quote</span>
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center lg:hidden">
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}