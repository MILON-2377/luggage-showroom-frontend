export function normalizeSearch(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function matchesSearch(
  text: string,
  query: string,
): boolean {
  const normalized = normalizeSearch(text);
  const words = normalizeSearch(query).split(" ").filter(Boolean);

  return words.every((word) => normalized.includes(word));
}