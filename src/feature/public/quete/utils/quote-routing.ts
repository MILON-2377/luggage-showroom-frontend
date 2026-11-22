import type { QuoteValues } from "../types/quote.types";
export function getRoutingContext(v: QuoteValues) {
  return {
    country: v.country.trim(),
    productFamily: v.category,
    requestType: v.type,
  };
}
// A future server maps this context to configured sales rules. No recipient is invented here.
