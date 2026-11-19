import { Section, SectionHeading, FeatureCards } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

export default function ProductionAndQuality({ copy }: CopyProps) {
  const c = copy.quality;

  return (
    <Section dark={true}>
      <SectionHeading {...c} dark={true} />
      <FeatureCards items={c.items} dark={true} />
      <p className="mt-8 max-w-3xl text-sm leading-7 text-[#c6c1b7]">
        {c.note}
      </p>
    </Section>
  );
}