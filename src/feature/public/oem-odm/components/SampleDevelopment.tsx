import { Section, SectionHeading, FeatureCards } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

export default function SampleDevelopment({ copy }: CopyProps) {
  const c = copy.sample;

  return (
    <Section dark={false}>
      <SectionHeading {...c} dark={false} />
      <FeatureCards items={c.items} dark={false} />
    </Section>
  );
}