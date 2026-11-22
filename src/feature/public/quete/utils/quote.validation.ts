import type { QuoteValues } from "../types/quote.types";
export function localDate() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
export function validateQuote(v: QuoteValues) {
  if (
    ![v.name, v.company, v.country, v.message].every((x) => x.trim()) ||
    !/^\S+@\S+\.\S+$/.test(v.email.trim()) ||
    !v.consent ||
    v.website ||
    !["product", "sample", "custom"].includes(v.type)
  )
    return "error";
  if (v.quantity && (!/^\d+$/.test(v.quantity) || Number(v.quantity) <= 0))
    return "invalidQuantity";
  if (v.price && (!Number.isFinite(Number(v.price)) || Number(v.price) <= 0))
    return "invalidPrice";
  if (v.delivery && v.delivery < localDate()) return "invalidDate";
  return null;
}
