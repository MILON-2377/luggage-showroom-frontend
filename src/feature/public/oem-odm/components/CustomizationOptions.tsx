import { Box, Grid2X2, Palette, ShoppingBag } from "lucide-react";
import { Section, SectionHeading } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

const icons = [Box, Grid2X2, ShoppingBag, Palette];

export default function CustomizationOptions({ copy }: CopyProps) {
  const c = copy.customization;

  return (
    <Section dark>
      <SectionHeading {...c} dark />
      <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {c.items.map((item, i) => {
          const Icon = icons[i % icons.length];

          return (
            <article
              key={item.title}
              className="rounded-[28px] border border-[#d0b783]/20 bg-gradient-to-br from-[#383329] to-[#22211d] p-7 shadow-[6px_8px_0_#10100e] transition-transform duration-300 motion-safe:hover:-translate-y-2"
            >
              <div className="mb-7 flex size-16 items-center justify-center rounded-2xl border border-[#ead9b2]/50 bg-gradient-to-br from-[#f1dfb5] to-[#ad8950] text-[#49381e] shadow-[5px_6px_0_#775c32] [transform:rotateY(-15deg)_rotateX(10deg)]">
                <Icon className="size-7" strokeWidth={1.3} />
              </div>
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-[#c6c1b7]">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}