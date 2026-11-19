import { Check } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import OemOdmHeroVisual from "./OemOdmHeroVisual";
import { Section, SectionHeading } from "./OemOdmUi";
import type {
  CopyProps,
  OemOdmData,
  Selection,
  ColorId,
  MaterialId,
} from "../types/oem-odm.types";

export default function MaterialAndFinishSelector({
  copy,
  data,
  selection,
  onColor,
  onMaterial,
}: CopyProps & {
  data: OemOdmData;
  selection: Selection;
  onColor: (v: ColorId) => void;
  onMaterial: (v: MaterialId) => void;
}) {
  const c = copy.materials;

  return (
    <Section>
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading {...c} />
          <fieldset className="mt-8">
            <legend className="mb-4 text-base font-medium">{c.color}</legend>
            <div className="flex flex-wrap gap-3">
              {data.colors.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  size="icon"
                  onClick={() => onColor(option.id)}
                  aria-label={c.colors[option.id]}
                  aria-pressed={selection.color === option.id}
                  className="size-12 rounded-full border-white shadow-[0_4px_0_#c9b995]"
                  style={{
                    backgroundColor: option.hex,
                    color: option.id === "sand" ? "#332818" : "#fff",
                  }}
                >
                  {selection.color === option.id && <Check aria-hidden="true" />}
                </Button>
              ))}
            </div>
            <p className="mt-4 text-sm text-secondary">
              {c.colors[selection.color]}
            </p>
          </fieldset>
          <fieldset className="mt-7">
            <legend className="mb-4 text-base font-medium">{c.material}</legend>
            <div className="flex flex-wrap gap-3">
              {data.materials.map((id) => (
                <Button
                  key={id}
                  variant={selection.material === id ? "default" : "outline"}
                  aria-pressed={selection.material === id}
                  onClick={() => onMaterial(id)}
                >
                  {c.materials[id]}
                </Button>
              ))}
            </div>
          </fieldset>
          <p className="mt-7 text-sm leading-7 text-secondary">{c.note}</p>
        </div>
        <div className="mx-auto w-full max-w-lg px-2 pb-4">
          <OemOdmHeroVisual
            copy={copy}
            color={
              data.colors.find((c) => c.id === selection.color)?.hex ?? "#c2a56e"
            }
            material={selection.material}
          />
        </div>
      </div>
    </Section>
  );
}