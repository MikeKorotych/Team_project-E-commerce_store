import { useMemo } from "react";

type SortOrder = "asc" | "desc"; // for future improvements

export function useSortProducts<T>(
  items: T[],
  field: keyof T,
  order: SortOrder = "asc"
): T[] {
  return useMemo(() => {
    if (!items || items.length === 0) {
      return [];
    }

    const sorted = [...items].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });

    return sorted;
  }, [items, field, order]);
}
