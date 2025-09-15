import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function ProductCarousel() {
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
          {/* Slide 1 */}
          <CarouselItem>
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 gap-6 grid sm:grid-cols-2 items-center"></div>
          </CarouselItem>

          {/* Slide 2 */}
          <CarouselItem>
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 gap-6 grid sm:grid-cols-2 items-center"></div>
          </CarouselItem>
          <CarouselItem>
            <div className="bg-black rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 gap-6 grid sm:grid-cols-2 items-center"></div>
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
