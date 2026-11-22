export const quoteConfig = {
  mode: "demo" as const,
  maxFileBytes: 10 * 1024 * 1024,
  maxTotalBytes: 25 * 1024 * 1024,
  maxFiles: 5,
  privacyHref: "",
};
export const allowedExtensions = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "zip",
  "xls",
  "xlsx",
  "csv",
  "svg",
  "ai",
  "eps",
];
export const receiptStorageKey = "chucheng-quote-demo-v1";
