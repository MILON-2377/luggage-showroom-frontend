import { NotFoundState } from "@/src/feature/common";

export default function DashboardNotFoundPage() {
  return (
    <NotFoundState
      title="Dashboard route not found"
      description="This dashboard section or item does not exist or is no longer available."
      primaryHref="/dashboard"
      primaryLabel="Dashboard Overview"
    />
  );
}