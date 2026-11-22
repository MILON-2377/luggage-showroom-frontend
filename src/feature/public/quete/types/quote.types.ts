import type en from "@/src/providers/dictionaries/en";
export type QuoteCopy = typeof en.quotePage;
export type RequestType = "product" | "sample" | "custom";
export interface QuoteValues {
  name: string;
  company: string;
  email: string;
  country: string;
  type: RequestType;
  message: string;
  phone: string;
  category: string;
  models: string;
  quantity: string;
  price: string;
  currency: string;
  delivery: string;
  customization: string;
  consent: boolean;
  website: string;
}
export type TextField = Exclude<keyof QuoteValues, "consent" | "type">;
export type UpdateField = <K extends keyof QuoteValues>(
  key: K,
  value: QuoteValues[K],
) => void;
export interface FieldProps {
  copy: QuoteCopy;
  values: QuoteValues;
  update: UpdateField;
}
export interface DemoReceipt {
  reference: string;
  createdAt: string;
  type: RequestType;
}
