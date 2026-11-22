"use client";
import { useId, useState } from "react";
import { UploadCloud, ShieldAlert } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { quoteConfig, allowedExtensions } from "../data/quote.config";
import { validateFiles } from "../utils/quote-file.validation";
import QuoteFileItem from "./QuoteFileItem";
import type { QuoteCopy } from "../types/quote.types";
export default function QuoteFileUpload({
  copy,
  files,
  onChange,
}: {
  copy: QuoteCopy;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const id = useId(),
    [error, setError] = useState(""),
    [drag, setDrag] = useState(false);
  function add(incoming: File[]) {
    const next = [...files, ...incoming];
    if (!validateFiles(next)) {
      setError(copy.upload.invalid);
      return;
    }
    setError("");
    onChange(next);
  }
  return (
    <section aria-labelledby={id + "-heading"}>
      <h3 id={id + "-heading"} className="font-serif text-2xl">
        {copy.upload.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {copy.upload.description}
      </p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(Array.from(e.dataTransfer.files));
        }}
        className={
          "mt-5 rounded-2xl border border-dashed p-6 text-center transition-colors " +
          (drag
            ? "border-primary bg-accent/10"
            : "border-accent/40 bg-white/60")
        }
      >
        <UploadCloud className="mx-auto mb-4 size-9 text-accent" />
        <Input
          className="sr-only"
          type="file"
          id={id}
          multiple
          accept={allowedExtensions.map((e) => "." + e).join(",")}
          onChange={(e) => {
            add(Array.from(e.target.files || []));
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById(id)?.click()}
        >
          {copy.upload.choose}
        </Button>
        <p className="mt-3 text-sm">{copy.upload.drop}</p>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          {copy.upload.limits
            .replace("{count}", String(quoteConfig.maxFiles))
            .replace("{size}", String(quoteConfig.maxFileBytes / 1024 / 1024))
            .replace(
              "{total}",
              String(quoteConfig.maxTotalBytes / 1024 / 1024),
            )}
          <br />
          {copy.upload.formats}
        </p>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-muted-foreground">
        <ShieldAlert className="mt-1 size-4 shrink-0" />
        {copy.upload.local}
      </p>
      <ul aria-label={copy.upload.count} className="mt-4 space-y-2">
        {files.map((file, i) => (
          <QuoteFileItem
            key={file.name + "-" + i}
            file={file}
            copy={copy}
            remove={() => onChange(files.filter((_, n) => n !== i))}
          />
        ))}
      </ul>
    </section>
  );
}
