"use client";

import { useState } from "react";
import { useLanguage } from "@/src/providers";
import type {
  OemOdmData,
  OemOdmCopy,
  Selection,
} from "../types/oem-odm.types";
import OemOdmHero from "./OemOdmHero";
import OemOdmComparison from "./OemOdmComparison";
import OemServiceSection from "./OemServiceSection";
import OdmServiceSection from "./OdmServiceSection";
import ProductDevelopmentProcess from "./ProductDevelopmentProcess";
import CustomizationOptions from "./CustomizationOptions";
import MaterialAndFinishSelector from "./MaterialAndFinishSelector";
import BrandingAndPackaging from "./BrandingAndPackaging";
import SampleDevelopment from "./SampleDevelopment";
import ProductionAndQuality from "./ProductionAndQuality";
import OrderRequirements from "./OrderRequirements";
import ProjectShowcase from "./ProjectShowcase";
import OemOdmFaq from "./OemOdmFaq";
import OemOdmInquiryCta from "./OemOdmInquiryCta";

export default function OemOdmSection({
  data,
  copy: providedCopy,
}: {
  data: OemOdmData;
  copy?: OemOdmCopy;
}) {
  const { t } = useLanguage();
  const copy = providedCopy ?? t.oemOdm;
  const [selection, setSelection] = useState<Selection>({
    color: data.colors[0]?.id ?? "sand",
    material: data.materials[0] ?? "eva",
    approach: "OEM",
  });

  const onApproach = (approach: Selection["approach"]) =>
    setSelection((value) => ({ ...value, approach }));

  return (
    <main className="w-full overflow-x-clip bg-background text-foreground">
      <OemOdmHero copy={copy} />
      <OemOdmComparison
        copy={copy}
        selected={selection.approach}
        onSelect={onApproach}
      />
      <OemServiceSection copy={copy} />
      <OdmServiceSection copy={copy} />
      <ProductDevelopmentProcess copy={copy} />
      <CustomizationOptions copy={copy} />
      <MaterialAndFinishSelector
        copy={copy}
        data={data}
        selection={selection}
        onColor={(color) => setSelection((value) => ({ ...value, color }))}
        onMaterial={(material) =>
          setSelection((value) => ({ ...value, material }))
        }
      />
      <BrandingAndPackaging copy={copy} />
      <SampleDevelopment copy={copy} />
      <ProductionAndQuality copy={copy} />
      <OrderRequirements copy={copy} />
      <ProjectShowcase copy={copy} />
      <OemOdmFaq copy={copy} />
      <OemOdmInquiryCta
        copy={copy}
        data={data}
        selection={selection}
        onApproach={onApproach}
      />
    </main>
  );
}