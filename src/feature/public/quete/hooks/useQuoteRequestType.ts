"use client";
import { useEffect } from "react";
import type { UpdateField, RequestType } from "../types/quote.types";
export default function useQuoteRequestType(update: UpdateField) {
  useEffect(() => {
    const sync = () => {
      const type = new URLSearchParams(window.location.search).get("type");
      if (type && ["product", "sample", "custom"].includes(type))
        update("type", type as RequestType);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [update]);
}
