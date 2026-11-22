"use client";
import { Info } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Input } from "@/src/components/ui/input";
import useQuoteForm from "../hooks/useQuoteForm";
import type { QuoteCopy } from "../types/quote.types";
import QuoteRequestTypeSelector from "./QuoteRequestTypeSelector";
import QuoteContactFields from "./QuoteContactFields";
import QuoteMessageField from "./QuoteMessageField";
import QuoteAdditionalDetails from "./QuoteAdditionalDetails";
import QuoteFileUpload from "./QuoteFileUpload";
import QuoteConsent from "./QuoteConsent";
import QuoteSubmitButton from "./QuoteSubmitButton";
import QuoteFormFeedback from "./QuoteFormFeedback";
import QuoteInquirySummary from "./QuoteInquirySummary";
import QuoteContactAlternative from "./QuoteContactAlternative";
import { panel } from "./QuoteUi";
export default function QuoteForm({ copy }: { copy: QuoteCopy }) {
  const f = useQuoteForm(copy);
  const props = { copy, values: f.values, update: f.update };
  return (
    <section
      id="quote-form"
      className="scroll-mt-28 px-5 py-16 sm:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <Badge
          variant="outline"
          className="border-accent/30 px-3 py-2 text-accent"
        >
          {copy.form.eyebrow}
        </Badge>
        <h2 className="mt-5 font-serif text-4xl sm:text-5xl">
          {copy.form.title}
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          {copy.form.description}
        </p>
        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form
            onSubmit={f.submit}
            className={panel + " min-w-0 space-y-8 p-5 sm:p-8"}
          >
            <Alert variant="warning">
              <Info className="size-4" />
              <AlertDescription>{copy.form.demo}</AlertDescription>
            </Alert>
            <QuoteRequestTypeSelector {...props} />
            <div className="h-px bg-border" />
            <QuoteContactFields {...props} />
            <QuoteMessageField {...props} />
            <QuoteAdditionalDetails {...props}>
              <QuoteFileUpload
                copy={copy}
                files={f.files}
                onChange={f.setFiles}
              />
            </QuoteAdditionalDetails>
            <div hidden aria-hidden="true">
              <label htmlFor="quote-website">{copy.form.website}</label>
              <Input
                id="quote-website"
                tabIndex={-1}
                autoComplete="off"
                value={f.values.website}
                onChange={(e) => f.update("website", e.target.value)}
              />
            </div>
            <QuoteConsent {...props} />
            <QuoteFormFeedback copy={copy} error={f.error} />
            <QuoteSubmitButton copy={copy} busy={f.busy} />
            <p className="text-center text-xs leading-6 text-muted-foreground">
              {copy.form.submitNote}
            </p>
          </form>
          <aside className="space-y-7 lg:sticky lg:top-24">
            <QuoteInquirySummary
              copy={copy}
              values={f.values}
              fileCount={f.files.length}
            />
            <QuoteContactAlternative copy={copy} />
          </aside>
        </div>
      </div>
    </section>
  );
}
