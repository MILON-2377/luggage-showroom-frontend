"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/src/components/ui/table";
import { useLanguage } from "@/src/providers";
import type { Product } from "../types/product.types";
import type { ProductDetailData } from "./type/product-details.types";
export default function ProductSpecifications({
  product,
  details,
}: {
  product: Product;
  details: ProductDetailData;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const p = t.productPage;
  const rows = [
    [
      c.productFamily,
      p.categories.find((v) => v.id === product.category)?.label || c.pending,
    ],
    [
      c.materialLabel,
      product.materials
        .map((id) => p.materials.find((v) => v.id === id)?.label)
        .join(" / ") || c.pending,
    ],
    [c.closure, details.closure ? c.closureNames[details.closure] : c.pending],
    [c.lining, details.lining ? c.liningNames[details.lining] : c.pending],
    [
      c.dimensions,
      details.dimensions
        ? [details.dimensions.length, details.dimensions.width, details.dimensions.height].join(" × ") +
          " " +
          details.dimensions.unit
        : c.pending,
    ],
    [
      c.weight,
      details.weightGrams !== undefined
        ? details.weightGrams + " g"
        : c.pending,
    ],
    [
      c.minimumOrder,
      details.minimumOrder !== undefined
        ? String(details.minimumOrder)
        : c.pending,
    ],
    [
      c.leadTime,
      details.leadTimeDays
        ? details.leadTimeDays.min +
          "–" +
          details.leadTimeDays.max +
          " " +
          c.days
        : c.pending,
    ],
  ];
  return (
    <div>
      <p className="mb-5 text-sm leading-8 text-secondary">{c.specNote}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{c.specification}</TableHead>
            <TableHead>{c.value}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell className="w-1/3 min-w-36 text-xs text-secondary">
                {label}
              </TableCell>
              <TableCell className="text-xs leading-7">{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
