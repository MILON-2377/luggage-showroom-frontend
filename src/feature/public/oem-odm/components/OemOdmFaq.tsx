"use client";

import { useId, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

import { Section, SectionHeading } from "./OemOdmUi";
import type { CopyProps } from "../types/oem-odm.types";

interface FaqItem {
  question: string;
  answer: string;
}

interface IndexedFaqItem {
  item: FaqItem;
  index: number;
}

export default function OemOdmFaq({ copy }: CopyProps) {
  const c = copy.faq;

  const id = useId();
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<number | null>(null);

  const items: FaqItem[] = c.items;
  const searchTerm = query.trim().toLocaleLowerCase();

  const filteredItems: IndexedFaqItem[] = items
    .map(
      (item: FaqItem, index: number): IndexedFaqItem => ({
        item,
        index,
      }),
    )
    .filter(({ item }: IndexedFaqItem): boolean =>
      `${item.question} ${item.answer}`
        .toLocaleLowerCase()
        .includes(searchTerm),
    );

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading
            eyebrow={c.eyebrow}
            title={c.title}
            description={c.description}
          />

          <div className="relative mt-7">
            <Search
              className="absolute left-4 top-3.5 size-5 text-accent"
              aria-hidden="true"
            />

            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={c.search}
              placeholder={c.search}
              className="h-12 rounded-xl bg-white pl-12"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map(
            ({ item, index }: IndexedFaqItem) => {
              const isOpen = open === index;
              const triggerId = `${id}-trigger-${index}`;
              const panelId = `${id}-panel-${index}`;

              return (
                <article
                  key={item.question}
                  className="
                    rounded-2xl border border-white bg-white
                    shadow-[0_4px_0_#e0d5bf]
                  "
                >
                  <h3>
                    <Button
                      id={triggerId}
                      variant="ghost"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpen((previous: number | null) =>
                          previous === index ? null : index,
                        )
                      }
                      className="
                        h-auto min-h-16 w-full justify-between
                        gap-4 whitespace-normal rounded-2xl
                        px-6 py-5 text-left text-base
                      "
                    >
                      <span>{item.question}</span>

                      <Plus
                        aria-hidden="true"
                        className={`
                          size-5 shrink-0 text-accent
                          transition-transform duration-300
                          motion-reduce:transition-none
                          ${isOpen ? "rotate-45" : ""}
                        `}
                      />
                    </Button>
                  </h3>

                  <div
                    id={panelId}
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="
                      px-6 pb-6 text-base leading-8 text-secondary
                    "
                  >
                    {item.answer}
                  </div>
                </article>
              );
            },
          )}

          {filteredItems.length === 0 && (
            <p
              role="status"
              className="
                rounded-2xl border border-border
                p-6 text-base leading-7 text-secondary
              "
            >
              {c.empty}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}