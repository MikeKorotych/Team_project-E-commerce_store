import type { ProductTypes } from "@/types/Product";
import { supabase } from "./supabase";

export const fetchProductsByType = async (type: ProductTypes) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", type);

  if (error)
    throw new Error(`Error fetching products from Database: ${error.message}`);

  return data;
};

export const sortByOptions = [
  { value: "newest", label: "Newest" },
  { value: "priceRegular", label: "Price" },
  { value: "name", label: "Name" },
  { value: "color", label: "Color" },
  { value: "resolution", label: "Resolution" },
  { value: "ram", label: "Memory" },
];

export const itemsPerPageOptions = [
  { value: "8", label: "8" },
  { value: "16", label: "16" },
  { value: "24", label: "24" },
  { value: "32", label: "32" },
];

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
}
