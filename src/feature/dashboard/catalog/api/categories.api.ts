import { adminFetch } from "@/src/lib/api/client";

import type {
    CategoryItem,
    CategoryListResponse,
    CreateCategoryRequest,
    CreateCategoryResponse,
    ListCategoriesParams,
    UpdateCategoryRequest,
} from "../types/category.types";

export type { ListCategoriesParams };

const CATEGORIES_ENDPOINT = "catalog/categories";

function getCategoryEndpoint(categoryId: string): string {
    return `${CATEGORIES_ENDPOINT}/${encodeURIComponent(categoryId)}`;
}

function buildCategoriesQuery(params?: ListCategoriesParams): string {
    if (!params) {
        return "";
    }

    const searchParams = new URLSearchParams();

    const trimmedSearch = params.search?.trim();
    if (trimmedSearch) {
        searchParams.set("search", trimmedSearch.slice(0, 150));
    }

    if (params.status) {
        searchParams.set("status", params.status);
    }

    const trimmedParentId = params.parent_id?.trim();
    if (trimmedParentId) {
        searchParams.set("parent_id", trimmedParentId);
    }

    if (params.view) {
        searchParams.set("view", params.view);
    }

    if (params.page !== undefined) {
        searchParams.set("page", String(Math.max(1, Math.trunc(params.page))));
    }

    if (params.page_size !== undefined) {
        const clampedSize = Math.min(100, Math.max(1, Math.trunc(params.page_size)));
        searchParams.set("page_size", String(clampedSize));
    }

    const query = searchParams.toString();
    return query ? `?${query}` : "";
}

export function listCategories(
    params?: ListCategoriesParams,
    signal?: AbortSignal,
): Promise<CategoryListResponse> {
    return adminFetch<CategoryListResponse>(
        `${CATEGORIES_ENDPOINT}${buildCategoriesQuery(params)}`,
        {
            method: "GET",
            signal,
        },
    );
}

export function getCategoryById(
    categoryId: string,
    signal?: AbortSignal,
): Promise<CategoryItem> {
    return adminFetch<CategoryItem>(getCategoryEndpoint(categoryId), {
        method: "GET",
        signal,
    });
}

export function createCategory(
    payload: CreateCategoryRequest,
    signal?: AbortSignal,
): Promise<CreateCategoryResponse> {
    return adminFetch<CreateCategoryResponse>(CATEGORIES_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });
}

export function updateCategory(
    categoryId: string,
    payload: UpdateCategoryRequest,
    signal?: AbortSignal,
): Promise<CategoryItem> {
    return adminFetch<CategoryItem>(getCategoryEndpoint(categoryId), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });
}