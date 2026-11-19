import { Section, SectionHeading, FeatureCards } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

export default function OrderRequirements({ copy }: CopyProps) {
  const c = copy.requirements;

  return (
    <Section dark={false}>
      <SectionHeading {...c} dark={false} />
      <FeatureCards items={c.items} dark={false} />
    </Section>
  );
}