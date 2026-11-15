"use client";
import { useLanguage } from "@/src/providers";
import type { ProductDetailData } from "./type/product-details.types";
export default function ProductDimensions({
  details,
}: {
  details: ProductDetailData;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const d = details.dimensions;
  return (
    <div className="grid items-center gap-7 md:grid-cols-2">
      <div className="rounded-3xl border border-accent/20 bg-background p-6">
        <svg
          viewBox="0 0 360 260"
          role="img"
          aria-label={c.dimensionDiagram}
          className="w-full text-accent"
        >
          <path
            d="M100 80L135 55L275 65L295 95L280 200L100 190Z"
            fill="currentColor"
            opacity=".12"
          />
          <rect
            x="80"
            y="80"
            width="180"
            height="115"
            rx="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M140 80V60Q140 40 170 40Q200 40 200 60V80M80 137H260"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M80 220H260M80 214V226M260 214V226M55 80V195M49 80H61M49 195H61"
            stroke="currentColor"
          />
          <text
            x="170"
            y="245"
            textAnchor="middle"
            fill="currentColor"
            fontSize="12"
          >
            {c.length}: {d ? d.length + " " + d.unit : c.pendingShort}
          </text>
          <text
            x="20"
            y="140"
            textAnchor="middle"
            fill="currentColor"
            fontSize="12"
            transform="rotate(-90 20 140)"
          >
            {c.height}: {d ? d.height + " " + d.unit : c.pendingShort}
          </text>
        </svg>
        <p className="text-center text-[10px] text-secondary">
          {c.diagramNote}
        </p>
      </div>
      <div>
        <h3 className="font-serif text-2xl">{c.dimensionTitle}</h3>
        <p className="mt-4 text-sm leading-8 text-secondary">
          {c.dimensionNote}
        </p>
        <dl className="mt-5 divide-y divide-border">
          {[
            [c.length, d?.length],
            [c.width, d?.width],
            [c.height, d?.height],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="flex justify-between gap-4 py-3 text-xs"
            >
              <dt className="text-secondary">{label}</dt>
              <dd>
                {value !== undefined
                  ? String(value) + " " + d?.unit
                  : c.pending}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
