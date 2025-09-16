import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Link } from "react-router";

export function ProductCarousel({ supabaseUrl }: { supabaseUrl: string }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className="w-full max-w-5xl mx-auto">
      <div className="relative">
        <CarouselContent>
          <CarouselItem>
            <Link to="/phones">
              <img
                src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-lg.png`}
                alt="carousel"
              />
            </Link>
          </CarouselItem>

          <CarouselItem>
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-lg.png`}
              alt="carousel"
            />
          </CarouselItem>
          <CarouselItem>
            <img
              src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-lg.png`}
              alt="carousel"
            />
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious className="hidden sm:flex h-full rounded = [0]" />
        <CarouselNext className="hidden sm:flex h-full rounded = [0]" />
      </div>

      <div className="flex justify-center gap-2 mt-4 pb-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`transition-all  ${
              current === index ? "w-5 h-1.5 bg-white" : "w-5 h-1.5 bg-gray-500"
            }`}
          />
        ))}
      </div>
    </Carousel>
  );
}
