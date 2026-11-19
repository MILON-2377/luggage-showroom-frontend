import type { ReactNode } from "react";
import { Check, Layers3 } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={
          dark
            ? "text-sm font-medium tracking-[0.15em] text-[#d6bc8c]"
            : "text-sm font-medium tracking-[0.15em] text-accent"
        }
      >
        {eyebrow}
      </p>
      <h2
        className={
          "mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl " +
          (dark ? "text-[#f3eddf]" : "text-primary")
        }
      >
        {title}
      </h2>
      <p
        className={
          "mt-5 text-base leading-8 " +
          (dark ? "text-[#c6c1b7]" : "text-secondary")
        }
      >
        {description}
      </p>
    </div>
  );
}

export function Section({
  children,
  id,
  dark = false,
}: {
  children: ReactNode;
  id?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={
        "relative scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28 " +
        (dark
          ? "overflow-hidden bg-[#1c1b18] text-[#f3eddf]"
          : "bg-background text-foreground")
      }
    >
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function FeatureCards({
  items,
  dark = false,
}: {
  items: {
    title: string;
    description: string;
  }[];
  dark?: boolean;
}) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className={
            "group relative rounded-[26px] border p-7 transition-transform duration-300 motion-safe:hover:-translate-y-2 " +
            (dark
              ? "border-white/10 bg-gradient-to-br from-[#353128] to-[#22211d] shadow-[0_8px_0_#11110f,0_20px_35px_-20px_black]"
              : "border-white bg-gradient-to-br from-white to-[#ece5d7] shadow-[0_7px_0_#ddd2bc,0_20px_30px_-20px_#887650]")
          }
        >
          <span
            className={
              "mb-6 inline-flex size-12 items-center justify-center rounded-2xl border " +
              (dark
                ? "border-[#ccb27f]/30 bg-[#ccb27f]/10 text-[#dbc393]"
                : "border-white bg-[#e7dcc5] text-[#80663d] shadow-[3px_4px_0_#c8b58f]")
            }
          >
            <Check className="size-5" aria-hidden="true" />
          </span>
          <h3 className="font-serif text-2xl">{item.title}</h3>
          <p
            className={
              "mt-3 text-base leading-7 " +
              (dark ? "text-[#c6c1b7]" : "text-secondary")
            }
          >
            {item.description}
          </p>
        </article>
      ))}
    </div>
  );
}

export function SculptedMark() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center [perspective:700px]"
    >
      <div className="absolute inset-4 rounded-full border border-accent/30 [transform:rotateX(60deg)_rotateZ(-25deg)]" />
      <div className="absolute bottom-9 h-7 w-36 rounded-[50%] bg-black/20 blur-xl" />
      <div className="flex size-32 items-center justify-center rounded-[32px] border border-[#eed7aa] bg-gradient-to-br from-[#f7eacb] via-[#c5a76e] to-[#8f703c] text-[#544022] shadow-[12px_14px_0_#8b7047,20px_30px_40px_-15px_#0008,inset_2px_2px_3px_#fff8] [transform:rotateX(15deg)_rotateY(-25deg)_rotateZ(-8deg)]">
        <Layers3 className="size-14" strokeWidth={1} />
      </div>
    </div>
  );
}