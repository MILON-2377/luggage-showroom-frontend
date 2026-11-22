"use client";
import { useCallback, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { QuoteValues, UpdateField, QuoteCopy } from "../types/quote.types";
import { validateQuote } from "../utils/quote.validation";
import { validateFiles } from "../utils/quote-file.validation";
import { previewQuote } from "../services/quote.service";
import useQuoteRequestType from "./useQuoteRequestType";
const initial: QuoteValues = {
  name: "",
  company: "",
  email: "",
  country: "",
  type: "product",
  message: "",
  phone: "",
  category: "",
  models: "",
  quantity: "",
  price: "",
  currency: "USD",
  delivery: "",
  customization: "",
  consent: false,
  website: "",
};
export default function useQuoteForm(copy: QuoteCopy) {
  const router = useRouter();
  const [values, setValues] = useState(initial),
    [files, setFiles] = useState<File[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const update: UpdateField = useCallback(
    (key, value) => setValues((old) => ({ ...old, [key]: value })),
    [],
  );
  useQuoteRequestType(update);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const invalid = validateQuote(values);
    if (invalid) {
      setError(copy.form[invalid]);
      return;
    }
    if (!validateFiles(files)) {
      setError(copy.upload.invalid);
      return;
    }
    setError("");
    setBusy(true);
    try {
      await previewQuote(values);
      router.push("/quote/submitted");
    } catch {
      setError(copy.form.failed);
      setBusy(false);
    }
  }
  return { values, update, files, setFiles, error, busy, submit };
}
