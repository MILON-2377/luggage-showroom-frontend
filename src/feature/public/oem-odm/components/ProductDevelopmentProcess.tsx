import { Check } from "lucide-react";

import { Section, SectionHeading } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

interface DevelopmentStep {
  title: string;
  description: string;
}

export default function ProductDevelopmentProcess({
  copy,
}: CopyProps) {
  const c = copy.process;
  const items: DevelopmentStep[] = c.items;

  return (
    <Section>
      <SectionHeading
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />

      <ol className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item: DevelopmentStep) => (
          <li
            key={item.title}
            className="
              relative rounded-[28px] border border-white
              bg-gradient-to-br from-white to-[#ede5d5]
              p-7 shadow-[5px_7px_0_#d8cbb1]
            "
          >
            <div
              className="
                mb-6 flex size-12 items-center justify-center
                rounded-full border border-[#ead9b5]
                bg-gradient-to-br from-[#f8edcf] to-[#bda06a]
                text-[#604a25] shadow-[2px_4px_0_#9f8150]
              "
            >
              <Check className="size-5" aria-hidden="true" />
            </div>

            <h3 className="font-serif text-2xl">
              {item.title}
            </h3>

            <p className="mt-3 text-base leading-7 text-secondary">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}