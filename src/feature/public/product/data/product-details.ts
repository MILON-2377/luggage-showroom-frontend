import type { Product } from "../components/types/product.types";
import type { ProductDetailData } from "../components/details/type/product-details.types";
// Add confirmed specifications here. Empty fields are shown as awaiting confirmation.
export const productDetails: Record<string, ProductDetailData> = {
  c01: { slug: "essential-eva-case" },
  c02: { slug: "digital-companion" },
  c03: { slug: "creative-pencil-case" },
  c04: { slug: "first-aid-organizer" },
  c05: { slug: "travel-toiletry-bag" },
  c06: { slug: "automotive-organizer" },
  c07: { slug: "tech-archive" },
  c08: { slug: "signature-eva-case" },
};
export function getProductSlug(product: Product) {
  return productDetails[product.id]?.slug || product.id;
}

// Requested custom-color preferences; availability must be confirmed.
export const customColorPalette: NonNullable<ProductDetailData["colors"]> = [
  {id:"black",hex:"#202020"}, {id:"beige",hex:"#d7c8b1"},
  {id:"brown",hex:"#78533d"}, {id:"pink",hex:"#d6a4af"},
  {id:"red",hex:"#8b3441"}, {id:"navy",hex:"#293b54"},
  {id:"white",hex:"#f4f1e9"},
];
