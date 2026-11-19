import { Section, SectionHeading } from "./OemOdmUi";
import ProjectShowcaseCard from "./ProjectShowcaseCard";

import type { CopyProps } from "../types/oem-odm.types";

interface ShowcaseItem {
  title: string;
  description: string;
}

const colors: string[] = [
  "#c2a56e",
  "#bf7d87",
  "#566049",
];

export default function ProjectShowcase({
  copy,
}: CopyProps) {
  const c = copy.showcase;
  const items: ShowcaseItem[] = c.items;

  return (
    <Section>
      <SectionHeading
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {items.map((item: ShowcaseItem, i: number) => (
          <ProjectShowcaseCard
            key={item.title}
            title={item.title}
            description={item.description}
            label={c.concept}
            color={colors[i % colors.length]}
          />
        ))}
      </div>
    </Section>
  );
}