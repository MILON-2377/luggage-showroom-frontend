"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    createCategory,
    getCategoryById,
    listCategories,
    updateCategory,
} from "../api/categories.api";
import type {
    CategoryItem,
    CategoryListResponse,
    CreateCategoryRequest,
    ListCategoriesParams,
    UpdateCategoryRequest,
    UpdateCategoryResponse,
} from "../types/category.types";

export const categoryQueryKeys = {
    all: ["dashboard", "catalog", "categories"] as const,
    lists: () => [...categoryQueryKeys.all, "list"] as const,
    list: (params?: ListCategoriesParams) =>
        [...categoryQueryKeys.lists(), params ?? {}] as const,
    details: () => [...categoryQueryKeys.all, "detail"] as const,
    detail: (categoryId: string) =>
        [...categoryQueryKeys.details(), categoryId] as const,
};

function normalizeCategories(
    response: CategoryListResponse | CategoryItem[],
): CategoryItem[] {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && Array.isArray(response.items)) {
        return response.items;
    }

    return [];
}

export function useCategoriesQuery(params?: ListCategoriesParams) {
    return useQuery({
        queryKey: categoryQueryKeys.list(params),
        queryFn: ({ signal }) => listCategories(params, signal),
        select: normalizeCategories,
    });
}

export function useCategoriesPageQuery(params?: ListCategoriesParams) {
    return useQuery({
        queryKey: [...categoryQueryKeys.list(params), "page"] as const,
        queryFn: ({ signal }) => listCategories(params, signal),
    });
}

export function useCategoryDetailQuery(categoryId: string | undefined) {
    const trimmedId = categoryId?.trim() ?? "";

    return useQuery({
        queryKey: categoryQueryKeys.detail(trimmedId),
        queryFn: ({ signal }) => getCategoryById(trimmedId, signal),
        enabled: Boolean(trimmedId),
    });
}

export function useCreateCategoryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCategoryRequest) => createCategory(payload),
        onSuccess: (created) => {
            if (created?.category_id) {
                queryClient.setQueryData(
                    categoryQueryKeys.detail(created.category_id),
                    created,
                );
            }
            void queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.lists(),
            });
        },
    });
}

export function useUpdateCategoryMutation(categoryId: string) {
    const queryClient = useQueryClient();
    const trimmedId = categoryId.trim();

    return useMutation<UpdateCategoryResponse, Error, UpdateCategoryRequest>({
        mutationFn: (payload: UpdateCategoryRequest) =>
            updateCategory(trimmedId, payload),
        onSuccess: (updated) => {
            const targetId = updated?.category_id?.trim() || trimmedId;
            if (targetId) {
                queryClient.setQueryData(
                    categoryQueryKeys.detail(targetId),
                    updated,
                );
            }
            void queryClient.invalidateQueries({
                queryKey: categoryQueryKeys.lists(),
            });
        },
    });
}