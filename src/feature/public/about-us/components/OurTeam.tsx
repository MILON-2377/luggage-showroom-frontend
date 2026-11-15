"use client";

import { DepthCard } from "./About3D";

import { Users, UserRound } from "lucide-react";
import { useLanguage } from "@/src/providers";

export interface TeamMember {
  name: string;
  position: string;
  description?: string;
  image?: string;
}

export interface OurTeamProps {
  members: TeamMember[];
}

export default function OurTeam({ members }: OurTeamProps) {
  const { t } = useLanguage();
  const translations = t.aboutUs.team;

  if (members.length === 0) return null;

  const gridColumns =
    members.length === 1
      ? "grid-cols-1"
      : members.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-28">
      {/* Architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 -top-48 -z-10 size-[600px] rounded-full border border-accent/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 -z-10 size-[460px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section introduction */}
        <div className="border-t border-border pt-7">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-accent/25 bg-surface/70 text-accent">
              <Users
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {translations.eyebrow}
            </span>

            <span
              aria-hidden="true"
              className="ml-auto h-px w-12 bg-accent/30 sm:w-24"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <h2 className="max-w-2xl break-words font-serif text-4xl font-normal leading-[1.15] tracking-tight text-primary sm:text-5xl lg:text-6xl">
              {translations.title}
            </h2>

            <p className="max-w-xl text-sm leading-8 text-secondary sm:text-base">
              {translations.description}
            </p>
          </div>
        </div>

        {/* Team portraits */}
        <div
          className={`mt-12 grid items-stretch gap-6 lg:mt-16 lg:gap-8 ${gridColumns}`}
        >
          {members.map((member, index) => (
            <DepthCard as="article"
              key={`${member.name}-${member.position}-${index}`}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-t-[120px] rounded-b-lg border border-border bg-surface transition-all duration-500  hover:border-accent/35 hover:shadow-2xl hover:shadow-primary/5 motion-reduce:transform-none motion-reduce:transition-none sm:rounded-t-[150px] ${
                members.length === 1
                  ? "mx-auto w-full max-w-md"
                  : ""
              }`}
            >
              {/* Portrait */}
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-muted">
                {member.image ? (
                  <>
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"
                    />
                  </>
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/10 to-surface-muted"
                  >
                    <div className="absolute size-64 rounded-full border border-accent/20" />

                    <div className="absolute size-44 rounded-full border border-dashed border-accent/20" />

                    <div className="relative flex size-24 items-center justify-center rounded-full border border-accent/25 bg-surface/70 text-accent shadow-xl shadow-accent/10">
                      <UserRound
                        className="size-10"
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                )}

                {/* Portrait index */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-5 left-5 flex size-9 items-center justify-center rounded-full border font-serif text-xs italic backdrop-blur-md sm:bottom-6 sm:left-6 ${
                    member.image
                      ? "border-white/30 bg-primary/10 text-white"
                      : "border-accent/25 bg-background/70 text-accent"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Member information */}
              <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="mb-5 h-px w-10 bg-accent/60 transition-all duration-500 group-hover:w-20 motion-reduce:transition-none"
                />

                <h3 className="break-words font-serif text-2xl font-normal leading-snug tracking-tight text-primary sm:text-3xl">
                  {member.name}
                </h3>

                <p className="mt-2 text-[11px] font-medium uppercase leading-6 tracking-[0.14em] text-accent">
                  {member.position}
                </p>

                {member.description && (
                  <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-secondary">
                    {member.description}
                  </p>
                )}
              </div>
            </DepthCard>
          ))}
        </div>
      </div>
    </section>
  );
}