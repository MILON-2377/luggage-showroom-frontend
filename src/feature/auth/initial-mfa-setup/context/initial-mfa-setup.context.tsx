"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { InitialMfaSetupResponse } from "../types/initial-mfa-setup.types";

type InitialMfaSetupContextValue = {
  enrollmentToken: string | null;
  setEnrollmentSession: (session: InitialMfaSetupResponse) => void;
  clearEnrollmentSession: () => void;
  hasValidEnrollmentSession: () => boolean;
};

const InitialMfaSetupContext =
  createContext<InitialMfaSetupContextValue | null>(null);

export function InitialMfaSetupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enrollmentToken, setEnrollmentToken] = useState<string | null>(null);

  const setEnrollmentSession = useCallback(
    (session: InitialMfaSetupResponse) => {
      setEnrollmentToken(session.enrollment_token);
    },
    [],
  );

  const clearEnrollmentSession = useCallback(() => {
    setEnrollmentToken(null);
  }, []);

  const hasValidEnrollmentSession = useCallback(() => {
    return Boolean(enrollmentToken?.trim());
  }, [enrollmentToken]);

  const value = useMemo(
    () => ({
      enrollmentToken,
      setEnrollmentSession,
      clearEnrollmentSession,
      hasValidEnrollmentSession,
    }),
    [
      enrollmentToken,
      setEnrollmentSession,
      clearEnrollmentSession,
      hasValidEnrollmentSession,
    ],
  );

  return (
    <InitialMfaSetupContext.Provider value={value}>
      {children}
    </InitialMfaSetupContext.Provider>
  );
}

export function useInitialMfaSetupContext() {
  const context = useContext(InitialMfaSetupContext);

  if (!context) {
    throw new Error(
      "useInitialMfaSetupContext must be used within InitialMfaSetupProvider.",
    );
  }

  return context;
}