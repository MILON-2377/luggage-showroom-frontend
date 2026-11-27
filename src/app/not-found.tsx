import { NotFoundState } from "@/src/feature/common";

export default function GlobalNotFoundPage() {
  return (
    <NotFoundState
      title="Page not found"
      description="We couldn't find the page you requested. Check the URL or return to the main workspace."
      primaryHref="/"
      primaryLabel="Back to Home"
    />
  );
}
