"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/src/providers";
export default function ProductBreadcrumbs({ name }: { name: string }) {
  const { t } = useLanguage();
  const c = t.productDetails;
  return (
    <nav
      aria-label={c.breadcrumb}
      className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-7 text-[10px] text-secondary sm:px-6 lg:px-8"
    >
      <Link href="/" className="hover:text-primary">
        {c.home}
      </Link>
      <ChevronRight className="size-3 text-accent" aria-hidden="true" />
      <Link href="/product" className="hover:text-primary">
        {c.products}
      </Link>
      <ChevronRight className="size-3 text-accent" aria-hidden="true" />
      <span aria-current="page" className="text-primary">
        {name}
      </span>
    </nav>
  );
}
