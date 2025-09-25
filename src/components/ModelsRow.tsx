import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import type { Product } from "@/types/Product";
import { useRef, useState, useEffect } from "react";

type Props = {
  title: string;
  product?: Product[];
};

export const ModelsRow: React.FC<Props> = ({ title, product }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  useEffect(() => {
    checkScroll(); // при первом рендере
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-[1136px]">
      <div className="flex justify-between py-[24px]">
        <h2 className="font-bold text-[22px] sm:text-[32px]">{title}</h2>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="border border-solid border-gray-500"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            className="border border-solid border-gray-500"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-9">
          {product?.map((phone) => (
            <div key={phone.id} className="w-[250px] flex-shrink-0">
              <ProductCard product={phone} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
