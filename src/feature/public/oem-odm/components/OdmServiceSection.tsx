import { Section, SectionHeading, FeatureCards } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

export default function OdmServiceSection({ copy }: CopyProps) {
  const c = copy.odm;

  return (
    <Section dark={true}>
      <SectionHeading {...c} dark={true} />
      <FeatureCards items={c.items} dark={true} />
    </Section>
  );
}