"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/src/components/ui/pagination";

import { useLanguage } from "@/src/providers";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function ProductPagination({
  page,
  totalPages,
  onChange,
}: ProductPaginationProps) {
  const { t } = useLanguage();
  const c = t.productPage;

  if (totalPages < 2) return null;

  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const visiblePages = Array.from(
    new Set(
      [
        1,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages,
      ].filter((value) => value >= 1 && value <= totalPages),
    ),
  ).sort((a, b) => a - b);

  const items: Array<{
    key: string;
    page?: number;
  }> = [];

  visiblePages.forEach((value, index) => {
    const previous = visiblePages[index - 1];

    if (previous !== undefined) {
      if (value - previous === 2) {
        items.push({
          key: `page-${previous + 1}`,
          page: previous + 1,
        });
      } else if (value - previous > 2) {
        items.push({
          key: `ellipsis-${value}`,
        });
      }
    }

    items.push({
      key: `page-${value}`,
      page: value,
    });
  });

  return (
    <div className="mt-10 border-t border-border pt-7">
      <Pagination aria-label={c.pagination}>
        <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-1.5">
          {/* Previous page */}
          <PaginationItem>
            <PaginationLink
              disabled={currentPage <= 1}
              onClick={() => onChange(currentPage - 1)}
              aria-label={c.previous}
              className="gap-2 rounded-full border border-border bg-surface sm:w-auto sm:px-3"
            >
              <ChevronLeft
                className="size-4"
                aria-hidden="true"
              />

              <span className="hidden sm:inline">
                {c.previous}
              </span>
            </PaginationLink>
          </PaginationItem>

          {/* Page numbers */}
          {items.map((item) => (
            <PaginationItem key={item.key}>
              {item.page === undefined ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={item.page === currentPage}
                  aria-label={`${c.page} ${item.page}`}
                  onClick={() => {
                    if (item.page !== undefined) {
                      onChange(item.page);
                    }
                  }}
                  className="rounded-full"
                >
                  {item.page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next page */}
          <PaginationItem>
            <PaginationLink
              disabled={currentPage >= totalPages}
              onClick={() => onChange(currentPage + 1)}
              aria-label={c.next}
              className="gap-2 rounded-full border border-border bg-surface sm:w-auto sm:px-3"
            >
              <span className="hidden sm:inline">
                {c.next}
              </span>

              <ChevronRight
                className="size-4"
                aria-hidden="true"
              />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p
        aria-live="polite"
        className="mt-4 text-center text-xs tabular-nums text-secondary"
      >
        {c.page} {currentPage} / {totalPages}
      </p>
    </div>
  );
}