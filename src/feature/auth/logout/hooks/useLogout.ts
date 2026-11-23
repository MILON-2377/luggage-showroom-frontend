"use client";

import { useMutation } from "@tanstack/react-query";

import { logout } from "../api/logout.api";

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: () => logout(),
    retry: false,
  });
}