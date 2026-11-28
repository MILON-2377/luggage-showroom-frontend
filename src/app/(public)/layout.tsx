import { PublicHeader } from "@/src/feature/layout/components/public/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <PublicHeader />
      {children}
    </main>
  );
}