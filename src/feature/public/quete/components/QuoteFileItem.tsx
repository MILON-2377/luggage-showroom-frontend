import { FileText, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteFileItem({
  file,
  remove,
  copy,
}: {
  file: File;
  remove: () => void;
  copy: QuoteCopy;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
      <FileText className="size-5 shrink-0 text-accent" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </span>
      </span>
      <Button
        size="icon"
        variant="ghost"
        aria-label={copy.upload.remove + ": " + file.name}
        onClick={remove}
      >
        <X className="size-4" />
      </Button>
    </li>
  );
}
