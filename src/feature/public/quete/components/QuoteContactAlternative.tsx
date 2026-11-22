import { Phone, MapPin } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteContactAlternative({ copy }: { copy: QuoteCopy }) {
  return (
    <section className="rounded-[24px] border border-border bg-white/70 p-6 shadow-[3px_4px_0_#d9cbb0]">
      <h2 className="font-serif text-2xl">{copy.contact.title}</h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {copy.contact.description}
      </p>
      <p className="mt-5 font-medium">{copy.contact.person}</p>
      <p className="mt-2 text-sm">{copy.contact.phone}</p>
      <p className="mt-4 flex gap-2 text-sm leading-6 text-muted-foreground">
        <MapPin className="mt-1 size-4 shrink-0" />
        {copy.contact.office}
      </p>
      <Button
        variant="outline"
        className="mt-6 w-full rounded-xl"
        onClick={() => {
          window.location.href = "tel:+8618257804587";
        }}
      >
        <Phone className="size-4" />
        {copy.contact.button}
      </Button>
    </section>
  );
}
