import type en from "@/src/providers/dictionaries/en";

export type OemOdmCopy = typeof en.oemOdm;

export type CopyProps = {
  copy: OemOdmCopy;
};

export type Approach = "OEM" | "ODM";

export type ColorId =
  | "rose"
  | "sand"
  | "olive"
  | "onyx";

export type MaterialId =
  | "eva"
  | "pu"
  | "polyester";

export interface ColorOption {
  id: ColorId;
  hex: string;
}

export interface OemOdmData {
  colors: ColorOption[];
  materials: MaterialId[];
  contactHref: string;
}

export interface Selection {
  color: ColorId;
  material: MaterialId;
  approach: Approach;
}