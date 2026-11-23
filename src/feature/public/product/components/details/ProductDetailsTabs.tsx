"use client";
import {
  Layers3,
  SlidersHorizontal,
  Ruler,
  Images,
  ListChecks,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";
import { useLanguage } from "@/src/providers";
import type { Product } from "../../types/product.types";
import type { ProductDetailData } from "../../types/product-details.types"; 
import ProductSpecifications from "./ProductSpecifications";
import ProductMaterials from "./ProductMaterials";
import ProductCustomization from "./ProductCustomization";
import ProductDimensions from "./ProductDimensions";
import ProductDetailMedia from "./ProductDetailMedia";
export default function ProductDetailsTabs({
  product,
  details,
  name,
}: {
  product: Product;
  details: ProductDetailData;
  name: string;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const tabs = [
    { id: "specs", label: c.specsTab, Icon: ListChecks },
    { id: "materials", label: c.materialsTab, Icon: Layers3 },
    { id: "custom", label: c.customTab, Icon: SlidersHorizontal },
    { id: "dimensions", label: c.dimensionsTab, Icon: Ruler },
    { id: "media", label: c.mediaTab, Icon: Images },
  ];
  return (
    <section className="mt-20 border-t border-border pt-10">
      <p className="text-[10px] uppercase tracking-[.22em] text-accent">
        {c.detailsEyebrow}
      </p>
      <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{c.detailsTitle}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-8 text-secondary">
        {c.detailsDescription}
      </p>
      <div className="mt-8 rounded-[24px] border border-accent/20 bg-surface p-3 shadow-[0_25px_65px_-45px_rgba(0,0,0,.3)] sm:p-6">
        <Tabs defaultValue="specs">
          <div className="overflow-x-auto">
            <TabsList
              aria-label={c.detailsTitle}
              className="h-auto min-w-max rounded-xl border border-border bg-background p-1.5"
            >
              {tabs.map(({ id, label, Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="h-11 gap-2 rounded-lg text-xs data-[selected]:text-accent"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="p-3 pt-5 sm:p-5">
            <TabsContent value="specs">
              <ProductSpecifications product={product} details={details} />
            </TabsContent>
            <TabsContent value="materials">
              <ProductMaterials product={product} />
            </TabsContent>
            <TabsContent value="custom">
              <ProductCustomization product={product} />
            </TabsContent>
            <TabsContent value="dimensions">
              <ProductDimensions details={details} />
            </TabsContent>
            <TabsContent value="media">
              <ProductDetailMedia
                images={
                  details.detailImages?.length
                    ? details.detailImages
                    : product.images
                }
                name={name}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
