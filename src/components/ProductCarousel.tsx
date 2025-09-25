import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router";

export function ProductCarousel({ supabaseUrl }: { supabaseUrl: string }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      plugins={[plugin.current]}
      setApi={setApi}
      className="w-full max-w-5xl mx-auto"
      opts={{
        duration: 100, // default 25 → higher = smoother/slower
        dragFree: true, // free momentum-like scroll
        loop: true, // seamless looping
        align: "center", // feels smoother than "start"
      }}
    >
      <div className="relative">
        <CarouselContent>
          <CarouselItem>
            <Link to="/phones">
              <div>
                <img
                  className="hidden lg:block"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-phones-lg.jpg`}
                  alt="carousel"
                />
                <img
                  className="hidden sm:block lg:hidden"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-phones-lg.jpg`}
                  alt="carousel"
                />
                <img
                  className="block sm:hidden"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-sm.png`}
                  alt="carousel"
                />
              </div>
            </Link>
          </CarouselItem>

          <CarouselItem>
            <Link to="/phones">
              <div>
                <img
                  className="hidden lg:block"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-gadgets-lg.jpg`}
                  alt="carousel"
                />
                <img
                  className="hidden sm:block lg:hidden"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-gadgets-lg.jpg`}
                  alt="carousel"
                />
                <img
                  className="block sm:hidden"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-sm.png`}
                  alt="carousel"
                />
              </div>
            </Link>
          </CarouselItem>
          <CarouselItem>
            <Link to="/phones">
              <div>
                <img
                  className="hidden lg:block"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-tablet-lg.jpg`}
                  alt="carousel"
                />
                <img
                  className="hidden sm:block lg:hidden"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-tablet-lg.jpg`}
                  alt="carousel"
                />
                <img
                  className="block sm:hidden"
                  src={`${supabaseUrl}/storage/v1/object/public/product-images/img/home-carousel-sm.png`}
                  alt="carousel"
                />
              </div>
            </Link>
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
