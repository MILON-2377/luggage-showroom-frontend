import { Package, Layers3 } from "lucide-react";
import type { QuoteCopy, QuoteValues } from "../types/quote.types";
export default function QuoteInquirySummary({
  copy,
  values,
  fileCount,
}: {
  copy: QuoteCopy;
  values: QuoteValues;
  fileCount: number;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-[#bca16b]/40 bg-gradient-to-br from-[#373125] to-[#171715] p-7 text-[#f3ecdb] shadow-[6px_8px_0_#aa9160,0_25px_45px_-20px_#0008]">
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full border border-[#d4b879]/20" />
      <Layers3 className="mb-8 size-9 text-[#cfb57d]" strokeWidth={1} />
      <p className="text-xs uppercase tracking-[.18em] text-[#cfb57d]">
        {copy.summary.eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-3xl leading-tight">
        {copy.summary.title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[#dbd3c3]">
        {copy.summary.description}
      </p>
      <dl className="mt-8 divide-y divide-white/10">
        {[
          [
            copy.summary.type,
            copy.types.find((t) => t.id === values.type)?.title,
          ],
          [
            copy.summary.category,
            values.category
              ? copy.categories[Number(values.category)]
              : copy.summary.pending,
          ],
          [copy.summary.quantity, values.quantity || copy.summary.pending],
          [copy.summary.files, String(fileCount)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-5 py-4 text-sm"
          >
            <dt className="text-[#c9bfa8]">{label}</dt>
            <dd className="max-w-[60%] break-words text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 flex gap-2 border-t border-white/10 pt-5 text-xs leading-6 text-[#c9bfa8]">
        <Package className="mt-1 size-4 shrink-0" />
        {copy.summary.note}
      </p>
    </section>
  );
}
