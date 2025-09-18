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
  { value: "color", label: "Coclor" },
  { value: "resolution", label: "Resolution" },
  { value: "ram", label: "Memory" },
];

export const itemsPerPageOptions = [
  { value: "8", label: "8" },
  { value: "16", label: "16" },
  { value: "32", label: "32" },
  { value: "24", label: "24" },
];
