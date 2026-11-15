export interface ProductDetailData {
  slug?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "mm";
  };
  weightGrams?: number;
  minimumOrder?: number;
  leadTimeDays?: { min: number; max: number };
  closure?: "zipper" | "magnetic" | "drawstring";
  lining?: "polyester" | "fabric";
  colors?: { id: string; hex: string; images?: string[] }[];
  detailImages?: string[];
}
