import { allowedExtensions, quoteConfig } from "../data/quote.config";
export function validateFiles(files: File[]) {
  return (
    files.length <= quoteConfig.maxFiles &&
    files.reduce((sum, f) => sum + f.size, 0) <= quoteConfig.maxTotalBytes &&
    files.every(
      (f) =>
        f.size > 0 &&
        f.size <= quoteConfig.maxFileBytes &&
        allowedExtensions.includes(
          f.name.split(".").pop()?.toLowerCase() || "",
        ),
    )
  );
}
// Client checks are convenience only. A live server must inspect and scan every file privately.
