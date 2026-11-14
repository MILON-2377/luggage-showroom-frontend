import LanguageSwitcher from "@/src/feature/common/components/LanguageSwitcher";
import Navbar from "@/src/feature/layout/Navbar";

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
