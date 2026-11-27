import { Suspense } from "react";

import { EditCategoryView } from "@/src/feature/dashboard/catalog/components/categories/EditCategoryView";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

async function EditCategoryContent({ params }: EditCategoryPageProps) {
  const { id } = await params;

  return <EditCategoryView categoryId={decodeURIComponent(id)} />;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-xs text-[var(--muted-foreground)]">
              Loading category editor...
            </p>
          </div>
        </div>
      }
    >
      <EditCategoryContent params={params} />
    </Suspense>
  );
}