
"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

type PasskeyRegistrationFormProps = {
  onSubmit: (credentialName?: string) => Promise<void>;
  isPending: boolean;
  errorMessage?: string;
};

export function PasskeyRegistrationForm({
  onSubmit,
  isPending,
  errorMessage,
}: PasskeyRegistrationFormProps) {
  const [credentialName, setCredentialName] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(credentialName.trim() || undefined);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="size-7 text-primary" />
        </div>

        <h2 className="text-lg font-semibold">Register Your Passkey</h2>

        <p className="text-sm text-muted-foreground">
          Create a secure passkey using your device biometrics, screen lock,
          or an external security key.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credential-name">
          Device name <span className="text-muted-foreground">(optional)</span>
        </Label>

        <Input
          id="credential-name"
          value={credentialName}
          onChange={(event) => setCredentialName(event.target.value)}
          placeholder="e.g. My Laptop"
          maxLength={100}
          disabled={isPending}
        />
      </div>

      <Alert>
        <ShieldCheck className="size-4" />
        <AlertTitle>Secure device verification</AlertTitle>
        <AlertDescription>
          Your browser will open its native security prompt. Your fingerprint,
          face data, or device PIN never reaches this website.
        </AlertDescription>
      </Alert>

      {errorMessage && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Registering Passkey..." : "Create Passkey"}
      </Button>
    </form>
  );
}
