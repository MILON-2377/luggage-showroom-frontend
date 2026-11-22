import { Badge } from "@/src/components/ui/badge";
import { FileCheck2 } from "lucide-react";
import type { QuoteCopy, DemoReceipt } from "../types/quote.types";
export default function QuoteReferenceCard({
  copy,
  receipt,
}: {
  copy: QuoteCopy;
  receipt: DemoReceipt;
}) {
  return (
    <section className="mt-8 rounded-2xl border border-accent/30 bg-white p-6 shadow-[4px_5px_0_#c5b083]">
      <FileCheck2 className="mx-auto size-8 text-accent" />
      <p className="mt-4 text-sm text-muted-foreground">
        {copy.submitted.reference}
      </p>
      <Badge variant="outline" className="mt-3 px-4 py-2 font-mono text-lg">
        {receipt.reference}
      </Badge>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {copy.submitted.referenceNote}
      </p>
    </section>
  );
}
