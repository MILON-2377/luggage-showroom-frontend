import { Users, Clock3 } from "lucide-react";
import type { QuoteCopy } from "../types/quote.types";
import { panel } from "./QuoteUi";
export default function QuoteResponseInfo({ copy }: { copy: QuoteCopy }) {
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-accent">
            {copy.intro.eyebrow}
          </p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight">
            {copy.intro.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            {copy.intro.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {copy.intro.facts.map((text) => (
              <span
                key={text}
                className="rounded-xl border border-accent/20 bg-white px-4 py-3 text-sm shadow-[2px_3px_0_#d2c3a3]"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              Icon: Users,
              title: copy.intro.responder,
              description: copy.intro.responderNote,
            },
            {
              Icon: Clock3,
              title: copy.intro.response,
              description: copy.intro.responseNote,
            },
          ].map(({ Icon, title, description }) => (
            <article
              key={title}
              className={
                panel +
                " p-6 transition-transform hover:-translate-y-1 motion-reduce:transform-none"
              }
            >
              <Icon className="mb-6 size-7 text-accent" strokeWidth={1.3} />
              <h3 className="font-serif text-2xl">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
