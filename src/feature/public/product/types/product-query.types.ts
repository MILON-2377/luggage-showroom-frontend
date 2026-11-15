import type { Category, Material, Customization } from "./product.types";
export type ProductSortValue = "featured" | "name-asc" | "name-desc";
export interface ProductQuery {
  search: string;
  categories: Category[];
  materials: Material[];
  customization: Customization[];
  sort: ProductSortValue;
  page: number;
  pageSize: number;
}
export type QueryPatch = Partial<ProductQuery>;
export interface FilterProps {
  query: ProductQuery;
  onChange: (patch: QueryPatch) => void;
}
