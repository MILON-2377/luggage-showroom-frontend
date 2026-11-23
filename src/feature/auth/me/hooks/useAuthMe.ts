"use client";

import { useQuery } from "@tanstack/react-query";

import { getAuthMe } from "../api/auth-me.api";

export const authMeQueryKey = ["auth", "me"] as const;

export function useAuthMe(enabled = true) {
  return useQuery({
    queryKey: authMeQueryKey,
    queryFn: ({ signal }) => getAuthMe(signal),
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}