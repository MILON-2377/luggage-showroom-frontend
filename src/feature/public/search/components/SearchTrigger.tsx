"use client";

import { Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useLanguage } from "@/src/providers";

export default function SearchTrigger({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const { t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onOpen}
      aria-label={t.search.open}
      aria-haspopup="dialog"
      className="rounded-full"
    >
      <Search className="size-5" aria-hidden="true" />
    </Button>
  );
}