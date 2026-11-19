import { API_CONFIG } from "@/src/config/api";

type ApiGroup = keyof typeof API_CONFIG.PROXY;

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const ENCODED_UNSAFE_SEQUENCE = /%(?:2e|2f|5c|00)/i;

function invalidPath(): never {
  throw new Error("Invalid API path.");
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return invalidPath();
  }
}

function isUnsafeSegment(segment: string): boolean {
  if (!segment || segment === "." || segment === "..") {
    return true;
  }

  const decoded = decodeSegment(segment);

  return (
    decoded === "." ||
    decoded === ".." ||
    decoded.includes("/") ||
    decoded.includes("\\") ||
    CONTROL_CHARACTERS.test(decoded) ||
    ENCODED_UNSAFE_SEQUENCE.test(decoded)
  );
}

export function buildApiPath(
  group: ApiGroup,
  path: string,
): string {
  if (typeof path !== "string") {
    return invalidPath();
  }

  const trimmed = path.trim();

  if (
    !trimmed ||
    trimmed.startsWith("//") ||
    SCHEME_PATTERN.test(trimmed) ||
    CONTROL_CHARACTERS.test(trimmed) ||
    trimmed.includes("\\") ||
    trimmed.includes("#")
  ) {
    return invalidPath();
  }

  const normalized = trimmed.replace(/^\/+/, "");
  const queryIndex = normalized.indexOf("?");

  const pathname =
    queryIndex === -1
      ? normalized
      : normalized.slice(0, queryIndex);

  const search =
    queryIndex === -1
      ? ""
      : normalized.slice(queryIndex);

  if (!pathname) {
    return invalidPath();
  }

  const segments = pathname.split("/");

  if (segments.some(isUnsafeSegment)) {
    return invalidPath();
  }

  const encodedPath = segments
    .map((segment) => encodeURIComponent(decodeSegment(segment)))
    .join("/");

  return `${API_CONFIG.PROXY[group]}/${encodedPath}${search}`;
}