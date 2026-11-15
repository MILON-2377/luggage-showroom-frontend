export type Category = "eva" | "pencil" | "medical" | "toiletry" | "electronics" | "automotive" | "makeup" | "travel" | "tools" | "handbags" | "party" | "backpacks" | "documents" | "tote" | "shoulder" | "crossbody" | "clutch" | "bucket" | "mini" | "satchel" | "belt" | "shopping" | "duffel";
export type Material = "eva" | "pu" | "pvc" | "polyester";
export type Customization = "logo" | "color" | "packaging";
export interface Product {
  id: string;
  category: Category;
  materials: Material[];
  customization: Customization[];
  images: string[];
}
export interface Option {
  id: string;
  label: string;
}
export interface ProductCopy {
  name: string;
  description: string;
}
