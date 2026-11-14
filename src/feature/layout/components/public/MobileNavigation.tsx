import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

import { buttonVariants } from "@/src/components/ui/button";
import { publicNavigation } from "@/src/feature/config/public-navigation";

export function MobileNavigation() {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
          }
        />

        <SheetContent side="right" className="w-[300px] sm:w-[360px]">
          <SheetHeader>
            <SheetTitle className="text-left">BAGGUAGE</SheetTitle>
          </SheetHeader>

          <nav
            aria-label="Mobile navigation"
            className="mt-8 flex flex-col gap-1"
          >
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6">
            <Link
              href="/contact"
              className={buttonVariants({ className: "w-full" })}
            >
              Request a Quote
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}