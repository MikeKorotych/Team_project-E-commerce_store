import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import type { Product } from "@/types/Product";
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  product: Product[];
};

export const ModelsRow: React.FC<Props> = ({ title, product }) => {
  return (
    <>
      <div className="max-w-[1136px]">
        <div className="flex justify-between py-[24px]">
          <h2 className="font-bold text-[22px] sm:text-[32px]">{title}</h2>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="border border-solid border-gray-500"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              className="border border-solid border-gray-500"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex justify-between gap-4">
            {product?.map((phone) => (
              <div className="min-w-[250px] flex-shrink-0 ">
                <Link to={`/product/${phone.id}`}>
                  <ProductCard key={phone.id} product={phone} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
