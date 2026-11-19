"use client";

import { useEffect, useState } from "react";
import { normalizeSearch } from "../utils/search.utils";

const STORAGE_KEY = "bagguage-recent-searches";
const LIMIT = 6;

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]",
      );

      if (Array.isArray(stored)) {
        setRecent(
          stored
            .filter(
              (item): item is string =>
                typeof item === "string" &&
                item.trim().length > 0,
            )
            .slice(0, LIMIT),
        );
      }
    } catch {
      // Search remains available when browser storage is unavailable.
    }
  }, []);

  function remember(value: string) {
    const term = value.trim().slice(0, 120);
    if (!term) return;

    setRecent((previous) => {
      const next = [
        term,
        ...previous.filter(
          (item) =>
            normalizeSearch(item) !== normalizeSearch(term),
        ),
      ].slice(0, LIMIT);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Keep this session's history in memory.
      }

      return next;
    });
  }

  function clearHistory() {
    setRecent([]);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing else is required.
    }
  }

  return { recent, remember, clearHistory };
}