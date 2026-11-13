
import CustomizationSection from "@/src/feature/public/home/components/CustomizationSection";
import FeaturedProducts from "@/src/feature/public/home/components/FeaturedProducts";
import FinalCtaSection from "@/src/feature/public/home/components/FinalCtaSection";
import HeroBanner from "@/src/feature/public/home/components/HeroBanner";
import ManufacturingCapabilities from "@/src/feature/public/home/components/ManufacturingCapabilities";
import ProductEngineering from "@/src/feature/public/home/components/ProductEngineering.tsx";
import QualityAssuranceTesting from "@/src/feature/public/home/components/QualityAssuranceTesting";
import ClientReviews from "@/src/feature/public/home/components/Reviews";
import TrustStrip from "@/src/feature/public/home/components/TrustStrip";

export default function HomePage() {
  return (
    <main className="w-full bg-background">
      <HeroBanner />
      <FeaturedProducts />
      <TrustStrip />
      <CustomizationSection />
      <ProductEngineering />
      <ManufacturingCapabilities />
      <QualityAssuranceTesting />
      <ClientReviews />
      <FinalCtaSection />
    </main>
  );
}
