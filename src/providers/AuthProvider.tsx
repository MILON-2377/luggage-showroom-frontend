"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useAuthMe } from "../feature/auth/me/hooks/useAuthMe";
import type { AuthUser } from "../feature/auth/me/types/auth-me.types";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    data: user,
    isPending,
    error,
    refetch,
  } = useAuthMe();

  const value: AuthContextValue = {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading: isPending,
    error,
    refetchUser: () => {
      void refetch();
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}