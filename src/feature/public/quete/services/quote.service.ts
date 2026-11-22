import type { DemoReceipt, QuoteValues } from "../types/quote.types";
import { receiptStorageKey } from "../data/quote.config";
export async function previewQuote(values: QuoteValues): Promise<DemoReceipt> {
  const receipt: DemoReceipt = {
    reference: "DEMO-" + crypto.randomUUID().slice(0, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    type: values.type,
  };
  sessionStorage.setItem(receiptStorageKey, JSON.stringify(receipt));
  return receipt;
}
// No network requests. A server adapter must replace this for live sales inquiries.
