import { InitialMfaSetupProvider } from "@/src/feature/auth/initial-mfa-setup/context/initial-mfa-setup.context";

export default function InitialMfaSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InitialMfaSetupProvider>
      <div className="min-h-screen bg-gray-100">{children}</div>
    </InitialMfaSetupProvider>
  );
}
