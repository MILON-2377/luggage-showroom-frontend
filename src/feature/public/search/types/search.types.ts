export interface SearchProduct {
  id: string;
  categoryId: string;
  category: string;
  name: string;
  description: string;
  image?: string;
  href: string;
  keywords: string;
}

export interface SearchCategory {
  id: string;
  label: string;
  href: string;
}

export interface SearchResultsData {
  products: SearchProduct[];
  categories: SearchCategory[];
}