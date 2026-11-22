import { MessageSquareText, Layers3, Handshake } from "lucide-react";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteJourney({ copy }: { copy: QuoteCopy }) {
  return (
    <section className="overflow-hidden bg-[#201e19] px-5 py-16 text-[#f4eddb] sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
          {copy.journey.title}
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {copy.journey.items.map((item, i) => {
            const Icon = [MessageSquareText, Layers3, Handshake][i % 3];
            return (
              <li
                key={item.title}
                className="group rounded-2xl border border-[#b79a60]/30 bg-gradient-to-br from-[#423a2a] to-[#28251f] p-7 shadow-[4px_5px_0_#0f100f] transition-all duration-300 hover:-translate-y-2 hover:border-[#d9bd83] motion-reduce:transform-none"
              >
                <div className="mb-7 flex size-14 items-center justify-center rounded-2xl border border-[#e2c993] bg-gradient-to-br from-[#f6e7be] to-[#b1955e] text-[#45391f] shadow-[3px_4px_0_#806b44]">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <p className="mt-4 text-base leading-7 text-[#d6cdbb]">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
