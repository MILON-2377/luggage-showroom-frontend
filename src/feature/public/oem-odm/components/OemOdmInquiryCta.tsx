"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";

import {
  Button,
  buttonVariants,
} from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";

import {
  Section,
  SectionHeading,
  SculptedMark,
} from "./OemOdmUi";

import type {
  Approach,
  CopyProps,
  OemOdmData,
  Selection,
} from "../types/oem-odm.types";

const discussionOptions = [
  "logo",
  "packaging",
  "sample",
] as const;

type DiscussionOption = (typeof discussionOptions)[number];

type OemOdmInquiryCtaProps = CopyProps & {
  selection: Selection;
  data: OemOdmData;
  onApproach: (value: Approach) => void;
};

export default function OemOdmInquiryCta({
  copy,
  selection,
  data,
  onApproach,
}: OemOdmInquiryCtaProps) {
  const c = copy.inquiry;
  const id = useId();

  const [extras, setExtras] = useState<DiscussionOption[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function toggleExtra(
    option: DiscussionOption,
    checked: boolean,
  ): void {
    setExtras(
      (previous: DiscussionOption[]): DiscussionOption[] => {
        if (checked) {
          return previous.includes(option)
            ? previous
            : [...previous, option];
        }

        return previous.filter(
          (value: DiscussionOption) => value !== option,
        );
      },
    );
  }

  function prepare(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    const fields = new FormData(event.currentTarget);

    const name = String(fields.get("name") ?? "").trim();
    const email = String(fields.get("email") ?? "").trim();
    const quantity = String(fields.get("quantity") ?? "").trim();
    const requirements = String(
      fields.get("requirements") ?? "",
    ).trim();

    if (!name || !email || !quantity || !requirements) {
      setMessage(c.required);
      return;
    }

    const selectedExtras = extras
      .map(
        (option: DiscussionOption): string =>
          c.choices[option],
      )
      .join(", ");

    const lines: string[] = [
      `${c.name}: ${name}`,
      `${c.email}: ${email}`,
      `${c.approach}: ${selection.approach}`,
      `${c.quantity}: ${quantity}`,
      `${c.selection}: ${
        copy.materials.colors[selection.color]
      } / ${copy.materials.materials[selection.material]}`,
      `${c.extras}: ${selectedExtras}`,
      `${c.requirements}: ${requirements}`,
    ];

    setSummary(lines.join("\n"));
    setMessage("");
  }

  async function copySummary(): Promise<void> {
    try {
      await navigator.clipboard.writeText(summary);
      setMessage(c.copied);
    } catch {
      setMessage(c.copyError);
    }
  }

  return (
    <Section id="project-inquiry" dark>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={c.eyebrow}
            title={c.title}
            description={c.description}
            dark
          />

          <SculptedMark />
        </div>

        <div
          className="
            rounded-[32px] border border-white/80
            bg-background p-6 text-foreground
            shadow-[9px_11px_0_#88724b,0_30px_50px_-25px_black]
            sm:p-8
          "
        >
          <form onSubmit={prepare} className="space-y-6">
            <fieldset>
              <legend className="mb-3 text-base font-medium">
                {c.approach}
              </legend>

              <div className="flex gap-3">
                {(["OEM", "ODM"] as const).map(
                  (value: Approach) => (
                    <Button
                      key={value}
                      variant={
                        selection.approach === value
                          ? "default"
                          : "outline"
                      }
                      aria-pressed={
                        selection.approach === value
                      }
                      onClick={() => onApproach(value)}
                    >
                      {value}
                    </Button>
                  ),
                )}
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${id}-name`}
                  className="mb-2 block text-sm font-medium"
                >
                  {c.name} *
                </label>

                <Input
                  id={`${id}-name`}
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                />
              </div>

              <div>
                <label
                  htmlFor={`${id}-email`}
                  className="mb-2 block text-sm font-medium"
                >
                  {c.email} *
                </label>

                <Input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={180}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={`${id}-quantity`}
                className="mb-2 block text-sm font-medium"
              >
                {c.quantity} *
              </label>

              <Input
                id={`${id}-quantity`}
                name="quantity"
                type="number"
                min={1}
                step={1}
                required
                placeholder={c.quantityHint}
              />
            </div>

            <div>
              <label
                htmlFor={`${id}-requirements`}
                className="mb-2 block text-sm font-medium"
              >
                {c.requirements} *
              </label>

              <textarea
                id={`${id}-requirements`}
                name="requirements"
                required
                maxLength={4000}
                rows={5}
                placeholder={c.requirementsHint}
                className="
                  w-full rounded-md border border-input
                  bg-surface p-3 text-base leading-7
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring/30
                "
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-base font-medium">
                {c.options}
              </legend>

              <div className="space-y-3">
                {discussionOptions.map(
                  (option: DiscussionOption) => (
                    <label
                      key={option}
                      className="
                        flex cursor-pointer items-center
                        gap-3 text-sm
                      "
                    >
                      <Checkbox
                        checked={extras.includes(option)}
                        onCheckedChange={(checked) =>
                          toggleExtra(
                            option,
                            checked === true,
                          )
                        }
                      />

                      {c.choices[option]}
                    </label>
                  ),
                )}
              </div>
            </fieldset>

            <Button
              type="submit"
              size="lg"
              className="w-full"
            >
              {c.prepare}
            </Button>

            <p className="text-sm leading-7 text-secondary">
              {c.note}
            </p>
          </form>

          {summary && (
            <div className="mt-7 border-t border-border pt-6">
              <h3 className="font-serif text-2xl">
                {c.summary}
              </h3>

              <pre
                className="
                  my-4 whitespace-pre-wrap break-words
                  rounded-xl bg-white p-4 font-sans
                  text-sm leading-7
                "
              >
                {summary}
              </pre>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={copySummary}
                >
                  {message === c.copied ? (
                    <Check
                      className="size-4"
                      aria-hidden="true"
                    />
                  ) : (
                    <Copy
                      className="size-4"
                      aria-hidden="true"
                    />
                  )}

                  {c.copy}
                </Button>

                <Link
                  href={data.contactHref}
                  className={buttonVariants()}
                >
                  {c.contact}
                </Link>
              </div>
            </div>
          )}

          <p
            role="status"
            aria-live="polite"
            className="mt-3 text-sm text-secondary"
          >
            {message}
          </p>
        </div>
      </div>
    </Section>
  );
}