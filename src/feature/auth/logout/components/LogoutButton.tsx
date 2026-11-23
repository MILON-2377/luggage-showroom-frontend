"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useLogout } from "../hooks/useLogout";

export function LogoutButton() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogout();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    if (isPending) return;

    setErrorMessage("");

    try {
      await mutateAsync();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again.",
      );
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={isPending}
        className="h-10 w-full justify-between rounded-none border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--foreground)] uppercase transition-colors hover:border-destructive hover:bg-[var(--surface-muted)] hover:text-destructive"
      >
        <span>{isPending ? "Logging out..." : "Logout"}</span>
        <LogOut className="size-3.5" aria-hidden="true" />
      </Button>

      {errorMessage && (
        <p role="alert" className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}