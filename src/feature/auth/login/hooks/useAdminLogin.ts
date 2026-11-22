"use client";

import { useMutation } from "@tanstack/react-query";

import { adminLogin } from "../api/admin-login.api";
import type {
  AdminLoginRequest,
  AdminLoginResponse,
} from "../types/admin-login.types";

export function useAdminLogin() {
  return useMutation<AdminLoginResponse, Error, AdminLoginRequest>({
    mutationFn: (payload) => adminLogin(payload),
    retry: false,
  });
}