// type Props = {
//   data: any;
//   business: any;
// };

// export default function FactoryVisit({
//   data,
//   business,
// }: Props) {
//   return (
//     <section
//       className="contact-visit"
//       aria-labelledby="visit-heading"
//     >
//       <div>
//         <span className="contact-kicker">
//           {data.factoryVisit.eyebrow}
//         </span>

//         <h2 id="visit-heading">
//           {data.factoryVisit.title}
//           <br />
//           <em>{data.factoryVisit.highlightedTitle}</em>
//         </h2>

//         <p>{data.factoryVisit.description}</p>

//         <a
//           href={`mailto:${business.email}?subject=${encodeURIComponent(
//             data.factoryVisit.button
//           )}`}
//           className="contact-button contact-light"
//         >
//           {data.factoryVisit.button}
//           <span>↗</span>
//         </a>
//       </div>

//       <ol>
//         {data.factoryVisit.steps.map((step: any) => (
//           <li key={step.number}>
//             <span>{step.number}</span>

//             <div>
//               <h3>{step.title}</h3>
//               <p>{step.description}</p>
//             </div>
//           </li>
//         ))}
//       </ol>
//     </section>
//   );
// }



import {
  ArrowUpRight,
  CalendarDays,
  Factory,
  Handshake,
  MapPin,
} from "lucide-react";

import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type VisitStep = {
  number: string | number;
  title: string;
  description: string;
};

type Props = {
  data: {
    factoryVisit: {
      eyebrow: string;
      title: string;
      highlightedTitle: string;
      description: string;
      button: string;
      steps: VisitStep[];
    };
  };
  business: {
    email: string;
  };
};

const stepIcons = [CalendarDays, MapPin, Handshake];

export default function FactoryVisit({
  data,
  business,
}: Props) {
  const visit = data.factoryVisit;

  return (
    <section
      aria-labelledby="visit-heading"
      className="relative isolate my-12 rounded-[32px] border border-accent/30 bg-[#191816] text-[#f3ecdf] shadow-[0_12px_0_-5px_rgba(165,139,101,0.2),0_35px_65px_-30px_rgba(25,20,15,0.5)] sm:my-16"
    >
      {/* Studio lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[32px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(165,139,101,0.25),transparent_65%)]" />

        <div className="absolute -right-24 -top-28 size-[430px] rounded-full border border-accent/15" />

        <div className="absolute -right-12 -top-16 size-[330px] rounded-full border border-accent/10" />
      </div>

      <div className="grid items-center gap-12 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:p-14">
        {/* Introduction */}
        <div>
          <div
            aria-hidden="true"
            className="group relative mb-7 h-[150px] w-[170px] [perspective:900px]"
          >
            {/* Display base */}
            <div className="absolute bottom-0 left-3 h-7 w-[145px] rounded-[50%] bg-black/60 shadow-[0_10px_15px_rgba(0,0,0,0.35)]" />

            <div className="absolute bottom-2 left-3 h-7 w-[145px] rounded-[50%] border border-[#c2a571]/60 bg-[linear-gradient(135deg,#453d2e,#191816_70%)]" />

            {/* Orbit ring */}
            <div className="absolute inset-x-2 top-1 h-[115px] rounded-full border border-[#c6a972]/30 [transform:rotateX(35deg)_rotateY(-25deg)]" />

            {/* Metallic factory emblem */}
            <div className="absolute left-8 top-4 size-[100px] transition-transform duration-700 [transform:rotateX(10deg)_rotateY(-18deg)_rotateZ(-10deg)] [transform-style:preserve-3d] motion-safe:group-hover:[transform:translateY(-6px)_rotateX(0deg)_rotateY(12deg)_rotateZ(-4deg)] motion-reduce:transition-none">
              <div className="absolute inset-0 rounded-[28px] bg-[#79603a] shadow-[10px_15px_20px_rgba(0,0,0,0.4)] [transform:translateZ(10px)_translate(7px,7px)]" />

              <div className="absolute inset-0 flex items-center justify-center rounded-[28px] border border-[#f3dfb2] bg-[linear-gradient(135deg,#f5e5bd_0%,#d0b27a_35%,#a17e46_75%,#dfc48e_100%)] text-[#4d3b21] shadow-[inset_2px_2px_3px_rgba(255,255,255,0.85),inset_-4px_-4px_8px_rgba(70,45,15,0.25)] [transform:translateZ(20px)]">
                <div className="absolute inset-2 rounded-[21px] border border-[#8e703e]/30" />

                <Factory
                  className="size-11"
                  strokeWidth={1.2}
                />

                <div className="absolute left-3 top-2 h-2 w-12 -rotate-12 rounded-full bg-white/50 blur-sm" />
              </div>
            </div>
          </div>

          <span className="block text-[9px] uppercase leading-6 tracking-[0.24em] text-[#c7ab77]">
            {visit.eyebrow}
          </span>

          <h2
            id="visit-heading"
            className="mt-4 font-serif text-4xl font-normal leading-[1.12] tracking-tight sm:text-5xl"
          >
            {visit.title}

            <span className="mt-1 block italic text-[#c7ab77]">
              {visit.highlightedTitle}
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-8 text-[#bcb1a0]">
            {visit.description}
          </p>

          <a
            href={`mailto:${business.email}?subject=${encodeURIComponent(
              visit.button,
            )}`}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "mt-8 h-auto min-h-12 max-w-full justify-between gap-6 whitespace-normal rounded-xl border border-[#f1dfbc]/70 bg-[#eadcc2] px-6 py-4 text-left text-xs leading-5 text-[#30261a]",
              "shadow-[0_4px_0_#8d754e,0_12px_20px_-10px_rgba(0,0,0,0.5)]",
              "hover:bg-[#f5ead6]",
            )}
          >
            <span>{visit.button}</span>

            <ArrowUpRight
              className="size-4 shrink-0"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* Layered visit steps */}
        <ol className="relative m-0 grid list-none gap-6 p-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 left-8 top-8 w-px bg-gradient-to-b from-accent/10 via-accent/60 to-accent/10"
          />

          {visit.steps.map((step, index) => {
            const StepIcon =
              stepIcons[index % stepIcons.length];

            return (
              <li
                key={step.number}
                className="group relative [perspective:1000px]"
              >
                {/* Visible card thickness */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[22px] border border-[#8b734d]/25 bg-[#4a3d29]"
                />

                <div className="relative flex gap-4 rounded-[22px] border border-[#c3a56f]/25 bg-[linear-gradient(125deg,#302b23,#211f1a)] p-5 shadow-[0_14px_24px_-16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-500 [transform-style:preserve-3d] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:[transform:translateY(-4px)_rotateY(-3deg)] motion-reduce:transition-none sm:gap-5 sm:p-6">
                  {/* Raised step icon */}
                  <div
                    aria-hidden="true"
                    className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#dfc58e]/50 bg-[linear-gradient(135deg,#e6d0a2,#b5945b_65%,#8b6b38)] text-[#43331d] shadow-[3px_4px_0_#70582f,5px_8px_12px_rgba(0,0,0,0.25),inset_0_1px_2px_rgba(255,255,255,0.65)] [transform:translateZ(20px)]"
                  >
                    <StepIcon
                      className="size-5"
                      strokeWidth={1.3}
                    />
                  </div>

                  <div className="min-w-0 flex-1 [transform:translateZ(12px)]">
                    <span className="block font-serif text-xs italic tracking-wider text-[#bfa16c]">
                      {step.number}
                    </span>

                    <h3 className="mt-1 font-serif text-xl font-normal leading-snug text-[#f1e7d5] sm:text-2xl">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-[#b6ac9c]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}