import { ProductCard } from "@/components/ProductCard";

import type { Product } from "@/types/Product";

import phonesFromApi from "../../api/phones.json";
import { ProductCarousel } from "@/components/ProductCarousel";

export const HomePage = () => {
  const phones: Product[] = phonesFromApi;

  return (
    <>
      <h1 className="text-2xl font-bold ">Welcome to Nice Gadgets store!</h1>
      <div className="">
        <ProductCarousel />
      </div>
      <div>
        <ProductCard product={phones[0]} />
      </div>
    </>
  );
};
