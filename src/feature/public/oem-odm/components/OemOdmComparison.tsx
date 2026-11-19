import { PenTool, Layers3 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Section, SectionHeading } from "./OemOdmUi";
import type { CopyProps, Approach } from "../types/oem-odm.types";

export default function OemOdmComparison({
  copy,
  selected,
  onSelect,
}: CopyProps & {
  selected: Approach;
  onSelect: (v: Approach) => void;
}) {
  const c = copy.comparison;

  return (
    <Section id="oem-odm-services">
      <SectionHeading {...c} />
      <div className="mt-10 grid gap-7 md:grid-cols-2">
        {(
          [
            { id: "OEM", title: c.oemTitle, text: c.oemText, Icon: PenTool },
            { id: "ODM", title: c.odmTitle, text: c.odmText, Icon: Layers3 },
          ] as const
        ).map(({ id, title, text, Icon }) => (
          <article
            key={id}
            className={
              "flex flex-col rounded-[32px] border p-8 shadow-[0_8px_0_#d3c5a8,0_25px_40px_-25px_#4f3b24] " +
              (selected === id
                ? "border-accent/40 bg-[#e8ddc8]"
                : "border-white bg-white")
            }
          >
            <Icon className="size-9 text-accent" strokeWidth={1.2} />
            <h3 className="mt-6 font-serif text-3xl">{title}</h3>
            <p className="mb-7 mt-4 text-base leading-8 text-secondary">
              {text}
            </p>
            <Button
              className="mt-auto self-start"
              variant={selected === id ? "default" : "outline"}
              aria-pressed={selected === id}
              onClick={() => onSelect(id)}
            >
              {c.choose} · {id}
            </Button>
          </article>
        ))}
      </div>
    </Section>
  );
}