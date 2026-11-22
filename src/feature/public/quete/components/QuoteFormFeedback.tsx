import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { CircleAlert } from "lucide-react";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteFormFeedback({
  copy,
  error,
}: {
  copy: QuoteCopy;
  error: string;
}) {
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <CircleAlert className="size-4" />
      <AlertTitle>{copy.form.errorTitle}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
