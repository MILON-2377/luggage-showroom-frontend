import { LoaderCircle, Send } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteSubmitButton({
  copy,
  busy,
}: {
  copy: QuoteCopy;
  busy: boolean;
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={busy}
      className="h-14 w-full whitespace-normal rounded-xl bg-[#191815] px-5 text-base text-[#f8edda] shadow-[0_5px_0_#9e8352,0_15px_25px_-15px_#000] transition-all hover:-translate-y-0.5 hover:bg-[#302b21] active:translate-y-1 motion-reduce:transform-none"
    >
      {busy ? (
        <LoaderCircle className="size-5 animate-spin" />
      ) : (
        <Send className="size-5" />
      )}
      {busy ? copy.form.submitting : copy.form.submit}
    </Button>
  );
}
