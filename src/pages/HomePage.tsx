import { ProductCard } from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/types/Product";

import phonesFromApi from '../../api/phones.json';

export const HomePage = () => {
  const phones: Product[] = phonesFromApi;

  return (
    <>
      <h1 className="text-2xl font-bold ">Welcome to Nice Gadgets store!</h1>
      <div className="">
        <Carousel className="w-[600px]">
          <CarouselContent>
            <CarouselItem>
              <img src="https://placehold.co/600x400" alt="logo" />
            </CarouselItem>
            <CarouselItem>
              <img src="https://placehold.co/600x400" alt="logo" />
            </CarouselItem>
            <CarouselItem>
              <img src="https://placehold.co/600x400" alt="logo" />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="rounded-[0px] h-full max-md:hidden" />
          <CarouselNext className="rounded-[0px] h-full" />
        </Carousel>
      </div>
      <div>
        <ProductCard product={phones[0]}/>
      </div>
    </>
  );
};
