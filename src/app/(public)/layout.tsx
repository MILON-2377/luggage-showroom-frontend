import Navbar from "@/feature/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>

      <Navbar />
      
      {children}
    </main>
  );
}
