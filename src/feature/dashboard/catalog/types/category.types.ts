export type CategoryStatus = "draft" | "active" | "archived";

export type CategoryViewMode = "tree" | "flat";

export type CategoryMediaRole = "image" | "thumbnail" | "banner";

export type CategoryAttributeAssignment = {
  attribute_id: string;
  is_required: boolean;
  display_order: number;
};

export type CategoryAttributeDetail = CategoryAttributeAssignment & {
  name: string;
  slug: string | null;
  description: string | null;
  data_type: string;
  unit: string | null;
  is_custom_allowed: boolean;
};

export type CategoryMediaAssignment = {
  media_asset_id: string;
  media_role: CategoryMediaRole;
  display_order: number;
};

export type CategoryMediaItem = CategoryMediaAssignment & {
  url: string;
};

export type CategoryItem = {
  category_id: string;
  parent_id: string | null;
  parent_name?: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  display_order: number;
  status: CategoryStatus | string;
  attributes?: (CategoryAttributeAssignment | CategoryAttributeDetail)[];
  media: CategoryMediaItem[];
  children?: string[];
};

export type CategoryPagination = {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_previous: boolean;
  has_next: boolean;
};

export type CategoryListResponse = {
  items: CategoryItem[];
  pagination: CategoryPagination;
};

export type ListCategoriesParams = {
  search?: string | null;
  status?: CategoryStatus | null;
  parent_id?: string | null;
  view?: CategoryViewMode;
  page?: number;
  page_size?: number;
};

export type CreateCategoryRequest = {
  parent_id?: string | null;
  name: string;
  description?: string | null;
  display_order?: number;
  status?: CategoryStatus;
  attributes?: CategoryAttributeAssignment[];
  media?: CategoryMediaAssignment[];
};

export type CreateCategoryResponse = CategoryItem;

export type UpdateCategoryRequest = Partial<CreateCategoryRequest> & {
  status?: CategoryStatus;
};

export type UpdateCategoryResponse = CategoryItem;