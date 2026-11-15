"use client";
import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MessagesSquare } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/lebel";
import { useLanguage } from "@/src/providers";
export default function ProductInquiryActions({
  productId,
  color,
}: {
  productId: string;
  color: string;
}) {
  const { t } = useLanguage();
  const c = t.productDetails;
  const router = useRouter();
  const [quantity, setQuantity] = useState("");
  const id = useId();
  function inquire() {
    const query = new URLSearchParams({ product: productId });
    if (color) query.set("color", color);
    if (quantity && Number(quantity) > 0) query.set("quantity", quantity);
    router.push("/quote?" + query.toString());
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_120px] items-center gap-4">
        <Label htmlFor={id} className="text-xs text-secondary">
          {c.quantity}
        </Label>
        <Input
          id={id}
          type="number"
          min="1"
          step="1"
          max="100000000"
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={c.optional}
          className="rounded-xl"
        />
      </div>
      <Button
        size="lg"
        onClick={inquire}
        className="h-auto min-h-14 w-full justify-between gap-4 rounded-xl py-4 whitespace-normal text-left"
      >
        <span>
          <span className="block text-xs uppercase tracking-wider">
            {c.quote}
          </span>
          <span className="mt-1 block text-[10px] font-normal text-primary-foreground/60">
            {c.quoteNote}
          </span>
        </span>
        <ArrowUpRight className="size-4 shrink-0" />
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/contact-us")}
        className="w-full justify-between gap-3 rounded-xl"
      >
        <span className="flex items-center gap-2">
          <MessagesSquare className="size-4 text-accent" />
          {c.discuss}
        </span>
        <ArrowUpRight className="size-4 text-accent" />
      </Button>
    </div>
  );
}
