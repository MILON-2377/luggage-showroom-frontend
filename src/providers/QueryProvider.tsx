"use client";

import { useState, type ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApiError } from "../lib/api/errors/api-error";

type QueryProviderProps = {
  children: ReactNode;
};

const MAX_QUERY_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 10_000;
const BASE_RETRY_DELAY_MS = 1_000;
const RETRYABLE_CLIENT_STATUSES = new Set([408, 425, 429]);

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRIES) {
    return false;
  }

  if (error instanceof ApiError) {
    if (error.status === 499) {
      return false;
    }

    if (error.status >= 400 && error.status < 500) {
      return RETRYABLE_CLIENT_STATUSES.has(error.status);
    }
  }

  return true;
}

function getRetryDelay(attemptIndex: number): number {
  const exponential = BASE_RETRY_DELAY_MS * 2 ** attemptIndex;
  const jitter = Math.random() * 250;

  return Math.min(exponential + jitter, MAX_RETRY_DELAY_MS);
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: shouldRetryQuery,
        retryDelay: getRetryDelay,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
