type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-[var(--surface-muted)] ${className}`}
    />
  );
}

type DashboardTableSkeletonProps = {
  rows?: number;
  columns?: number;
  showHeaderAction?: boolean;
};

export function DashboardTableSkeleton({
  rows = 6,
  columns = 5,
  showHeaderAction = true,
}: DashboardTableSkeletonProps) {
  return (
    <div className="space-y-6 p-6" aria-busy="true" aria-label="Loading table">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        {showHeaderAction && <Skeleton className="h-8 w-32 rounded-lg" />}
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-12 gap-4 border-b border-[var(--border)] bg-[var(--surface-muted)]/60 px-4 py-3">
          {Array.from({ length: columns }).map((_, idx) => (
            <Skeleton
              key={`head-${idx}`}
              className={idx === 0 ? "col-span-4 h-3" : "col-span-2 h-3"}
            />
          ))}
        </div>

        <div className="divide-y divide-[var(--border)]">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className="grid grid-cols-12 items-center gap-4 px-4 py-3.5"
            >
              {Array.from({ length: columns }).map((__, colIdx) => (
                <Skeleton
                  key={`cell-${rowIdx}-${colIdx}`}
                  className={colIdx === 0 ? "col-span-4 h-4" : "col-span-2 h-4"}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type DashboardFormSkeletonProps = {
  sections?: number;
};

export function DashboardFormSkeleton({
  sections = 2,
}: DashboardFormSkeletonProps) {
  return (
    <div className="space-y-6 p-6" aria-busy="true" aria-label="Loading form">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {Array.from({ length: sections }).map((_, secIdx) => (
        <div
          key={`sec-${secIdx}`}
          className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-60" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2.5">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div
      className="space-y-6 p-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-3.5 w-80" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={`kpi-${idx}`}
            className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <Skeleton className="mb-4 h-4 w-40" />
        <Skeleton className="h-52 w-full rounded-lg" />
      </div>
    </div>
  );
}