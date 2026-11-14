import { Button } from "@/components/ui/button";
import CustomizationSection from "@/feature/public/home/components/CustomizationSection";
import FeaturedProducts from "@/feature/public/home/components/FeaturedProducts";
import FinalCtaSection from "@/feature/public/home/components/FinalCtaSection";
import HeroBanner from "@/feature/public/home/components/HeroBanner";
import ManufacturingCapabilities from "@/feature/public/home/components/ManufacturingCapabilities";
import ProductEngineering from "@/feature/public/home/components/ProductEngineering.tsx";
import QualityAssuranceTesting from "@/feature/public/home/components/QualityAssuranceTesting";
import ClientReviews from "@/feature/public/home/components/Reviews";
import TrustStrip from "@/feature/public/home/components/TrustStrip";

export default function HomePage() {
  return (
    <main className="w-full bg-background">
      <HeroBanner />


      <Button variant={"accent"}>
        Test Shadcn Button
      </Button>

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
