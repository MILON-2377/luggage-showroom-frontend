"use client";

import { DepthCard } from "./About3D";

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleMinus,
  Clock3,
  Factory,
  FileCheck,
  MapPin,
  Video,
} from "lucide-react";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useLanguage } from "@/src/providers";

export interface CompanyVerificationProps {
  legalCompanyName: string;
  registrationNumber?: string;
  businessLicense?: string;
  factoryAddress: string;
  headOfficeAddress?: string;
  factoryVisitAvailable?: boolean;
  videoAuditAvailable?: boolean;
  factoryVisitUrl?: string;
}

export default function CompanyVerification({
  legalCompanyName,
  registrationNumber,
  businessLicense,
  factoryAddress,
  headOfficeAddress,
  factoryVisitAvailable,
  videoAuditAvailable,
  factoryVisitUrl,
}: CompanyVerificationProps) {
  const { t } = useLanguage();
  const translations = t.aboutUs.verification;

  const details = [
    {
      key: "company",
      icon: Building2,
      label: translations.legalCompanyName,
      value: legalCompanyName,
    },
    {
      key: "registration",
      icon: FileCheck,
      label: translations.registrationNumber,
      value: registrationNumber,
    },
    {
      key: "license",
      icon: FileCheck,
      label: translations.businessLicense,
      value: businessLicense,
    },
    {
      key: "factory",
      icon: MapPin,
      label: translations.factoryAddress,
      value: factoryAddress,
    },
    {
      key: "office",
      icon: MapPin,
      label: translations.headOfficeAddress,
      value: headOfficeAddress,
    },
  ].filter(
    (item): item is typeof item & { value: string } =>
      typeof item.value === "string" && item.value.trim().length > 0,
  );

  const accessOptions = [
    {
      key: "visit",
      icon: Factory,
      title: translations.factoryVisits,
      available: factoryVisitAvailable,
      description:
        factoryVisitAvailable === undefined
          ? translations.visitPending
          : factoryVisitAvailable
            ? translations.visitAvailable
            : translations.visitUnavailable,
      href: factoryVisitUrl,
    },
    {
      key: "video",
      icon: Video,
      title: translations.videoFactoryAudit,
      available: videoAuditAvailable,
      description:
        videoAuditAvailable === undefined
          ? translations.videoAuditPending
          : videoAuditAvailable
            ? translations.videoAuditAvailable
            : translations.videoAuditUnavailable,
      href: undefined,
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 text-foreground sm:py-20 lg:py-28">
      {/* Architectural background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 -z-10 size-[580px] rounded-full border border-accent/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -left-40 -z-10 size-[520px] rounded-full bg-accent/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section introduction */}
        <div className="border-t border-border pt-7">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-accent/25 bg-surface/70 text-accent">
              <Building2
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

        <div className="mt-12 grid items-start gap-8 lg:mt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          {/* Company records */}
          <dl className="grid min-w-0 gap-4 sm:grid-cols-2">
            {details.map((item, index) => {
              const Icon = item.icon;
              const isCompanyName = item.key === "company";

              return (
                <DepthCard as="div"
                  key={item.key}
                  className={cn(
                    "group relative min-w-0 overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                    " motion-reduce:transform-none motion-reduce:transition-none",
                    isCompanyName
                      ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/5 sm:col-span-2 sm:p-8"
                      : "border-border bg-surface/80 hover:border-accent/35 hover:shadow-lg hover:shadow-primary/5",
                  )}
                >
                  {isCompanyName && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-12 -top-24 size-56 rounded-full border border-accent/20"
                    />
                  )}

                  <div className="relative mb-6 flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full border",
                        isCompanyName
                          ? "border-accent/35 bg-accent/10 text-accent"
                          : "border-accent/20 bg-accent/5 text-accent",
                      )}
                    >
                      <Icon
                        className="size-[19px]"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "font-serif text-sm italic",
                        isCompanyName
                          ? "text-primary-foreground/35"
                          : "text-secondary/50",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <dt
                    className={cn(
                      "relative text-[10px] font-medium uppercase leading-5 tracking-[0.16em]",
                      isCompanyName
                        ? "text-primary-foreground/55"
                        : "text-secondary",
                    )}
                  >
                    {item.label}
                  </dt>

                  <dd
                    className={cn(
                      "relative mt-3 break-words",
                      isCompanyName
                        ? "font-serif text-2xl font-normal leading-relaxed sm:text-3xl"
                        : "text-sm font-medium leading-7 text-primary",
                    )}
                  >
                    {item.value}
                  </dd>

                  <div
                    aria-hidden="true"
                    className={cn(
                      "relative mt-6 h-px w-10 transition-all duration-300 group-hover:w-16 motion-reduce:transition-none",
                      isCompanyName
                        ? "bg-accent/60"
                        : "bg-accent/35",
                    )}
                  />
                </DepthCard>
              );
            })}
          </dl>

          {/* Factory visits and video audits */}
          <div className="grid gap-5 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1">
            {accessOptions.map((option) => {
              const Icon = option.icon;

              const StatusIcon =
                option.available === undefined
                  ? Clock3
                  : option.available
                    ? CheckCircle2
                    : CircleMinus;

              return (
                <DepthCard as="article"
                  key={option.key}
                  className="group relative min-w-0 overflow-hidden rounded-2xl border border-accent/20 bg-surface-muted p-6 transition-colors duration-300 hover:border-accent/40 motion-reduce:transition-none sm:p-7"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full border border-accent/25 bg-background text-accent">
                      <Icon
                        className="size-5"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </span>

                    <StatusIcon
                      className={cn(
                        "size-[18px]",
                        option.available === true
                          ? "text-accent"
                          : "text-secondary/60",
                      )}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="break-words font-serif text-2xl font-normal leading-snug tracking-tight text-primary">
                    {option.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-secondary">
                    {option.description}
                  </p>

                  {option.href && (
                    <a
                      href={option.href}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "sm",
                        }),
                        "mt-6 h-auto min-h-9 w-full justify-between gap-3 whitespace-normal py-2.5 text-left leading-5",
                      )}
                    >
                      {translations.viewVisitInformation}

                      <ArrowUpRight
                        className="size-4 shrink-0 text-accent"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </DepthCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}